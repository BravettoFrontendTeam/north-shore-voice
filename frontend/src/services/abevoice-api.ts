/**
 * AbëVoice API Service
 * Frontend client for integrating with the AbëVoice backend
 */

export interface VoiceConfig {
  stability: number;
  similarity: number;
  style: number;
}

export interface Voice {
  voice_id: string;
  name: string;
  preview_url?: string;
  category?: string;
}

export interface GenerateRequest {
  text: string;
  voice?: string;
  stability?: number;
  similarity?: number;
  style?: number;
}

export interface GenerateResponse {
  success: boolean;
  audio_base64?: string;
  audio_url?: string;
  error?: string;
  duration?: number;
}

export interface UsageStats {
  characters_used: number;
  characters_limit: number;
  requests_today: number;
  requests_limit: number;
}

export interface CallSession {
  id: string;
  phone_number: string;
  status: 'active' | 'completed' | 'failed';
  start_time: string;
  end_time?: string;
  duration?: number;
  voice_model_id: string;
}

export interface CallTranscript {
  session_id: string;
  messages: TranscriptMessage[];
}

export interface TranscriptMessage {
  speaker: 'ai' | 'caller';
  text: string;
  timestamp: string;
  confidence: number;
}

// Pre-defined voices from the AbëVoice API
export const VOICES = {
  abe: { id: 'dMyQqiVXTU80dDl2eNK8', name: 'Abë', category: 'professional' },
  marcus: { id: 's3TPKV1kjDlVtZbl4Ksh', name: 'Marcus', category: 'professional' },
  luna: { id: '3jR9BuQAOPMWUjWpi0ll', name: 'Luna', category: 'friendly' },
  zephyr: { id: '4O1sYUnmtThcBoSBrri7', name: 'Zephyr', category: 'energetic' },
  evelyn: { id: 'g6xIsTj2HwM6VR4iXFCw', name: 'Evelyn', category: 'professional' },
  jasper: { id: 'WyFXw4PzMbRnp8iLMJwY', name: 'Jasper', category: 'casual' },
} as const;

export type VoiceName = keyof typeof VOICES;

class AbëVoiceAPIService {
  private baseUrl: string;
  private apiKey: string | null = null;

  constructor(baseUrl: string = '/api/voice') {
    this.baseUrl = baseUrl;
  }

  /**
   * Set the API key for authenticated requests
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get headers for API requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    // Prefer explicit apiKey, otherwise try session storage token
    const token =
      this.apiKey || (typeof window !== 'undefined' ? sessionStorage.getItem('token') : null);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Check if the voice API server is online
   */
  async isOnline(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      const data = await response.json();
      return data.status === 'online';
    } catch {
      return false;
    }
  }

  /**
   * Generate speech from text
   */
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    try {
      const voiceId = request.voice
        ? VOICES[request.voice as VoiceName]?.id || request.voice
        : VOICES.abe.id;

      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          text: request.text,
          voice_id: voiceId,
          stability: request.stability ?? 0.5,
          similarity_boost: request.similarity ?? 0.75,
          style: request.style ?? 0.0,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate and get audio as a Blob URL for playback
   */
  async generateAudioUrl(request: GenerateRequest): Promise<string | null> {
    const response = await this.generate(request);

    if (response.success && response.audio_base64) {
      // Convert base64 to blob URL
      const binaryString = atob(response.audio_base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'audio/mpeg' });
      return URL.createObjectURL(blob);
    }

    return response.audio_url || null;
  }

  /**
   * Get list of available voices
   */
  async getVoices(): Promise<Voice[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      return await response.json();
    } catch {
      // Return predefined voices if API unavailable
      return Object.values(VOICES).map((value) => ({
        voice_id: value.id,
        name: value.name,
        category: value.category,
      }));
    }
  }

  /**
   * Get usage statistics
   */
  async getUsage(): Promise<UsageStats> {
    try {
      const response = await fetch(`${this.baseUrl}/usage`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      return await response.json();
    } catch {
      return {
        characters_used: 0,
        characters_limit: 100000,
        requests_today: 0,
        requests_limit: 1000,
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Call Management
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Initialize a new call session
   */
  async initializeCall(phoneNumber: string, voiceModelId?: string): Promise<CallSession | null> {
    try {
      const response = await fetch(`${this.baseUrl}/calls/initialize`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          phone_number: phoneNumber,
          voice_model_id: voiceModelId || VOICES.abe.id,
        }),
      });
      return await response.json();
    } catch {
      return null;
    }
  }

  /**
   * End an active call session
   */
  async endCall(sessionId: string): Promise<{ success: boolean; summary?: CallTranscript }> {
    try {
      const response = await fetch(`${this.baseUrl}/calls/${sessionId}/end`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      return await response.json();
    } catch {
      return { success: false };
    }
  }

  /**
   * Get call transcript
   */
  async getCallTranscript(sessionId: string): Promise<CallTranscript | null> {
    try {
      const response = await fetch(`${this.baseUrl}/calls/${sessionId}/transcript`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      return await response.json();
    } catch {
      return null;
    }
  }

  /**
   * Get all call sessions
   */
  async getCallSessions(params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<CallSession[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.offset) queryParams.set('offset', params.offset.toString());
      if (params?.status) queryParams.set('status', params.status);

      const response = await fetch(`${this.baseUrl}/calls?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      return await response.json();
    } catch {
      return [];
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Voice Model Training
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Upload training audio sample
   */
  async uploadTrainingSample(
    file: File,
    metadata?: {
      name?: string;
      description?: string;
    },
  ): Promise<{ success: boolean; sample_id?: string; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (metadata?.name) formData.append('name', metadata.name);
      if (metadata?.description) formData.append('description', metadata.description);

      const response = await fetch(`${this.baseUrl}/training/upload`, {
        method: 'POST',
        headers: {
          ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
        },
        credentials: 'include',
        body: formData,
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Start training a new voice model
   */
  async startTraining(config: {
    name: string;
    sample_ids: string[];
    personality?: {
      friendliness: number;
      professionalism: number;
      energy: number;
      formality: number;
    };
  }): Promise<{ success: boolean; model_id?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/training/start`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(config),
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Training failed to start',
      };
    }
  }

  /**
   * Get training status
   */
  async getTrainingStatus(modelId: string): Promise<{
    status: 'pending' | 'training' | 'ready' | 'failed';
    progress?: number;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/training/${modelId}/status`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      return await response.json();
    } catch {
      return { status: 'failed', error: 'Failed to get status' };
    }
  }

  /**
   * Delete a training sample
   */
  async deleteTrainingSample(sampleId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/training/samples/${sampleId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      return await response.json();
    } catch {
      return { success: false };
    }
  }
}

// Export singleton instance
export const abevoiceApi = new AbëVoiceAPIService();

// Export class for custom instances
export { AbëVoiceAPIService };

// ═══════════════════════════════════════════════════════════════════════════
// React Hooks
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for generating and playing voice audio
 */
export function useVoiceGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generate = useCallback(async (request: GenerateRequest) => {
    setIsGenerating(true);
    setError(null);

    try {
      const url = await abevoiceApi.generateAudioUrl(request);
      if (url) {
        setAudioUrl(url);
        return url;
      } else {
        setError('Failed to generate audio');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const play = useCallback(
    async (request: GenerateRequest) => {
      const url = await generate(request);
      if (url) {
        setIsPlaying(true);
        const audio = new Audio(url);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          setIsPlaying(false);
          setError('Playback failed');
        };
        await audio.play();
      }
    },
    [generate],
  );

  const stop = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return {
    generate,
    play,
    stop,
    isGenerating,
    isPlaying,
    error,
    audioUrl,
  };
}

/**
 * Hook for fetching available voices
 */
export function useVoices() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const data = await abevoiceApi.getVoices();
        setVoices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch voices');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoices();
  }, []);

  return { voices, isLoading, error };
}

/**
 * Hook for API status
 */
export function useApiStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const online = await abevoiceApi.isOnline();
      setIsOnline(online);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { isOnline };
}
