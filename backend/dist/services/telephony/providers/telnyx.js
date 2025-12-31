"use strict";
/**
 * Telnyx Telephony Provider
 * Cost: 50-70% cheaper than Twilio
 * Voice: $0.004-0.008/min
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelnyxProvider = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class TelnyxProvider {
    constructor(config) {
        this.name = 'telnyx';
        this.baseUrl = 'https://api.telnyx.com/v2';
        this.apiKey = config.apiKey;
        this.defaultFrom = config.defaultFromNumber;
        this.webhookBaseUrl = config.webhookBaseUrl;
        this.connectionId = config.connectionId;
    }
    async request(endpoint, method = 'GET', body) {
        const response = await (0, node_fetch_1.default)(`${this.baseUrl}${endpoint}`, {
            method,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            ...(body && { body: JSON.stringify(body) }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Telnyx API error: ${response.status} - ${error}`);
        }
        return response.json();
    }
    async makeCall(request) {
        try {
            const payload = {
                from: request.from || this.defaultFrom,
                to: request.to,
                webhook_url: request.webhookUrl || `${this.webhookBaseUrl}/telnyx/voice`,
                webhook_url_method: 'POST',
                timeout_secs: request.timeout || 30,
            };
            if (this.connectionId) {
                payload.connection_id = this.connectionId;
            }
            if (request.machineDetection) {
                payload.answering_machine_detection = 'detect';
            }
            if (request.recordCall) {
                payload.record = 'record-from-answer';
            }
            const result = await this.request('/calls', 'POST', payload);
            return {
                success: true,
                callId: result.data.call_control_id,
                provider: 'telnyx',
                status: 'queued',
            };
        }
        catch (error) {
            return {
                success: false,
                callId: '',
                provider: 'telnyx',
                status: 'failed',
                error: error.message,
            };
        }
    }
    async getCallStatus(callId) {
        const result = await this.request(`/calls/${callId}`);
        const call = result.data;
        return {
            callId: call.call_control_id,
            status: this.mapStatus(call.state),
            direction: call.direction,
            duration: call.call_duration || 0,
            from: call.from,
            to: call.to,
            startTime: call.start_time ? new Date(call.start_time) : undefined,
            endTime: call.end_time ? new Date(call.end_time) : undefined,
            recordingUrl: call.record?.recording_urls?.[0],
            cost: parseFloat(call.cost?.amount) || 0,
        };
    }
    async endCall(callId) {
        try {
            await this.request(`/calls/${callId}/actions/hangup`, 'POST');
            return true;
        }
        catch {
            return false;
        }
    }
    async transferCall(callId, transferTo) {
        try {
            await this.request(`/calls/${callId}/actions/transfer`, 'POST', {
                to: transferTo,
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
                from: request.from || this.defaultFrom,
                to: request.to,
                text: request.body,
                webhook_url: request.statusCallbackUrl || `${this.webhookBaseUrl}/telnyx/sms-status`,
            };
            if (request.mediaUrls?.length) {
                payload.media_urls = request.mediaUrls;
                payload.type = 'MMS';
            }
            const result = await this.request('/messages', 'POST', payload);
            return {
                success: true,
                messageId: result.data.id,
                provider: 'telnyx',
                status: 'queued',
            };
        }
        catch (error) {
            return {
                success: false,
                messageId: '',
                provider: 'telnyx',
                status: 'failed',
                error: error.message,
            };
        }
    }
    async listNumbers() {
        const result = await this.request('/phone_numbers');
        return result.data.map((num) => ({
            number: num.phone_number,
            country: num.address?.country_code || 'US',
            capabilities: {
                voice: true,
                sms: num.messaging_profile_id ? true : false,
                mms: num.messaging_profile_id ? true : false,
            },
            monthlyPrice: parseFloat(num.monthly_cost?.amount) || 0,
        }));
    }
    async purchaseNumber(number) {
        const result = await this.request('/number_orders', 'POST', {
            phone_numbers: [{ phone_number: number }],
        });
        const ordered = result.data.phone_numbers[0];
        return {
            number: ordered.phone_number,
            country: 'US',
            capabilities: {
                voice: true,
                sms: true,
                mms: true,
            },
            monthlyPrice: 1.0,
        };
    }
    async releaseNumber(number) {
        try {
            // Get the number ID first
            const numbers = await this.request(`/phone_numbers?filter[phone_number]=${number}`);
            const numObj = numbers.data[0];
            if (numObj) {
                await this.request(`/phone_numbers/${numObj.id}`, 'DELETE');
            }
            return true;
        }
        catch {
            return false;
        }
    }
    parseWebhook(payload) {
        const eventType = this.mapWebhookEvent(payload.data?.event_type || payload.event_type);
        return {
            provider: 'telnyx',
            eventType,
            callId: payload.data?.payload?.call_control_id,
            messageId: payload.data?.payload?.id,
            from: payload.data?.payload?.from,
            to: payload.data?.payload?.to,
            timestamp: new Date(payload.data?.occurred_at || Date.now()),
            rawPayload: payload,
        };
    }
    async isHealthy() {
        try {
            await this.request('/balance');
            return true;
        }
        catch {
            return false;
        }
    }
    // Additional Telnyx-specific methods
    async speak(callId, text, voice = 'female') {
        try {
            await this.request(`/calls/${callId}/actions/speak`, 'POST', {
                payload: text,
                voice,
                language: 'en-US',
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async playAudio(callId, audioUrl) {
        try {
            await this.request(`/calls/${callId}/actions/playback_start`, 'POST', {
                audio_url: audioUrl,
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async gatherDTMF(callId, options) {
        try {
            await this.request(`/calls/${callId}/actions/gather`, 'POST', {
                minimum_digits: options.minDigits || 1,
                maximum_digits: options.maxDigits || 128,
                timeout_millis: options.timeoutMs || 60000,
                terminating_digit: options.terminatingDigit || '#',
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async bridge(callId, targetCallId) {
        try {
            await this.request(`/calls/${callId}/actions/bridge`, 'POST', {
                call_control_id: targetCallId,
            });
            return true;
        }
        catch {
            return false;
        }
    }
    mapStatus(state) {
        const statusMap = {
            'queued': 'queued',
            'ringing': 'ringing',
            'active': 'in-progress',
            'answered': 'in-progress',
            'completed': 'completed',
            'busy': 'busy',
            'timeout': 'no-answer',
            'failed': 'failed',
            'hangup': 'completed',
        };
        return statusMap[state?.toLowerCase()] || 'failed';
    }
    mapWebhookEvent(eventType) {
        const eventMap = {
            'call.initiated': 'call.initiated',
            'call.ringing': 'call.ringing',
            'call.answered': 'call.answered',
            'call.hangup': 'call.completed',
            'call.failed': 'call.failed',
            'message.sent': 'sms.delivered',
            'message.finalized': 'sms.delivered',
        };
        return eventMap[eventType?.toLowerCase()] || 'call.initiated';
    }
}
exports.TelnyxProvider = TelnyxProvider;
//# sourceMappingURL=telnyx.js.map