import fetch from 'node-fetch';
import { AbëVoiceIntegration } from '../src/services/abevoice-integration';

jest.mock('node-fetch', () => jest.fn());
const fetchMock = fetch as unknown as jest.Mock;

describe('AbëVoiceIntegration emotion metadata', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('sends emotion metadata for frustrated IT caller', async () => {
    const ab = new AbëVoiceIntegration('http://abevoice.local', 'testkey');
    fetchMock.mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        success: true,
        audio_base64: 'ZmFrZQ==',
        duration: 2.1,
        metadata: { emotion: 'frustration', intensity: 8, pacing: 'fast' },
      }),
      statusText: 'OK',
    });

    const text = "I'm sorry your printer keeps failing; I know how infuriating that is.";
    const res = await ab.generate({
      text,
      voice: 'evelyn',
      emotion: 'frustration',
      intensity: 8,
      pacing: 'fast',
      voice_style: 'assertive',
      directive: 'short clipped sentences, slightly faster pacing',
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const call = fetchMock.mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body.text).toBe(text);
    expect(body.metadata).toMatchObject({ emotion: 'frustration', intensity: 8, pacing: 'fast' });
    expect(res.success).toBe(true);
    expect(res.metadata).toMatchObject({ emotion: 'frustration' });
  });

  it('sends assurance metadata for optometrist caller', async () => {
    fetchMock.mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        success: true,
        audio_base64: 'ZmFrZQ==',
        duration: 3.0,
        metadata: { emotion: 'assurance', intensity: 4, pacing: 'normal' },
      }),
      statusText: 'OK',
    });

    const ab = new AbëVoiceIntegration('http://abevoice.local', 'testkey');
    const text = "You're in good hands; we'll make sure everything's set and secure.";
    const res = await ab.generate({
      text,
      voice: 'abe',
      emotion: 'assurance',
      intensity: 4,
      pacing: 'normal',
      voice_style: 'reflective',
      directive: 'calm, steady pacing; end upbeat',
    });

    const call = fetchMock.mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body.metadata).toMatchObject({ emotion: 'assurance', pacing: 'normal', intensity: 4 });
    expect(res.success).toBe(true);
    expect(res.metadata).toMatchObject({ emotion: 'assurance', intensity: 4 });
    // intensity should be within 1-10
    expect(typeof res.metadata.intensity).toBe('number');
    expect(res.metadata.intensity).toBeGreaterThanOrEqual(1);
    expect(res.metadata.intensity).toBeLessThanOrEqual(10);
  });
});
