/**
 * AbëVoice API Integration Service
 * Handles all communication with the AbëVoice text-to-speech API
 */

import fetch from 'node-fetch';

// Pre-defined voices
export const VOICES = {
  abe: 'dMyQqiVXTU80dDl2eNK8',
  marcus: 's3TPKV1kjDlVtZbl4Ksh',
  luna: '3jR9BuQAOPMWUjWpi0ll',
  zephyr: '4O1sYUnmtThcBoSBrri7',
  evelyn: 'g6xIsTj2HwM6VR4iXFCw',
  jasper: 'WyFXw4PzMbRnp8iLMJwY',
} as const;

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
  // Optional emotion metadata to guide TTS prosody
  emotion?: string;
  intensity?: number; // 1-10
  pacing?: 'slow' | 'normal' | 'fast';
  voice_style?: 'plain' | 'reflective' | 'assertive';
  directive?: string; // free-form prosody directive
  // Optional provider override: 'abevoice' | 'elevenlabs' | other
  provider?: string;
}

export interface GenerateResult {
  success: boolean;
  audio_base64?: string;
  error?: string;
  duration?: number;
  metadata?: Record<string, any>;
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

import ElevenLabsProvider from './tts/elevenlabs'
import TTSCache from './tts/cache'

export class AbëVoiceIntegration {
  private baseUrl: string;
  private apiKey: string | undefined;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = (baseUrl || process.env.ABEVOICE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
    this.apiKey = apiKey || process.env.ABEVOICE_API_KEY;
  }

  /**
   * Resolve voice name to voice ID
   */
  private resolveVoiceId(voice: string): string {
    const lowercaseVoice = voice.toLowerCase();
    return VOICES[lowercaseVoice as VoiceName] || voice;
  }

  /**
   * Check if the AbëVoice API server is online
   */
  async isOnline(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/status`, {
        method: 'GET',
        timeout: 5000,
      } as any);
      const data = await response.json() as { status?: string };
      return data.status === 'online';
    } catch {
      return false;
    }
  }

  /**
   * Generate speech from text
   */
  async generate(options: GenerateOptions): Promise<GenerateResult> {
    const {
      text,
      voice = 'abe',
      stability = 0.5,
      similarity = 0.75,
      style = 0.0,
    } = options;

    const voiceId = this.resolveVoiceId(voice);

    // Build cache key (includes provider if set)
    const cacheKey = TTSCache.buildCacheKey({ text, voice: voiceId, provider: (options as any).provider || 'abevoice', emotion: (options as any).emotion, intensity: (options as any).intensity, pacing: (options as any).pacing })

    // Try cache first
    const cached = TTSCache.getCachedAudio(cacheKey)
    if (cached) {
      return {
        success: true,
        audio_base64: cached.audio_base64,
        duration: undefined,
        metadata: { ...(cached.metadata || {}), provider: (options as any).provider || 'cache' },
      }
    }

    // Provider override: delegate to ElevenLabs if requested
    if ((options as any).provider === 'elevenlabs' || (options as any).provider === 'eleven') {
      const el = new ElevenLabsProvider(process.env.ELEVENLABS_API_KEY)
      const res = await el.generate(options)
      if (res.success && res.audio_base64) {
        try { TTSCache.setCachedAudio(cacheKey, res.audio_base64, res.metadata || {}) } catch (e) {}
      }
      return res
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/text-to-speech`, {
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
          // Optional metadata to guide prosody and emotion
          metadata: {
            ...(options as any).emotion ? { emotion: (options as any).emotion } : {},
            ...(options as any).intensity ? { intensity: (options as any).intensity } : {},
            ...(options as any).pacing ? { pacing: (options as any).pacing } : {},
            ...(options as any).voice_style ? { voice_style: (options as any).voice_style } : {},
            ...(options as any).directive ? { directive: (options as any).directive } : {},
          },
        }),
        timeout: 60000,
      } as any);

      const data = await response.json() as {
        success?: boolean;
        audio_base64?: string;
        error?: string;
        duration?: number;
        metadata?: Record<string, any>;
      };

      // P0 Fix 1: Remove simulation mode - fail loud in production
      if (response.status !== 200) {
        if (process.env.NODE_ENV === 'production') {
          throw new Error(`AbëVoice API failed: ${response.status} ${response.statusText}`);
        }
        // Dev mode: return error gracefully
        return {
          success: false,
          error: `AbëVoice API failed: ${response.status}`,
        };
      }

      if (data.success && data.audio_base64) {
        try { TTSCache.setCachedAudio(cacheKey, data.audio_base64, data.metadata || {}) } catch (e) {}
        try { require('../utils/metrics').emitMetric('tts.request.latency', Date.now() - startTs, { provider: 'abevoice' }) } catch (e) {}
        return {
          success: true,
          audio_base64: data.audio_base64,
          duration: data.duration,
          metadata: data.metadata,
        };
      } else {
        // P0 Fix 1: In production, throw on API errors
        if (process.env.NODE_ENV === 'production') {
          throw new Error(`AbëVoice API error: ${data.error || 'Failed to generate audio'}`);
        }
        return {
          success: false,
          error: data.error || 'Failed to generate audio',
        };
      }
    } catch (error) {
      try { require('../utils/failure-store').recordFailure('abevoice', 'request_failed', error instanceof Error ? error.message : String(error)) } catch (e) {}
      // P0 Fix 1: In production, propagate errors instead of masking them
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`AbëVoice API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate speech and return as Buffer
   */
  async generateBuffer(options: GenerateOptions): Promise<Buffer | null> {
    const result = await this.generate(options);
    if (result.success && result.audio_base64) {
      return Buffer.from(result.audio_base64, 'base64');
    }
    return null;
  }

  /**
   * Get list of available voices
   */
  async getVoices(): Promise<Voice[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/voices`, {
        method: 'GET',
        headers: {
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        timeout: 10000,
      } as any);
      return await response.json() as Voice[];
    } catch {
      // Return predefined voices if API unavailable
      return Object.entries(VOICES).map(([name, voice_id]) => ({
        voice_id,
        name: name.charAt(0).toUpperCase() + name.slice(1),
      }));
    }
  }

  /**
   * Get usage statistics
   */
  async getUsage(): Promise<UsageStats> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/usage`, {
        method: 'GET',
        headers: {
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        timeout: 10000,
      } as any);
      return await response.json() as UsageStats;
    } catch {
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
  async *streamGenerate(options: GenerateOptions): AsyncGenerator<Buffer, void, unknown> {
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
  async acceptInboundCall(
    callId: string,
    context: {
      voiceModelId?: string;
      greeting?: string;
      knowledgeBase?: string;
    }
  ): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/calls/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify({
          call_id: callId,
          voice_model: context.voiceModelId || VOICES.abe,
          greeting: context.greeting || 'Hello, how can I help you today?',
          knowledge_base: context.knowledgeBase,
        }),
        timeout: 30000,
      } as any);

      const data = await response.json() as {
        success?: boolean;
        session_id?: string;
        error?: string;
      };

      return {
        success: data.success || false,
        sessionId: data.session_id,
        error: data.error,
      };
    } catch (error) {
      // P0 Fix 1: Fail loud in production
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`AbëVoice API call acceptance failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      // Dev mode: simulate for development
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
  async initiateOutboundCall(
    recipientNumber: string,
    script: {
      voiceModelId: string;
      content: string;
      maxDuration?: number;
    }
  ): Promise<{ success: boolean; callId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/calls/outbound`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify({
          to: recipientNumber,
          voice_model: script.voiceModelId || VOICES.abe,
          script: script.content,
          max_duration: script.maxDuration || 300,
        }),
        timeout: 30000,
      } as any);

      const data = await response.json() as {
        success?: boolean;
        call_id?: string;
        error?: string;
      };

      return {
        success: data.success || false,
        callId: data.call_id,
        error: data.error,
      };
    } catch (error) {
      // P0 Fix 1: Fail loud in production
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`AbëVoice API outbound call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      // Dev mode: simulate for development
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
  async transferCall(
    callId: string,
    transferTo: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/calls/${callId}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify({ transfer_to: transferTo }),
        timeout: 10000,
      } as any);

      const data = await response.json() as { success?: boolean; error?: string };
      return { success: data.success || false, error: data.error };
    } catch (error) {
      console.log('AbëVoice API not available, simulating transfer');
      return { success: true };
    }
  }

  /**
   * End an active call
   */
  async endCall(callId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/calls/${callId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        timeout: 10000,
      } as any);

      const data = await response.json() as { success?: boolean; error?: string };
      return { success: data.success || false, error: data.error };
    } catch (error) {
      console.log('AbëVoice API not available, simulating call end');
      return { success: true };
    }
  }

  /**
   * Mute/unmute a call
   */
  async muteCall(
    callId: string,
    muted: boolean
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/calls/${callId}/mute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify({ muted }),
        timeout: 10000,
      } as any);

      const data = await response.json() as { success?: boolean; error?: string };
      return { success: data.success || false, error: data.error };
    } catch (error) {
      return { success: true };
    }
  }

  /**
   * Send DTMF tones during a call
   */
  async sendDTMF(
    callId: string,
    digits: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/calls/${callId}/dtmf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify({ digits }),
        timeout: 10000,
      } as any);

      const data = await response.json() as { success?: boolean; error?: string };
      return { success: data.success || false, error: data.error };
    } catch (error) {
      return { success: true };
    }
  }

  /**
   * Get real-time transcript for a call
   */
  async getCallTranscript(callId: string): Promise<{
    success: boolean;
    transcript?: Array<{ speaker: string; text: string; timestamp: string }>;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/calls/${callId}/transcript`, {
        method: 'GET',
        headers: {
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        timeout: 10000,
      } as any);

      const data = await response.json() as any;
      return {
        success: true,
        transcript: data.transcript || [],
      };
    } catch (error) {
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
  async getCallRecording(callId: string): Promise<{
    success: boolean;
    recordingUrl?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/calls/${callId}/recording`, {
        method: 'GET',
        headers: {
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        timeout: 10000,
      } as any);

      const data = await response.json() as any;
      return {
        success: true,
        recordingUrl: data.recording_url,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Recording not available',
      };
    }
  }
}

// Export singleton instance
export const abevoiceIntegration = new AbëVoiceIntegration();

// Alias for easier imports
export { AbëVoiceIntegration as AbevoiceIntegration };

// Export for custom instances
export default AbëVoiceIntegration;

