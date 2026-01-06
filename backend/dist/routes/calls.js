"use strict";
/**
 * Call Routes
 * Handles call session management
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const call_handler_1 = require("../services/call-handler");
const router = (0, express_1.Router)();
/**
 * POST /api/calls/initialize
 * Initialize a new call session
 */
router.post('/initialize', async (req, res) => {
    try {
        const { phone_number, voice_model_id } = req.body;
        if (!phone_number) {
            return res.status(400).json({ error: 'Phone number is required' });
        }
        const session = await call_handler_1.callHandler.initializeCall(phone_number, voice_model_id);
        res.json(session);
    }
    catch (error) {
        console.error('Call initialization error:', error);
        res.status(500).json({ error: 'Failed to initialize call' });
    }
});
/**
 * POST /api/calls/:sessionId/speech
 * Process caller speech and get AI response
 */
router.post('/:sessionId/speech', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        const result = await call_handler_1.callHandler.processSpeech(sessionId, text);
        if (!result) {
            return res.status(404).json({ error: 'Session not found or inactive' });
        }
        res.json(result);
    }
    catch (error) {
        console.error('Speech processing error:', error);
        res.status(500).json({ error: 'Failed to process speech' });
    }
});
/**
 * POST /api/calls/:sessionId/end
 * End a call session
 */
router.post('/:sessionId/end', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const summary = await call_handler_1.callHandler.endCall(sessionId);
        if (!summary) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.json({ success: true, summary });
    }
    catch (error) {
        console.error('End call error:', error);
        res.status(500).json({ error: 'Failed to end call' });
    }
});
/**
 * GET /api/calls/:sessionId/transcript
 * Get call transcript
 */
router.get('/:sessionId/transcript', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const transcript = call_handler_1.callHandler.getCallTranscript(sessionId);
        if (!transcript) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.json({
            session_id: sessionId,
            messages: transcript,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get transcript' });
    }
});
/**
 * GET /api/calls/:sessionId
 * Get call session details
 */
router.get('/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = call_handler_1.callHandler.getSession(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.json(session);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get session' });
    }
});
/**
 * GET /api/calls
 * Get all call sessions (with pagination)
 */
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;
        const status = req.query.status;
        // Get active sessions from handler
        let sessions = call_handler_1.callHandler.getActiveSessions();
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get sessions' });
    }
});
/**
 * POST /api/calls/incoming
 * Handle incoming call webhook
 */
router.post('/incoming', async (req, res) => {
    try {
        const { callId, from, to } = req.body;
        const session = await call_handler_1.callHandler.handleIncomingCall({
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
    }
    catch (error) {
        console.error('Incoming call error:', error);
        res.status(500).json({ error: 'Failed to handle incoming call' });
    }
});
exports.default = router;
//# sourceMappingURL=calls.js.map