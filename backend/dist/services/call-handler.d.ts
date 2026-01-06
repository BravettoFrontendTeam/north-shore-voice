/**
 * Call Handler Service
 * Manages AI phone call sessions with AbëVoice integration
 */
export interface CallSession {
    id: string;
    phoneNumber: string;
    status: 'pending' | 'active' | 'completed' | 'failed';
    startTime: Date;
    endTime?: Date;
    duration?: number;
    voiceModelId: string;
    businessContext: BusinessContext;
    transcript: TranscriptMessage[];
    sentiment?: 'positive' | 'neutral' | 'negative';
    topics: string[];
}
export interface BusinessContext {
    companyName: string;
    industry: string;
    greeting: string;
    fallbackMessage: string;
    faqs: FAQ[];
}
export interface FAQ {
    question: string;
    answer: string;
}
export interface TranscriptMessage {
    speaker: 'ai' | 'caller';
    text: string;
    timestamp: Date;
    confidence?: number;
}
export interface IncomingCall {
    callId: string;
    from: string;
    to: string;
    timestamp: Date;
}
export interface CallSummary {
    sessionId: string;
    duration: number;
    transcript: TranscriptMessage[];
    sentiment: 'positive' | 'neutral' | 'negative';
    topics: string[];
    actionItems: string[];
}
export declare class CallHandler {
    private businessContext;
    constructor(businessContext?: BusinessContext);
    /**
     * Initialize a new call session
     */
    initializeCall(phoneNumber: string, voiceModelId?: string): Promise<CallSession>;
    /**
     * Handle incoming call webhook
     */
    handleIncomingCall(callData: IncomingCall): Promise<CallSession | null>;
    /**
     * Process caller speech and generate AI response
     */
    processSpeech(sessionId: string, callerText: string): Promise<{
        response: string;
        audio_base64?: string;
    } | null>;
    /**
     * Generate AI response based on input (simplified)
     */
    private generateResponse;
    /**
     * Simple question matching
     */
    private matchesQuestion;
    /**
     * End a call session
     */
    endCall(sessionId: string): Promise<CallSummary | null>;
    /**
     * Analyze sentiment from transcript
     */
    private analyzeSentiment;
    /**
     * Generate call summary
     */
    private generateSummary;
    /**
     * Extract action items from transcript
     */
    private extractActionItems;
    /**
     * Get call transcript
     */
    getCallTranscript(sessionId: string): TranscriptMessage[] | null;
    /**
     * Get session by ID
     */
    getSession(sessionId: string): CallSession | null;
    /**
     * Get all active sessions
     */
    getActiveSessions(): Array<Omit<CallSession, 'businessContext'>>;
    /**
     * Sanitize session for client
     */
    private sanitizeSession;
    /**
     * Update business context
     */
    setBusinessContext(context: BusinessContext): void;
}
export declare const callHandler: CallHandler;
export default CallHandler;
//# sourceMappingURL=call-handler.d.ts.map