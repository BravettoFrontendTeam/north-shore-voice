/**
 * Voice Routes
 * Handles voice generation and voice model management
 */

import { Router, Request, Response } from 'express';
import { abevoiceIntegration, VOICES } from '../services/abevoice-integration';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * GET /api/voice/status
 * Check AbëVoice API status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const isOnline = await abevoiceIntegration.isOnline();
    res.json({
      status: isOnline ? 'online' : 'offline',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.json({ status: 'offline' });
  }
});

/**
 * GET /api/voice/voices
 * Get available voices
 */
router.get('/voices', async (req: Request, res: Response) => {
  try {
    const voices = await abevoiceIntegration.getVoices();
    res.json(voices);
  } catch (error) {
    // Return predefined voices
    res.json(
      Object.entries(VOICES).map(([name, id]) => ({
        voice_id: id,
        name: name.charAt(0).toUpperCase() + name.slice(1),
      }))
    );
  }
});

/**
 * POST /api/voice/generate
 * Generate speech from text
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { text, voice_id, voice, stability, similarity_boost, style } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text too long (max 5000 characters)' });
    }

    const result = await abevoiceIntegration.generate({
      text,
      voice: voice_id || voice || 'abe',
      stability: stability ?? 0.5,
      similarity: similarity_boost ?? 0.75,
      style: style ?? 0.0,
    });

    res.json(result);
  } catch (error) {
    console.error('Voice generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Generation failed',
    });
  }
});

/**
 * POST /api/voice/generate/stream
 * Stream audio generation
 */
router.post('/generate/stream', async (req: Request, res: Response) => {
  try {
    const { text, voice_id, voice, stability, similarity_boost, style } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Stream audio chunks
    for await (const chunk of abevoiceIntegration.streamGenerate({
      text,
      voice: voice_id || voice || 'abe',
      stability: stability ?? 0.5,
      similarity: similarity_boost ?? 0.75,
      style: style ?? 0.0,
    })) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    console.error('Stream generation error:', error);
    res.status(500).json({ error: 'Stream generation failed' });
  }
});

/**
 * GET /api/voice/usage
 * Get usage statistics
 */
router.get('/usage', async (req: Request, res: Response) => {
  try {
    const usage = await abevoiceIntegration.getUsage();
    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get usage' });
  }
});

/**
 * POST /api/voice/preview
 * Preview a voice with sample text
 */
router.post('/preview', async (req: Request, res: Response) => {
  try {
    const { voice_id, voice } = req.body;
    const sampleText = "Hello! This is a preview of my voice. How does it sound?";

    const result = await abevoiceIntegration.generate({
      text: sampleText,
      voice: voice_id || voice || 'abe',
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Preview generation failed',
    });
  }
});

export default router;

