"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElevenLabsProvider = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const DEFAULT_BASE = 'https://api.elevenlabs.io';
class ElevenLabsProvider {
    constructor(apiKey, baseUrl) {
        this.apiKey = apiKey || process.env.ELEVENLABS_API_KEY;
        this.baseUrl = (baseUrl || process.env.ELEVENLABS_API_URL || DEFAULT_BASE).replace(/\/$/, '');
    }
    isConfigured() {
        return !!this.apiKey;
    }
    async getVoices() {
        if (!this.apiKey)
            return [];
        try {
            const res = await (0, node_fetch_1.default)(`${this.baseUrl}/v1/voices`, {
                method: 'GET',
                headers: { 'xi-api-key': this.apiKey, 'Content-Type': 'application/json' },
                timeout: 5000,
            });
            if (!res.ok)
                return [];
            const data = await res.json();
            return Array.isArray(data.voices) ? data.voices.map((v) => v.name || v.id) : [];
        }
        catch {
            return [];
        }
    }
    async generate(options) {
        if (!this.apiKey)
            return { success: false, error: 'ElevenLabs API key not configured' };
        const voice = (options.voice || 'alloy').toString();
        const body = {
            text: options.text,
            // map minimal metadata into vendor hints (best-effort)
            voice_settings: {
                // intent mapping: coarse mapping only
                pacing: options.pacing,
                emotion: options.emotion,
                intensity: options.intensity,
            },
        };
        try {
            const start = Date.now();
            const res = await (0, node_fetch_1.default)(`${this.baseUrl}/v1/text-to-speech/${voice}`, {
                method: 'POST',
                headers: {
                    'xi-api-key': this.apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
                timeout: 20000,
            });
            const latencyMs = Date.now() - start;
            if (!res.ok) {
                const txt = await res.text();
                const errMsg = `ElevenLabs error: ${res.status} ${res.statusText} - ${txt}`;
                try {
                    require('../../utils/failure-store').recordFailure('elevenlabs', 'tts_error', errMsg, { status: res.status });
                }
                catch (e) { }
                return { success: false, error: errMsg, metadata: { latencyMs } };
            }
            // ElevenLabs may return binary audio. Try to read as buffer
            const arr = await res.arrayBuffer();
            const buf = Buffer.from(arr);
            const audio_base64 = buf.toString('base64');
            try {
                require('../../utils/metrics').emitMetric('tts.request.latency', latencyMs, { provider: 'elevenlabs' });
            }
            catch (e) { }
            return {
                success: true,
                audio_base64,
                duration: undefined,
                metadata: { provider: 'elevenlabs', latencyMs },
            };
        }
        catch (e) {
            try {
                require('../../utils/failure-store').recordFailure('elevenlabs', 'request_failed', String(e.message || e));
            }
            catch (e2) { }
            return { success: false, error: `ElevenLabs request failed: ${String(e.message || e)}` };
        }
    }
}
exports.ElevenLabsProvider = ElevenLabsProvider;
exports.default = ElevenLabsProvider;
//# sourceMappingURL=elevenlabs.js.map