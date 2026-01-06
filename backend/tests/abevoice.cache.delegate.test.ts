import fs from 'fs'
import TTSCache from '../src/services/tts/cache'
import fetch from 'node-fetch'
import { AbëVoiceIntegration } from '../src/services/abevoice-integration'
import ElevenLabsProvider from '../src/services/tts/elevenlabs'

jest.mock('node-fetch', () => jest.fn())
const fetchMock = fetch as unknown as jest.Mock

jest.mock('../src/services/tts/elevenlabs')
const ElevenLabsMock = ElevenLabsProvider as unknown as jest.Mock

describe('AbeVoiceIntegration cache delegation', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    ElevenLabsMock.mockReset()
  })

  it('returns cached audio instead of calling provider', async () => {
    const ab = new AbëVoiceIntegration('http://localhost:8000', 'apikey')
    const options: any = { text: 'cached test', provider: 'elevenlabs', voice: 'alloy', emotion: 'assurance' }
    const key = TTSCache.buildCacheKey({ text: options.text, voice: options.voice, provider: options.provider, emotion: options.emotion })

    // pre-populate cache
    TTSCache.setCachedAudio(key, 'ZmFrZQ==', { provider: 'cache' })

    const genMock = jest.fn()
    ElevenLabsMock.mockImplementation(() => ({ generate: genMock }))

    const res = await ab.generate(options)

    expect(genMock).not.toHaveBeenCalled()
    expect(res.success).toBe(true)
    expect(res.audio_base64).toBe('ZmFrZQ==')
  })
})
