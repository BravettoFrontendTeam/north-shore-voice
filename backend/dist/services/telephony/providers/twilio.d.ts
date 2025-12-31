/**
 * Twilio Telephony Provider
 * Premium option with excellent documentation
 * Voice: $0.013/min
 */
import { ITelephonyProvider, CallRequest, CallResponse, CallStatus, SMSRequest, SMSResponse, PhoneNumber, WebhookEvent } from '../types';
export declare class TwilioProvider implements ITelephonyProvider {
    name: 'twilio';
    private accountSid;
    private authToken;
    private baseUrl;
    private defaultFrom;
    private webhookBaseUrl;
    constructor(config: {
        accountSid: string;
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
    getRecordings(callId: string): Promise<string[]>;
    getTranscriptions(callId: string): Promise<string[]>;
    private mapStatus;
    private mapWebhookEvent;
}
//# sourceMappingURL=twilio.d.ts.map