import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const CACHE_DIR = path.resolve(__dirname, '..', '..', 'data', 'tts-cache')
const DEFAULT_TTL_MS = Number(process.env.TTS_CACHE_TTL_MS || String(1000 * 60 * 60 * 24 * 30)) // 30 days

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}
ensureDir(CACHE_DIR)

export function buildCacheKey(options: { text: string; voice?: string; provider?: string; emotion?: string; intensity?: number; pacing?: string }) {
  const parts = [
    options.text || '',
    options.voice || '',
    options.provider || '',
    options.emotion || '',
    String(options.intensity || ''),
    options.pacing || '',
  ]
  const raw = parts.join('|')
  return crypto.createHash('sha256').update(raw).digest('hex')
}

export function getCachedAudio(key: string) {
  const file = path.join(CACHE_DIR, `${key}.json`)
  if (!fs.existsSync(file)) return null
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
    const created = new Date(data.createdAt).getTime() || 0
    if (Date.now() - created > (data.ttlMs || DEFAULT_TTL_MS)) {
      // expired
      try { fs.unlinkSync(file) } catch (e) {}
      return null
    }
    return { audio_base64: data.audio_base64 as string, metadata: data.metadata as Record<string, any>, createdAt: data.createdAt }
  } catch (e) {
    return null
  }
}

export function setCachedAudio(key: string, audio_base64: string, metadata: Record<string, any> = {}, ttlMs?: number) {
  const file = path.join(CACHE_DIR, `${key}.json`)
  const payload = {
    audio_base64,
    metadata: { ...metadata },
    createdAt: new Date().toISOString(),
    ttlMs: ttlMs || DEFAULT_TTL_MS,
  }
  fs.writeFileSync(file, JSON.stringify(payload, null, 2), 'utf-8')
}

export default { buildCacheKey, getCachedAudio, setCachedAudio }
