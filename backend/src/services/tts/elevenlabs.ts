import fetch from 'node-fetch'
import { GenerateOptions, GenerateResult } from '../abevoice-integration'

const DEFAULT_BASE = 'https://api.elevenlabs.io'

export class ElevenLabsProvider {
  private apiKey?: string
  private baseUrl: string

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || process.env.ELEVENLABS_API_KEY
    this.baseUrl = (baseUrl || process.env.ELEVENLABS_API_URL || DEFAULT_BASE).replace(/\/$/, '')
  }

  isConfigured(): boolean {
    return !!this.apiKey
  }

  async getVoices(): Promise<string[]> {
    if (!this.apiKey) return []
    try {
      const res = await fetch(`${this.baseUrl}/v1/voices`, {
        method: 'GET',
        headers: { 'xi-api-key': this.apiKey, 'Content-Type': 'application/json' },
        timeout: 5000 as any,
      } as any)
      if (!res.ok) return []
      const data = await res.json() as any
      return Array.isArray(data.voices) ? data.voices.map((v: any) => v.name || v.id) : []
    } catch {
      return []
    }
  }

  async generate(options: GenerateOptions): Promise<GenerateResult> {
    if (!this.apiKey) return { success: false, error: 'ElevenLabs API key not configured' }

    const voice = (options.voice || 'alloy').toString()
    const body: any = {
      text: options.text,
      // map minimal metadata into vendor hints (best-effort)
      voice_settings: {
        // intent mapping: coarse mapping only
        pacing: options.pacing,
        emotion: options.emotion,
        intensity: options.intensity,
      },
    }

    try {
      const start = Date.now()
      const res = await fetch(`${this.baseUrl}/v1/text-to-speech/${voice}`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        timeout: 20000 as any,
      } as any)

      const latencyMs = Date.now() - start

      if (!res.ok) {
        const txt = await res.text()
        const errMsg = `ElevenLabs error: ${res.status} ${res.statusText} - ${txt}`
        try { require('../../utils/failure-store').recordFailure('elevenlabs', 'tts_error', errMsg, { status: res.status }) } catch (e) {}
        return { success: false, error: errMsg, metadata: { latencyMs } }
      }

      // ElevenLabs may return binary audio. Try to read as buffer
      const arr = await res.arrayBuffer()
      const buf = Buffer.from(arr)
      const audio_base64 = buf.toString('base64')

      try { require('../../utils/metrics').emitMetric('tts.request.latency', latencyMs, { provider: 'elevenlabs' }) } catch (e) {}

      return {
        success: true,
        audio_base64,
        duration: undefined,
        metadata: { provider: 'elevenlabs', latencyMs },
      }
    } catch (e: any) {
      try { require('../../utils/failure-store').recordFailure('elevenlabs', 'request_failed', String(e.message || e)) } catch (e2) {}
      return { success: false, error: `ElevenLabs request failed: ${String(e.message || e)}` }
    }
  }
}

export default ElevenLabsProvider
