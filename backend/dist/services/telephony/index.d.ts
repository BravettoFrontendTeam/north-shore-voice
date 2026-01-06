/**
 * Multi-Provider Telephony Service
 * Supports: Plivo, SignalWire, Telnyx, Bandwidth, Twilio, Vonage
 * Features: Automatic failover, cost optimization, load balancing
 */
import { TelephonyProvider, TelephonyConfig, CallRequest, CallResponse, CallStatus, SMSRequest, SMSResponse, PhoneNumber, WebhookEvent } from './types';
export declare class TelephonyService {
    private providers;
    private configs;
    private primaryProvider;
    private failoverEnabled;
    private healthCheckInterval;
    private providerHealth;
    constructor(configs: TelephonyConfig[]);
    private initializeProviders;
    private createProvider;
    makeCall(request: CallRequest): Promise<CallResponse>;
    makeCallWithProvider(provider: TelephonyProvider, request: CallRequest): Promise<CallResponse>;
    getCallStatus(callId: string, provider?: TelephonyProvider): Promise<CallStatus | null>;
    endCall(callId: string, provider?: TelephonyProvider): Promise<boolean>;
    transferCall(callId: string, transferTo: string, provider?: TelephonyProvider): Promise<boolean>;
    sendSMS(request: SMSRequest): Promise<SMSResponse>;
    listNumbers(provider?: TelephonyProvider): Promise<PhoneNumber[]>;
    purchaseNumber(number: string, provider?: TelephonyProvider): Promise<PhoneNumber | null>;
    releaseNumber(number: string, provider?: TelephonyProvider): Promise<boolean>;
    parseWebhook(provider: TelephonyProvider, payload: Record<string, any>): WebhookEvent | null;
    getProviders(): TelephonyProvider[];
    getProviderHealth(): Map<TelephonyProvider, boolean>;
    checkProviderHealth(provider: TelephonyProvider): Promise<boolean>;
    setPrimaryProvider(provider: TelephonyProvider): void;
    setFailoverEnabled(enabled: boolean): void;
    getCheapestProvider(): TelephonyProvider | null;
    getProviderCost(provider: TelephonyProvider): number;
    estimateCallCost(durationMinutes: number): Promise<{
        provider: TelephonyProvider;
        cost: number;
    }[]>;
    private getOrderedProviders;
    private startHealthChecks;
    destroy(): void;
}
export * from './types';
export { PlivoProvider } from './providers/plivo';
export { SignalWireProvider } from './providers/signalwire';
export { TelnyxProvider } from './providers/telnyx';
export { TwilioProvider } from './providers/twilio';
export declare function createTelephonyService(options: {
    webhookBaseUrl: string;
    defaultFromNumber: string;
    plivo?: {
        authId: string;
        authToken: string;
    };
    signalwire?: {
        projectId: string;
        authToken: string;
        spaceUrl: string;
    };
    telnyx?: {
        apiKey: string;
    };
    twilio?: {
        accountSid: string;
        authToken: string;
    };
}): TelephonyService;
//# sourceMappingURL=index.d.ts.map