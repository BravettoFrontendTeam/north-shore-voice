/**
 * SignalWire Telephony Provider
 * Cost: ~25% cheaper than Twilio, Twilio-compatible API
 * Voice: $0.0085/min
 */
import { ITelephonyProvider, CallRequest, CallResponse, CallStatus, SMSRequest, SMSResponse, PhoneNumber, WebhookEvent } from '../types';
export declare class SignalWireProvider implements ITelephonyProvider {
    name: 'signalwire';
    private projectId;
    private authToken;
    private spaceUrl;
    private baseUrl;
    private defaultFrom;
    private webhookBaseUrl;
    constructor(config: {
        projectId: string;
        authToken: string;
        spaceUrl: string;
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
//# sourceMappingURL=signalwire.d.ts.map