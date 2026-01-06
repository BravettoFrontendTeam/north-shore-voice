import fetch from 'node-fetch'
import ElevenLabsProvider from '../src/services/tts/elevenlabs'

jest.mock('node-fetch', () => jest.fn())
const fetchMock = fetch as unknown as jest.Mock

describe('ElevenLabsProvider', () => {
  beforeEach(() => fetchMock.mockReset())

  it('returns error if no API key configured', async () => {
    const p = new ElevenLabsProvider(undefined, 'https://api.elevenlabs.io')
    const res = await p.generate({ text: 'hi' } as any)
    expect(res.success).toBe(false)
    expect(res.error).toMatch(/not configured/)
  })

  it('sends request and returns base64 audio on success', async () => {
    const fakeAudio = Buffer.from('fake').toString('base64')
    const arrayBuffer = Buffer.from('fake') as any

    fetchMock.mockResolvedValueOnce({
      ok: true,
      arrayBuffer: async () => arrayBuffer,
      status: 200,
      statusText: 'OK',
    })

    const p = new ElevenLabsProvider('testkey', 'https://api.elevenlabs.io')
    const res = await p.generate({ text: 'hello', voice: 'alloy', emotion: 'assurance' } as any)

    expect(fetchMock).toHaveBeenCalled()
    expect(res.success).toBe(true)
    expect(res.audio_base64).toBe(fakeAudio)
    expect(res.metadata).toMatchObject({ provider: 'elevenlabs' })
    expect(typeof res.metadata.latencyMs).toBe('number')
  })

  it('returns error when provider responds non-OK', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 401, statusText: 'Unauthorized', text: async () => 'bad key' })
    const p = new ElevenLabsProvider('badkey', 'https://api.elevenlabs.io')
    const res = await p.generate({ text: 'x' } as any)
    expect(res.success).toBe(false)
    expect(res.error).toMatch(/ElevenLabs error/)
  })
})
