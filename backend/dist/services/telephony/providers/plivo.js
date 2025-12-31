"use strict";
/**
 * Plivo Telephony Provider
 * Cost: ~40-60% cheaper than Twilio
 * Voice: $0.0085/min (US)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlivoProvider = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class PlivoProvider {
    constructor(config) {
        this.name = 'plivo';
        this.authId = config.authId;
        this.authToken = config.authToken;
        this.defaultFrom = config.defaultFromNumber;
        this.webhookBaseUrl = config.webhookBaseUrl;
        this.baseUrl = `https://api.plivo.com/v1/Account/${this.authId}`;
    }
    async request(endpoint, method = 'GET', body) {
        const auth = Buffer.from(`${this.authId}:${this.authToken}`).toString('base64');
        const response = await (0, node_fetch_1.default)(`${this.baseUrl}${endpoint}`, {
            method,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
            ...(body && { body: JSON.stringify(body) }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Plivo API error: ${response.status} - ${error}`);
        }
        return response.json();
    }
    async makeCall(request) {
        try {
            const payload = {
                from: request.from || this.defaultFrom,
                to: request.to,
                answer_url: request.webhookUrl || `${this.webhookBaseUrl}/plivo/answer`,
                answer_method: 'POST',
                hangup_url: `${this.webhookBaseUrl}/plivo/hangup`,
                hangup_method: 'POST',
                ring_timeout: request.timeout || 30,
                machine_detection: request.machineDetection ? 'true' : 'false',
                record: request.recordCall ? 'true' : 'false',
                record_callback_url: request.recordCall ? `${this.webhookBaseUrl}/plivo/recording` : undefined,
            };
            const result = await this.request('/Call/', 'POST', payload);
            return {
                success: true,
                callId: result.request_uuid,
                provider: 'plivo',
                status: 'queued',
            };
        }
        catch (error) {
            return {
                success: false,
                callId: '',
                provider: 'plivo',
                status: 'failed',
                error: error.message,
            };
        }
    }
    async getCallStatus(callId) {
        const result = await this.request(`/Call/${callId}/`);
        return {
            callId: result.call_uuid,
            status: this.mapStatus(result.call_status),
            direction: result.call_direction === 'outbound' ? 'outbound' : 'inbound',
            duration: parseInt(result.bill_duration) || 0,
            from: result.from_number,
            to: result.to_number,
            startTime: result.initiation_time ? new Date(result.initiation_time) : undefined,
            endTime: result.end_time ? new Date(result.end_time) : undefined,
            cost: parseFloat(result.total_amount) || 0,
        };
    }
    async endCall(callId) {
        try {
            await this.request(`/Call/${callId}/`, 'DELETE');
            return true;
        }
        catch {
            return false;
        }
    }
    async transferCall(callId, transferTo) {
        try {
            await this.request(`/Call/${callId}/`, 'POST', {
                legs: 'aleg',
                aleg_url: `${this.webhookBaseUrl}/plivo/transfer?to=${transferTo}`,
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
                src: request.from || this.defaultFrom,
                dst: request.to,
                text: request.body,
                url: request.statusCallbackUrl || `${this.webhookBaseUrl}/plivo/sms-status`,
                method: 'POST',
            };
            const result = await this.request('/Message/', 'POST', payload);
            return {
                success: true,
                messageId: result.message_uuid[0],
                provider: 'plivo',
                status: 'queued',
            };
        }
        catch (error) {
            return {
                success: false,
                messageId: '',
                provider: 'plivo',
                status: 'failed',
                error: error.message,
            };
        }
    }
    async listNumbers() {
        const result = await this.request('/Number/');
        return result.objects.map((num) => ({
            number: num.number,
            country: num.region,
            capabilities: {
                voice: num.voice_enabled,
                sms: num.sms_enabled,
                mms: num.mms_enabled,
            },
            monthlyPrice: parseFloat(num.monthly_rental_rate) || 0,
        }));
    }
    async purchaseNumber(number) {
        const result = await this.request('/PhoneNumber/', 'POST', {
            numbers: number,
        });
        return {
            number: result.numbers[0].number,
            country: result.numbers[0].region || 'US',
            capabilities: {
                voice: true,
                sms: true,
                mms: false,
            },
            monthlyPrice: 0.8, // Plivo typical price
        };
    }
    async releaseNumber(number) {
        try {
            await this.request(`/Number/${number}/`, 'DELETE');
            return true;
        }
        catch {
            return false;
        }
    }
    parseWebhook(payload) {
        const eventType = this.mapWebhookEvent(payload.Event || payload.Status);
        return {
            provider: 'plivo',
            eventType,
            callId: payload.CallUUID || payload.RequestUUID,
            messageId: payload.MessageUUID,
            from: payload.From,
            to: payload.To,
            timestamp: new Date(),
            rawPayload: payload,
        };
    }
    async isHealthy() {
        try {
            await this.request('/');
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
    mapWebhookEvent(event) {
        const eventMap = {
            'StartApp': 'call.initiated',
            'Ringing': 'call.ringing',
            'Answer': 'call.answered',
            'Hangup': 'call.completed',
            'Failed': 'call.failed',
            'delivered': 'sms.delivered',
        };
        return eventMap[event] || 'call.initiated';
    }
}
exports.PlivoProvider = PlivoProvider;
//# sourceMappingURL=plivo.js.map