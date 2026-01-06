"use strict";
/**
 * SignalWire Telephony Provider
 * Cost: ~25% cheaper than Twilio, Twilio-compatible API
 * Voice: $0.0085/min
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalWireProvider = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class SignalWireProvider {
    constructor(config) {
        this.name = 'signalwire';
        this.projectId = config.projectId;
        this.authToken = config.authToken;
        this.spaceUrl = config.spaceUrl;
        this.defaultFrom = config.defaultFromNumber;
        this.webhookBaseUrl = config.webhookBaseUrl;
        this.baseUrl = `https://${this.spaceUrl}/api/laml/2010-04-01/Accounts/${this.projectId}`;
    }
    async request(endpoint, method = 'GET', body) {
        const auth = Buffer.from(`${this.projectId}:${this.authToken}`).toString('base64');
        const response = await (0, node_fetch_1.default)(`${this.baseUrl}${endpoint}`, {
            method,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            ...(body && { body: new URLSearchParams(body).toString() }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`SignalWire API error: ${response.status} - ${error}`);
        }
        return response.json();
    }
    async makeCall(request) {
        try {
            const payload = {
                From: request.from || this.defaultFrom,
                To: request.to,
                Url: request.webhookUrl || `${this.webhookBaseUrl}/signalwire/voice`,
                Method: 'POST',
                Timeout: String(request.timeout || 30),
                StatusCallback: request.statusCallbackUrl || `${this.webhookBaseUrl}/signalwire/status`,
                StatusCallbackMethod: 'POST',
            };
            if (request.machineDetection) {
                payload.MachineDetection = 'Enable';
            }
            if (request.recordCall) {
                payload.Record = 'true';
                payload.RecordingStatusCallback = `${this.webhookBaseUrl}/signalwire/recording`;
            }
            const result = await this.request('/Calls.json', 'POST', payload);
            return {
                success: true,
                callId: result.sid,
                provider: 'signalwire',
                status: 'queued',
            };
        }
        catch (error) {
            return {
                success: false,
                callId: '',
                provider: 'signalwire',
                status: 'failed',
                error: error.message,
            };
        }
    }
    async getCallStatus(callId) {
        const result = await this.request(`/Calls/${callId}.json`);
        return {
            callId: result.sid,
            status: this.mapStatus(result.status),
            direction: result.direction,
            duration: parseInt(result.duration) || 0,
            from: result.from,
            to: result.to,
            startTime: result.start_time ? new Date(result.start_time) : undefined,
            endTime: result.end_time ? new Date(result.end_time) : undefined,
            cost: parseFloat(result.price) || 0,
        };
    }
    async endCall(callId) {
        try {
            await this.request(`/Calls/${callId}.json`, 'POST', {
                Status: 'completed',
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async transferCall(callId, transferTo) {
        try {
            await this.request(`/Calls/${callId}.json`, 'POST', {
                Url: `${this.webhookBaseUrl}/signalwire/transfer?to=${transferTo}`,
                Method: 'POST',
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async sendSMS(request) {
        try {
            const payload = {
                From: request.from || this.defaultFrom,
                To: request.to,
                Body: request.body,
                StatusCallback: request.statusCallbackUrl || `${this.webhookBaseUrl}/signalwire/sms-status`,
            };
            if (request.mediaUrls?.length) {
                request.mediaUrls.forEach((url, i) => {
                    payload[`MediaUrl${i}`] = url;
                });
            }
            const result = await this.request('/Messages.json', 'POST', payload);
            return {
                success: true,
                messageId: result.sid,
                provider: 'signalwire',
                status: 'queued',
            };
        }
        catch (error) {
            return {
                success: false,
                messageId: '',
                provider: 'signalwire',
                status: 'failed',
                error: error.message,
            };
        }
    }
    async listNumbers() {
        const result = await this.request('/IncomingPhoneNumbers.json');
        return result.incoming_phone_numbers.map((num) => ({
            number: num.phone_number,
            country: num.phone_number.startsWith('+1') ? 'US' : 'Other',
            capabilities: {
                voice: num.capabilities?.voice || true,
                sms: num.capabilities?.sms || true,
                mms: num.capabilities?.mms || false,
            },
            monthlyPrice: 1.0, // SignalWire typical price
        }));
    }
    async purchaseNumber(number) {
        const result = await this.request('/IncomingPhoneNumbers.json', 'POST', {
            PhoneNumber: number,
        });
        return {
            number: result.phone_number,
            country: result.phone_number.startsWith('+1') ? 'US' : 'Other',
            capabilities: {
                voice: true,
                sms: true,
                mms: false,
            },
            monthlyPrice: 1.0,
        };
    }
    async releaseNumber(number) {
        try {
            // Get the SID first
            const numbers = await this.request('/IncomingPhoneNumbers.json');
            const numObj = numbers.incoming_phone_numbers.find((n) => n.phone_number === number);
            if (numObj) {
                await this.request(`/IncomingPhoneNumbers/${numObj.sid}.json`, 'DELETE');
            }
            return true;
        }
        catch {
            return false;
        }
    }
    parseWebhook(payload) {
        const eventType = this.mapWebhookEvent(payload.CallStatus || payload.MessageStatus);
        return {
            provider: 'signalwire',
            eventType,
            callId: payload.CallSid,
            messageId: payload.MessageSid,
            from: payload.From,
            to: payload.To,
            timestamp: new Date(),
            rawPayload: payload,
        };
    }
    async isHealthy() {
        try {
            await this.request('/Calls.json?PageSize=1');
            return true;
        }
        catch {
            return false;
        }
    }
    mapStatus(status) {
        const statusMap = {
            'queued': 'queued',
            'ringing': 'ringing',
            'in-progress': 'in-progress',
            'completed': 'completed',
            'busy': 'busy',
            'no-answer': 'no-answer',
            'failed': 'failed',
            'canceled': 'canceled',
        };
        return statusMap[status.toLowerCase()] || 'failed';
    }
    mapWebhookEvent(status) {
        const eventMap = {
            'initiated': 'call.initiated',
            'ringing': 'call.ringing',
            'in-progress': 'call.answered',
            'completed': 'call.completed',
            'failed': 'call.failed',
            'delivered': 'sms.delivered',
        };
        return eventMap[status?.toLowerCase()] || 'call.initiated';
    }
}
exports.SignalWireProvider = SignalWireProvider;
//# sourceMappingURL=signalwire.js.map