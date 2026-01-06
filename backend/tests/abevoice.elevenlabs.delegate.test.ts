import fetch from 'node-fetch'
import { AbëVoiceIntegration } from '../src/services/abevoice-integration'
import ElevenLabsProvider from '../src/services/tts/elevenlabs'

jest.mock('node-fetch', () => jest.fn())
const fetchMock = fetch as unknown as jest.Mock

jest.mock('../src/services/tts/elevenlabs')
const ElevenLabsMock = ElevenLabsProvider as unknown as jest.Mock

describe('AbëVoiceIntegration provider delegation', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    ElevenLabsMock.mockReset()
  })

  it('delegates to ElevenLabs provider when provider=elevenlabs', async () => {
    const fakeRes = { success: true, audio_base64: 'ZmFrZQ==', metadata: { provider: 'elevenlabs' } }
    const genMock = jest.fn().mockResolvedValue(fakeRes)
    ElevenLabsMock.mockImplementation(() => ({ generate: genMock }))

    const ab = new AbëVoiceIntegration('http://localhost:8000', 'apikey')
    const res = await ab.generate({ text: 'test', provider: 'elevenlabs' } as any)

    expect(genMock).toHaveBeenCalled()
    expect(res).toMatchObject(fakeRes)
  })
})
