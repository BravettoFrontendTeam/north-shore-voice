"use strict";
/**
 * Twilio Telephony Provider
 * Premium option with excellent documentation
 * Voice: $0.013/min
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioProvider = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class TwilioProvider {
    constructor(config) {
        this.name = 'twilio';
        this.accountSid = config.accountSid;
        this.authToken = config.authToken;
        this.defaultFrom = config.defaultFromNumber;
        this.webhookBaseUrl = config.webhookBaseUrl;
        this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}`;
    }
    async request(endpoint, method = 'GET', body) {
        const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
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
            throw new Error(`Twilio API error: ${response.status} - ${error}`);
        }
        return response.json();
    }
    async makeCall(request) {
        try {
            const payload = {
                From: request.from || this.defaultFrom,
                To: request.to,
                Url: request.webhookUrl || `${this.webhookBaseUrl}/twilio/voice`,
                Method: 'POST',
                Timeout: String(request.timeout || 30),
                StatusCallback: request.statusCallbackUrl || `${this.webhookBaseUrl}/twilio/status`,
                StatusCallbackMethod: 'POST',
                StatusCallbackEvent: 'initiated ringing answered completed',
            };
            if (request.machineDetection) {
                payload.MachineDetection = 'Enable';
                payload.MachineDetectionTimeout = '5';
            }
            if (request.recordCall) {
                payload.Record = 'true';
                payload.RecordingStatusCallback = `${this.webhookBaseUrl}/twilio/recording`;
                payload.RecordingStatusCallbackMethod = 'POST';
            }
            const result = await this.request('/Calls.json', 'POST', payload);
            return {
                success: true,
                callId: result.sid,
                provider: 'twilio',
                status: 'queued',
            };
        }
        catch (error) {
            return {
                success: false,
                callId: '',
                provider: 'twilio',
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
            direction: result.direction === 'outbound-api' ? 'outbound' : 'inbound',
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
            // Update the call with a new TwiML URL that handles the transfer
            await this.request(`/Calls/${callId}.json`, 'POST', {
                Url: `${this.webhookBaseUrl}/twilio/transfer?to=${encodeURIComponent(transferTo)}`,
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
            };
            if (request.statusCallbackUrl) {
                payload.StatusCallback = request.statusCallbackUrl;
            }
            if (request.mediaUrls?.length) {
                request.mediaUrls.forEach((url, i) => {
                    payload[`MediaUrl${i}`] = url;
                });
            }
            const result = await this.request('/Messages.json', 'POST', payload);
            return {
                success: true,
                messageId: result.sid,
                provider: 'twilio',
                status: 'queued',
            };
        }
        catch (error) {
            return {
                success: false,
                messageId: '',
                provider: 'twilio',
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
            monthlyPrice: 1.15, // Twilio typical price
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
            monthlyPrice: 1.15,
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
            provider: 'twilio',
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
    // Twilio-specific helper methods
    async getRecordings(callId) {
        try {
            const result = await this.request(`/Calls/${callId}/Recordings.json`);
            return result.recordings.map((r) => `https://api.twilio.com${r.uri.replace('.json', '.mp3')}`);
        }
        catch {
            return [];
        }
    }
    async getTranscriptions(callId) {
        try {
            const recordings = await this.request(`/Calls/${callId}/Recordings.json`);
            const transcriptions = [];
            for (const recording of recordings.recordings) {
                const trans = await this.request(`/Recordings/${recording.sid}/Transcriptions.json`);
                transcriptions.push(...trans.transcriptions.map((t) => t.transcription_text));
            }
            return transcriptions;
        }
        catch {
            return [];
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
        return statusMap[status?.toLowerCase()] || 'failed';
    }
    mapWebhookEvent(status) {
        const eventMap = {
            'initiated': 'call.initiated',
            'ringing': 'call.ringing',
            'in-progress': 'call.answered',
            'completed': 'call.completed',
            'failed': 'call.failed',
            'busy': 'call.failed',
            'no-answer': 'call.failed',
            'delivered': 'sms.delivered',
            'sent': 'sms.delivered',
        };
        return eventMap[status?.toLowerCase()] || 'call.initiated';
    }
}
exports.TwilioProvider = TwilioProvider;
//# sourceMappingURL=twilio.js.map