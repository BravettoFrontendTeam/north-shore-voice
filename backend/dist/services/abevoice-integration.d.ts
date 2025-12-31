/**
 * AbëVoice API Integration Service
 * Handles all communication with the AbëVoice text-to-speech API
 */
export declare const VOICES: {
    readonly abe: "dMyQqiVXTU80dDl2eNK8";
    readonly marcus: "s3TPKV1kjDlVtZbl4Ksh";
    readonly luna: "3jR9BuQAOPMWUjWpi0ll";
    readonly zephyr: "4O1sYUnmtThcBoSBrri7";
    readonly evelyn: "g6xIsTj2HwM6VR4iXFCw";
    readonly jasper: "WyFXw4PzMbRnp8iLMJwY";
};
export type VoiceName = keyof typeof VOICES;
export interface VoiceConfig {
    stability: number;
    similarity_boost: number;
    style: number;
}
export interface GenerateOptions {
    text: string;
    voice?: string;
    stability?: number;
    similarity?: number;
    style?: number;
}
export interface GenerateResult {
    success: boolean;
    audio_base64?: string;
    error?: string;
    duration?: number;
}
export interface Voice {
    voice_id: string;
    name: string;
    category?: string;
}
export interface UsageStats {
    characters_used: number;
    characters_limit: number;
    requests_today: number;
    requests_limit: number;
}
export declare class AbëVoiceIntegration {
    private baseUrl;
    private apiKey;
    constructor(baseUrl?: string, apiKey?: string);
    /**
     * Resolve voice name to voice ID
     */
    private resolveVoiceId;
    /**
     * Check if the AbëVoice API server is online
     */
    isOnline(): Promise<boolean>;
    /**
     * Generate speech from text
     */
    generate(options: GenerateOptions): Promise<GenerateResult>;
    /**
     * Generate speech and return as Buffer
     */
    generateBuffer(options: GenerateOptions): Promise<Buffer | null>;
    /**
     * Get list of available voices
     */
    getVoices(): Promise<Voice[]>;
    /**
     * Get usage statistics
     */
    getUsage(): Promise<UsageStats>;
    /**
     * Stream audio generation (for real-time applications)
     */
    streamGenerate(options: GenerateOptions): AsyncGenerator<Buffer, void, unknown>;
    /**
     * Accept an inbound call and initialize AI agent
     */
    acceptInboundCall(callId: string, context: {
        voiceModelId?: string;
        greeting?: string;
        knowledgeBase?: string;
    }): Promise<{
        success: boolean;
        sessionId?: string;
        error?: string;
    }>;
    /**
     * Initiate an outbound call
     */
    initiateOutboundCall(recipientNumber: string, script: {
        voiceModelId: string;
        content: string;
        maxDuration?: number;
    }): Promise<{
        success: boolean;
        callId?: string;
        error?: string;
    }>;
    /**
     * Transfer an active call
     */
    transferCall(callId: string, transferTo: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    /**
     * End an active call
     */
    endCall(callId: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    /**
     * Mute/unmute a call
     */
    muteCall(callId: string, muted: boolean): Promise<{
        success: boolean;
        error?: string;
    }>;
    /**
     * Send DTMF tones during a call
     */
    sendDTMF(callId: string, digits: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    /**
     * Get real-time transcript for a call
     */
    getCallTranscript(callId: string): Promise<{
        success: boolean;
        transcript?: Array<{
            speaker: string;
            text: string;
            timestamp: string;
        }>;
        error?: string;
    }>;
    /**
     * Get call recording URL
     */
    getCallRecording(callId: string): Promise<{
        success: boolean;
        recordingUrl?: string;
        error?: string;
    }>;
}
export declare const abevoiceIntegration: AbëVoiceIntegration;
export { AbëVoiceIntegration as AbevoiceIntegration };
export default AbëVoiceIntegration;
//# sourceMappingURL=abevoice-integration.d.ts.map