/**
 * Plivo Telephony Provider
 * Cost: ~40-60% cheaper than Twilio
 * Voice: $0.0085/min (US)
 */
import { ITelephonyProvider, CallRequest, CallResponse, CallStatus, SMSRequest, SMSResponse, PhoneNumber, WebhookEvent } from '../types';
export declare class PlivoProvider implements ITelephonyProvider {
    name: 'plivo';
    private authId;
    private authToken;
    private baseUrl;
    private defaultFrom;
    private webhookBaseUrl;
    constructor(config: {
        authId: string;
        authToken: string;
        defaultFromNumber: string;
        webhookBaseUrl: string;
    });
    private request;
    makeCall(request: CallRequest): Promise<CallResponse>;
    getCallStatus(callId: string): Promise<CallStatus>;
    endCall(callId: string): Promise<boolean>;
    transferCall(callId: string, transferTo: string): Promise<boolean>;
    sendSMS(request: SMSRequest): Promise<SMSResponse>;
    listNumbers(): Promise<PhoneNumber[]>;
    purchaseNumber(number: string): Promise<PhoneNumber>;
    releaseNumber(number: string): Promise<boolean>;
    parseWebhook(payload: Record<string, any>): WebhookEvent;
    isHealthy(): Promise<boolean>;
    private mapStatus;
    private mapWebhookEvent;
}
//# sourceMappingURL=plivo.d.ts.map