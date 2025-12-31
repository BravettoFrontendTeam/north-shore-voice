"use strict";
/**
 * Call Handler Service
 * Manages AI phone call sessions with AbëVoice integration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.callHandler = exports.CallHandler = void 0;
const uuid_1 = require("uuid");
const abevoice_integration_1 = require("./abevoice-integration");
const websocket_1 = require("./websocket");
// In-memory session store (use Redis in production)
const activeSessions = new Map();
// Default business context
const defaultBusinessContext = {
    companyName: 'North Shore Voice',
    industry: 'Technology',
    greeting: 'Thank you for calling North Shore Voice. How may I assist you today?',
    fallbackMessage: "I apologize, but I didn't quite catch that. Could you please repeat your question?",
    faqs: [
        {
            question: 'What are your business hours?',
            answer: 'We are open Monday through Friday, 9 AM to 5 PM Pacific Time.',
        },
        {
            question: 'How can I schedule an appointment?',
            answer: 'I can help you schedule an appointment. What day and time works best for you?',
        },
    ],
};
class CallHandler {
    constructor(businessContext) {
        this.businessContext = businessContext || defaultBusinessContext;
    }
    /**
     * Initialize a new call session
     */
    async initializeCall(phoneNumber, voiceModelId) {
        const sessionId = (0, uuid_1.v4)();
        const session = {
            id: sessionId,
            phoneNumber,
            status: 'pending',
            startTime: new Date(),
            voiceModelId: voiceModelId || abevoice_integration_1.VOICES.abe,
            businessContext: this.businessContext,
            transcript: [],
            topics: [],
        };
        activeSessions.set(sessionId, session);
        // Generate greeting audio
        const greetingResult = await abevoice_integration_1.abevoiceIntegration.generate({
            text: this.businessContext.greeting,
            voice: voiceModelId || 'abe',
        });
        if (greetingResult.success) {
            session.status = 'active';
            session.transcript.push({
                speaker: 'ai',
                text: this.businessContext.greeting,
                timestamp: new Date(),
            });
            // Broadcast session update
            (0, websocket_1.broadcastToSession)(sessionId, {
                type: 'call_started',
                session: this.sanitizeSession(session),
                audio: greetingResult.audio_base64,
            });
        }
        else {
            session.status = 'failed';
        }
        return session;
    }
    /**
     * Handle incoming call webhook
     */
    async handleIncomingCall(callData) {
        console.log(`Incoming call from ${callData.from} to ${callData.to}`);
        return this.initializeCall(callData.from);
    }
    /**
     * Process caller speech and generate AI response
     */
    async processSpeech(sessionId, callerText) {
        const session = activeSessions.get(sessionId);
        if (!session || session.status !== 'active') {
            return null;
        }
        // Add caller message to transcript
        session.transcript.push({
            speaker: 'caller',
            text: callerText,
            timestamp: new Date(),
        });
        // Generate AI response (simplified - in production, use NLP/LLM)
        const response = this.generateResponse(callerText, session);
        // Generate audio
        const audioResult = await abevoice_integration_1.abevoiceIntegration.generate({
            text: response,
            voice: session.voiceModelId,
        });
        // Add AI response to transcript
        session.transcript.push({
            speaker: 'ai',
            text: response,
            timestamp: new Date(),
        });
        // Broadcast update
        (0, websocket_1.broadcastToSession)(sessionId, {
            type: 'transcript_update',
            messages: session.transcript.slice(-2),
            audio: audioResult.audio_base64,
        });
        return {
            response,
            audio_base64: audioResult.audio_base64,
        };
    }
    /**
     * Generate AI response based on input (simplified)
     */
    generateResponse(input, session) {
        const lowerInput = input.toLowerCase();
        // Check FAQs
        for (const faq of session.businessContext.faqs) {
            if (this.matchesQuestion(lowerInput, faq.question.toLowerCase())) {
                return faq.answer;
            }
        }
        // Simple intent detection
        if (lowerInput.includes('appointment') || lowerInput.includes('schedule')) {
            session.topics.push('Appointment Scheduling');
            return "I'd be happy to help you schedule an appointment. What day and time would work best for you?";
        }
        if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('pricing')) {
            session.topics.push('Pricing');
            return "Our pricing starts at $99 per month for our Starter plan, $299 for Professional, and we offer custom Enterprise pricing. Would you like more details on any specific plan?";
        }
        if (lowerInput.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with today?";
        }
        if (lowerInput.includes('bye') || lowerInput.includes('goodbye')) {
            return "Thank you for calling North Shore Voice. Have a wonderful day! Goodbye.";
        }
        if (lowerInput.includes('help') || lowerInput.includes('support')) {
            session.topics.push('Support');
            return "I'm here to help! Could you please describe the issue you're experiencing, and I'll do my best to assist you?";
        }
        // Default response
        return "I understand. Could you please provide more details so I can better assist you?";
    }
    /**
     * Simple question matching
     */
    matchesQuestion(input, question) {
        const inputWords = input.split(' ').filter(w => w.length > 3);
        const questionWords = question.split(' ').filter(w => w.length > 3);
        const matchCount = inputWords.filter(w => questionWords.includes(w)).length;
        return matchCount >= 2;
    }
    /**
     * End a call session
     */
    async endCall(sessionId) {
        const session = activeSessions.get(sessionId);
        if (!session) {
            return null;
        }
        session.status = 'completed';
        session.endTime = new Date();
        session.duration = Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000);
        // Analyze sentiment (simplified)
        session.sentiment = this.analyzeSentiment(session.transcript);
        // Generate closing message
        const closingResult = await abevoice_integration_1.abevoiceIntegration.generate({
            text: "Thank you for calling. Goodbye!",
            voice: session.voiceModelId,
        });
        // Broadcast call ended
        (0, websocket_1.broadcastToSession)(sessionId, {
            type: 'call_ended',
            summary: this.generateSummary(session),
            audio: closingResult.audio_base64,
        });
        const summary = this.generateSummary(session);
        // Keep session for a while before cleanup
        setTimeout(() => {
            activeSessions.delete(sessionId);
        }, 3600000); // 1 hour
        return summary;
    }
    /**
     * Analyze sentiment from transcript
     */
    analyzeSentiment(transcript) {
        const callerMessages = transcript
            .filter(m => m.speaker === 'caller')
            .map(m => m.text.toLowerCase())
            .join(' ');
        const positiveWords = ['thank', 'great', 'excellent', 'perfect', 'wonderful', 'appreciate', 'helpful'];
        const negativeWords = ['frustrated', 'angry', 'terrible', 'awful', 'bad', 'problem', 'issue', 'complaint'];
        const positiveCount = positiveWords.filter(w => callerMessages.includes(w)).length;
        const negativeCount = negativeWords.filter(w => callerMessages.includes(w)).length;
        if (positiveCount > negativeCount)
            return 'positive';
        if (negativeCount > positiveCount)
            return 'negative';
        return 'neutral';
    }
    /**
     * Generate call summary
     */
    generateSummary(session) {
        return {
            sessionId: session.id,
            duration: session.duration || 0,
            transcript: session.transcript,
            sentiment: session.sentiment || 'neutral',
            topics: [...new Set(session.topics)],
            actionItems: this.extractActionItems(session.transcript),
        };
    }
    /**
     * Extract action items from transcript
     */
    extractActionItems(transcript) {
        const actionItems = [];
        for (const message of transcript) {
            const text = message.text.toLowerCase();
            if (text.includes('schedule') || text.includes('appointment')) {
                actionItems.push('Follow up on appointment scheduling');
            }
            if (text.includes('callback') || text.includes('call back')) {
                actionItems.push('Schedule callback');
            }
            if (text.includes('email') || text.includes('send')) {
                actionItems.push('Send follow-up email');
            }
        }
        return [...new Set(actionItems)];
    }
    /**
     * Get call transcript
     */
    getCallTranscript(sessionId) {
        const session = activeSessions.get(sessionId);
        return session ? session.transcript : null;
    }
    /**
     * Get session by ID
     */
    getSession(sessionId) {
        return activeSessions.get(sessionId) || null;
    }
    /**
     * Get all active sessions
     */
    getActiveSessions() {
        return Array.from(activeSessions.values())
            .filter(s => s.status === 'active')
            .map(this.sanitizeSession);
    }
    /**
     * Sanitize session for client
     */
    sanitizeSession(session) {
        const { businessContext, ...sanitized } = session;
        return sanitized;
    }
    /**
     * Update business context
     */
    setBusinessContext(context) {
        this.businessContext = context;
    }
}
exports.CallHandler = CallHandler;
// Export singleton instance
exports.callHandler = new CallHandler();
exports.default = CallHandler;
//# sourceMappingURL=call-handler.js.map