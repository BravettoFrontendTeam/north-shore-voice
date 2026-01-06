import TTSCache from '../src/services/tts/cache'
import fs from 'fs'
import path from 'path'

describe('TTS Cache', () => {
  const key = TTSCache.buildCacheKey({ text: 'hello', voice: 'abe', provider: 'abevoice' })
  const cacheDir = path.resolve(__dirname, '..', 'data', 'tts-cache')

  beforeAll(() => {
    // cleanup
    try { fs.unlinkSync(path.join(cacheDir, `${key}.json`)) } catch (e) {}
  })

  it('sets and gets cached audio', () => {
    TTSCache.setCachedAudio(key, 'ZmFrZQ==', { provider: 'test' }, 1000 * 60)
    const c = TTSCache.getCachedAudio(key)
    expect(c).not.toBeNull()
    expect(c!.audio_base64).toBe('ZmFrZQ==')
  })

  it('expires entries after ttl', () => {
    const expireKey = TTSCache.buildCacheKey({ text: 'old', voice: 'abe', provider: 'abevoice' })
    TTSCache.setCachedAudio(expireKey, 'ZmFrZQ==', {}, 1) // 1 ms ttl
    // wait briefly
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const c = TTSCache.getCachedAudio(expireKey)
        expect(c).toBeNull()
        resolve()
      }, 10)
    })
  })
})
