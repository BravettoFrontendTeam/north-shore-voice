"use strict";
/**
 * AbëVoice API Integration Service
 * Handles all communication with the AbëVoice text-to-speech API
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbevoiceIntegration = exports.abevoiceIntegration = exports.AbëVoiceIntegration = exports.VOICES = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
// Pre-defined voices
exports.VOICES = {
    abe: 'dMyQqiVXTU80dDl2eNK8',
    marcus: 's3TPKV1kjDlVtZbl4Ksh',
    luna: '3jR9BuQAOPMWUjWpi0ll',
    zephyr: '4O1sYUnmtThcBoSBrri7',
    evelyn: 'g6xIsTj2HwM6VR4iXFCw',
    jasper: 'WyFXw4PzMbRnp8iLMJwY',
};
class AbëVoiceIntegration {
    constructor(baseUrl, apiKey) {
        this.baseUrl = (baseUrl || process.env.ABEVOICE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
        this.apiKey = apiKey || process.env.ABEVOICE_API_KEY;
    }
    /**
     * Resolve voice name to voice ID
     */
    resolveVoiceId(voice) {
        const lowercaseVoice = voice.toLowerCase();
        return exports.VOICES[lowercaseVoice] || voice;
    }
    /**
     * Check if the AbëVoice API server is online
     */
    async isOnline() {
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/api/status`, {
                method: 'GET',
                timeout: 5000,
            });
            const data = await response.json();
            return data.status === 'online';
        }
        catch {
            return false;
        }
    }
    /**
     * Generate speech from text
     */
    async generate(options) {
        const { text, voice = 'abe', stability = 0.5, similarity = 0.75, style = 0.0, } = options;
        const voiceId = this.resolveVoiceId(voice);
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/api/v1/text-to-speech`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
                },
                body: JSON.stringify({
                    text,
                    voice_id: voiceId,
                    stability,
                    similarity_boost: similarity,
                    style,
                }),
                timeout: 60000,
            });
            const data = await response.json();
            if (data.success && data.audio_base64) {
                return {
                    success: true,
                    audio_base64: data.audio_base64,
                    duration: data.duration,
                };
            }
            else {
                return {
                    success: false,
                    error: data.error || 'Failed to generate audio',
                };
            }
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    /**
     * Generate speech and return as Buffer
     */
    async generateBuffer(options) {
        const result = await this.generate(options);
        if (result.success && result.audio_base64) {
            return Buffer.from(result.audio_base64, 'base64');
        }
        return null;
    }
    /**
     * Get list of available voices
     */
    async getVoices() {
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/api/v1/voices`, {
                method: 'GET',
                headers: {
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
                },
                timeout: 10000,
            });
            return await response.json();
        }
        catch {
            // Return predefined voices if API unavailable
            return Object.entries(exports.VOICES).map(([name, voice_id]) => ({
                voice_id,
                name: name.charAt(0).toUpperCase() + name.slice(1),
            }));
        }
    }
    /**
     * Get usage statistics
     */
    async getUsage() {
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/api/v1/usage`, {
                method: 'GET',
                headers: {
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
                },
                timeout: 10000,
            });
            return await response.json();
        }
        catch {
            return {
                characters_used: 0,
                characters_limit: 100000,
                requests_today: 0,
                requests_limit: 1000,
            };
        }
    }
    /**
     * Stream audio generation (for real-time applications)
     */
    async *streamGenerate(options) {
        // For now, we'll generate the full audio and yield it
        // In a production environment, this would stream chunks
        const buffer = await this.generateBuffer(options);
        if (buffer) {
            // Simulate streaming by yielding chunks
            const chunkSize = 4096;
            for (let i = 0; i < buffer.length; i += chunkSize) {
                yield buffer.slice(i, Math.min(i + chunkSize, buffer.length));
            }
        }
    }
    // ============= Inbound Call Methods =============
    /**
     * Accept an inbound call and initialize AI agent
     */
    async acceptInboundCall(callId, context) {
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/api/v1/calls/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
                },
                body: JSON.stringify({
                    call_id: callId,
                    voice_model: context.voiceModelId || exports.VOICES.abe,
                    greeting: context.greeting || 'Hello, how can I help you today?',
                    knowledge_base: context.knowledgeBase,
                }),
                timeout: 30000,
            });
            const data = await response.json();
            return {
                success: data.success || false,
                sessionId: data.session_id,
                error: data.error,
            };
        }
        catch (error) {
            // Simulate success for demo/development
            console.log('AbëVoice API not available, simulating call acceptance');
            return {
                success: true,
                sessionId: `sim_${callId}_${Date.now()}`,
            };
        }
    }
    // ============= Outbound Call Methods =============
    /**
     * Initiate an outbound call
     */
    async initiateOutboundCall(recipientNumber, script) {
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/api/v1/calls/outbound`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
                },
                body: JSON.stringify({
                    to: recipientNumber,
                    voice_model: script.voiceModelId || exports.VOICES.abe,
                    script: script.content,
                    max_duration: script.maxDuration || 300,
                }),
                timeout: 30000,
            });
            const data = await response.json();
            return {
                success: data.success || false,
                callId: data.call_id,
                error: data.error,
            };
        }
        catch (error) {
            // Simulate success for demo/development
            console.log('AbëVoice API not available, simulating outbound call');
            return {
                success: true,
                callId: `sim_out_${Date.now()}`,
            };
        }
    }
    // ============= Real-time Call Control =============
    /**
     * Transfer an active call
     */
    async transferCall(callId, transferTo) {
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/api/v1/calls/${callId}/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
                },
                body: JSON.stringify({ transfer_to: transferTo }),
                timeout: 10000,
            });
            const data = await response.json();
            return { success: data.success || false, error: data.error };
        }
        catch (error) {
            console.log('AbëVoice API not available, simulating transfer');
            return { success: true };
        }
    }
    /**
     * End an active call
     */
    async endCall(callId) {
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/api/v1/calls/${callId}/end`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
                },
                timeout: 10000,
            });
            const data = await response.json();
            return { success: data.success || false, error: data.error };
        }
        catch (error) {
            console.log('AbëVoice API not available, simulating call end');
            return { success: true };
        }
    }
    /**
     * Mute/unmute a call
     */
    async muteCall(callId, muted) {
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/api/v1/calls/${callId}/mute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
                },
                body: JSON.stringify({ muted }),
                timeout: 10000,
            });
            const data = await response.json();
            return { success: data.success || false, error: data.error };
        }
        catch (error) {
            return { success: true };
        }
    }
    /**
     * Send DTMF tones during a call
     */
    async sendDTMF(callId, digits) {
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/api/v1/calls/${callId}/dtmf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
                },
                body: JSON.stringify({ digits }),
                timeout: 10000,
            });
            const data = await response.json();
            return { success: data.success || false, error: data.error };
        }
        catch (error) {
            return { success: true };
        }
    }
    /**
     * Get real-time transcript for a call
     */
    async getCallTranscript(callId) {
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/api/v1/calls/${callId}/transcript`, {
                method: 'GET',
                headers: {
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
                },
                timeout: 10000,
            });
            const data = await response.json();
            return {
                success: true,
                transcript: data.transcript || [],
            };
        }
        catch (error) {
            return {
                success: false,
                transcript: [],
                error: 'Failed to fetch transcript',
            };
        }
    }
    /**
     * Get call recording URL
     */
    async getCallRecording(callId) {
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/api/v1/calls/${callId}/recording`, {
                method: 'GET',
                headers: {
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
                },
                timeout: 10000,
            });
            const data = await response.json();
            return {
                success: true,
                recordingUrl: data.recording_url,
            };
        }
        catch (error) {
            return {
                success: false,
                error: 'Recording not available',
            };
        }
    }
}
exports.AbëVoiceIntegration = AbëVoiceIntegration;
exports.AbevoiceIntegration = AbëVoiceIntegration;
// Export singleton instance
exports.abevoiceIntegration = new AbëVoiceIntegration();
// Export for custom instances
exports.default = AbëVoiceIntegration;
//# sourceMappingURL=abevoice-integration.js.map