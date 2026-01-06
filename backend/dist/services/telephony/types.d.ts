/**
 * Telephony Provider Types
 * Common interfaces for all telephony providers
 */
export type TelephonyProvider = 'plivo' | 'signalwire' | 'telnyx' | 'bandwidth' | 'twilio' | 'vonage';
export interface TelephonyConfig {
    provider: TelephonyProvider;
    credentials: ProviderCredentials;
    webhookBaseUrl: string;
    defaultFromNumber: string;
    enabled: boolean;
    priority: number;
}
export interface ProviderCredentials {
    authId?: string;
    authToken?: string;
    projectId?: string;
    spaceUrl?: string;
    apiKey?: string;
    accountId?: string;
    username?: string;
    password?: string;
    applicationId?: string;
    accountSid?: string;
    apiSecret?: string;
}
export interface CallRequest {
    to: string;
    from?: string;
    webhookUrl?: string;
    statusCallbackUrl?: string;
    timeout?: number;
    machineDetection?: boolean;
    recordCall?: boolean;
    metadata?: Record<string, string>;
}
export interface CallResponse {
    success: boolean;
    callId: string;
    provider: TelephonyProvider;
    status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed';
    error?: string;
    cost?: number;
}
export interface CallStatus {
    callId: string;
    status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'busy' | 'no-answer' | 'failed' | 'canceled';
    direction: 'inbound' | 'outbound';
    duration?: number;
    from: string;
    to: string;
    startTime?: Date;
    endTime?: Date;
    recordingUrl?: string;
    cost?: number;
}
export interface SMSRequest {
    to: string;
    from?: string;
    body: string;
    mediaUrls?: string[];
    statusCallbackUrl?: string;
}
export interface SMSResponse {
    success: boolean;
    messageId: string;
    provider: TelephonyProvider;
    status: 'queued' | 'sent' | 'delivered' | 'failed';
    error?: string;
    cost?: number;
}
export interface PhoneNumber {
    number: string;
    country: string;
    capabilities: {
        voice: boolean;
        sms: boolean;
        mms: boolean;
    };
    monthlyPrice: number;
}
export interface WebhookEvent {
    provider: TelephonyProvider;
    eventType: 'call.initiated' | 'call.ringing' | 'call.answered' | 'call.completed' | 'call.failed' | 'sms.received' | 'sms.delivered';
    callId?: string;
    messageId?: string;
    from: string;
    to: string;
    timestamp: Date;
    rawPayload: Record<string, any>;
}
export interface ITelephonyProvider {
    name: TelephonyProvider;
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
}
//# sourceMappingURL=types.d.ts.map