/**
 * Telnyx Telephony Provider
 * Cost: 50-70% cheaper than Twilio
 * Voice: $0.004-0.008/min
 */
import { ITelephonyProvider, CallRequest, CallResponse, CallStatus, SMSRequest, SMSResponse, PhoneNumber, WebhookEvent } from '../types';
export declare class TelnyxProvider implements ITelephonyProvider {
    name: 'telnyx';
    private apiKey;
    private baseUrl;
    private defaultFrom;
    private webhookBaseUrl;
    private connectionId?;
    constructor(config: {
        apiKey: string;
        defaultFromNumber: string;
        webhookBaseUrl: string;
        connectionId?: string;
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
    speak(callId: string, text: string, voice?: string): Promise<boolean>;
    playAudio(callId: string, audioUrl: string): Promise<boolean>;
    gatherDTMF(callId: string, options: {
        minDigits?: number;
        maxDigits?: number;
        timeoutMs?: number;
        terminatingDigit?: string;
    }): Promise<boolean>;
    bridge(callId: string, targetCallId: string): Promise<boolean>;
    private mapStatus;
    private mapWebhookEvent;
}
//# sourceMappingURL=telnyx.d.ts.map