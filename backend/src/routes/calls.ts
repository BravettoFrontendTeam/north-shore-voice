/**
 * Call Routes
 * Handles call session management
 */

import { Router, Request, Response } from 'express';
import { callHandler } from '../services/call-handler';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * POST /api/calls/initialize
 * Initialize a new call session
 */
router.post('/initialize', async (req: Request, res: Response) => {
  try {
    const { phone_number, voice_model_id } = req.body;

    if (!phone_number) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const session = await callHandler.initializeCall(phone_number, voice_model_id);
    res.json(session);
  } catch (error) {
    console.error('Call initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize call' });
  }
});

/**
 * POST /api/calls/:sessionId/speech
 * Process caller speech and get AI response
 */
router.post('/:sessionId/speech', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await callHandler.processSpeech(sessionId, text);

    if (!result) {
      return res.status(404).json({ error: 'Session not found or inactive' });
    }

    res.json(result);
  } catch (error) {
    console.error('Speech processing error:', error);
    res.status(500).json({ error: 'Failed to process speech' });
  }
});

/**
 * POST /api/calls/:sessionId/end
 * End a call session
 */
router.post('/:sessionId/end', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const summary = await callHandler.endCall(sessionId);

    if (!summary) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ success: true, summary });
  } catch (error) {
    console.error('End call error:', error);
    res.status(500).json({ error: 'Failed to end call' });
  }
});

/**
 * GET /api/calls/:sessionId/transcript
 * Get call transcript
 */
router.get('/:sessionId/transcript', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const transcript = callHandler.getCallTranscript(sessionId);

    if (!transcript) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      session_id: sessionId,
      messages: transcript,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get transcript' });
  }
});

/**
 * GET /api/calls/:sessionId
 * Get call session details
 */
router.get('/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = callHandler.getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get session' });
  }
});

/**
 * GET /api/calls
 * Get all call sessions (with pagination)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const status = req.query.status as string;

    // Get active sessions from handler
    let sessions = callHandler.getActiveSessions();

    // Filter by status if provided
    if (status) {
      sessions = sessions.filter(s => s.status === status);
    }

    // Apply pagination
    const paginatedSessions = sessions.slice(offset, offset + limit);

    res.json({
      sessions: paginatedSessions,
      total: sessions.length,
      limit,
      offset,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

/**
 * POST /api/calls/incoming
 * Handle incoming call webhook
 */
router.post('/incoming', async (req: Request, res: Response) => {
  try {
    const { callId, from, to } = req.body;

    const session = await callHandler.handleIncomingCall({
      callId,
      from,
      to,
      timestamp: new Date(),
    });

    if (!session) {
      return res.status(500).json({ error: 'Failed to handle incoming call' });
    }

    res.json({
      success: true,
      session_id: session.id,
      voice_model_id: session.voiceModelId,
    });
  } catch (error) {
    console.error('Incoming call error:', error);
    res.status(500).json({ error: 'Failed to handle incoming call' });
  }
});

export default router;

