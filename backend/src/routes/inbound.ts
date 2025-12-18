import { Router, Request, Response } from 'express';
import { InboundCallService } from '../services/inbound-call.service';
import { AbëVoiceIntegration } from '../services/abevoice-integration';
import { WebSocketService } from '../services/websocket';

const router = Router();

// Initialize services (in production, use dependency injection)
let inboundService: InboundCallService | null = null;

export const initializeInboundRoutes = (wsService: WebSocketService, abevoice: AbëVoiceIntegration) => {
  inboundService = new InboundCallService(wsService, abevoice);
};

/**
 * POST /api/webhooks/inbound-call
 * Handle incoming call webhooks from telephony provider
 */
router.post('/webhooks/inbound-call', async (req: Request, res: Response) => {
  try {
    const webhookData = req.body;
    const businessId = req.headers['x-business-id'] as string || webhookData.businessId;

    if (!businessId) {
      return res.status(400).json({ error: 'Business ID required' });
    }

    if (!inboundService) {
      return res.status(500).json({ error: 'Service not initialized' });
    }

    const result = await inboundService.handleIncomingCall(webhookData, businessId);
    
    return res.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/inbound/calls
 * List inbound call history
 */
router.get('/inbound/calls', async (req: Request, res: Response) => {
  try {
    const businessId = req.query.businessId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const dateFrom = req.query.dateFrom as string;
    const dateTo = req.query.dateTo as string;

    // In production, fetch from database with filters
    // For now, return mock data
    const calls = [
      {
        id: 'call_1',
        callerNumber: '+1234567890',
        callerName: 'John Doe',
        status: 'completed',
        duration: 180,
        routedTo: 'ai_agent',
        sentiment: 'positive',
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        endedAt: new Date(Date.now() - 3420000).toISOString(),
      },
      {
        id: 'call_2',
        callerNumber: '+1987654321',
        callerName: 'Jane Smith',
        status: 'voicemail',
        duration: 45,
        routedTo: 'voicemail',
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        endedAt: new Date(Date.now() - 7155000).toISOString(),
      },
    ];

    return res.json({
      calls,
      pagination: {
        page,
        limit,
        total: calls.length,
        totalPages: 1,
      },
    });
  } catch (error) {
    console.error('Error fetching calls:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/inbound/calls/:callId
 * Get single call details
 */
router.get('/inbound/calls/:callId', async (req: Request, res: Response) => {
  try {
    const { callId } = req.params;

    if (!inboundService) {
      return res.status(500).json({ error: 'Service not initialized' });
    }

    const call = inboundService.getCall(callId);
    
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    return res.json(call);
  } catch (error) {
    console.error('Error fetching call:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/inbound/active
 * Get active calls for a business
 */
router.get('/inbound/active', async (req: Request, res: Response) => {
  try {
    const businessId = req.query.businessId as string;

    if (!businessId) {
      return res.status(400).json({ error: 'Business ID required' });
    }

    if (!inboundService) {
      return res.status(500).json({ error: 'Service not initialized' });
    }

    const activeCalls = inboundService.getActiveCalls(businessId);
    
    return res.json({ calls: activeCalls });
  } catch (error) {
    console.error('Error fetching active calls:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/inbound/routing-rules
 * Configure call routing rules
 */
router.post('/inbound/routing-rules', async (req: Request, res: Response) => {
  try {
    const { businessId, rules } = req.body;

    if (!businessId || !rules) {
      return res.status(400).json({ error: 'Business ID and rules required' });
    }

    // In production, save to database
    // For now, return success
    return res.json({
      success: true,
      message: 'Routing rules updated',
      rules,
    });
  } catch (error) {
    console.error('Error updating routing rules:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/inbound/routing-rules
 * Get routing rules for a business
 */
router.get('/inbound/routing-rules', async (req: Request, res: Response) => {
  try {
    const businessId = req.query.businessId as string;

    if (!businessId) {
      return res.status(400).json({ error: 'Business ID required' });
    }

    // In production, fetch from database
    const rules = [
      {
        id: 'rule_1',
        name: 'After Hours',
        conditionType: 'TIME_BASED',
        conditionValue: {
          timezone: 'America/New_York',
          schedule: {
            monday: [{ start: '09:00', end: '17:00' }],
            tuesday: [{ start: '09:00', end: '17:00' }],
            wednesday: [{ start: '09:00', end: '17:00' }],
            thursday: [{ start: '09:00', end: '17:00' }],
            friday: [{ start: '09:00', end: '17:00' }],
          },
        },
        actionType: 'VOICEMAIL',
        actionConfig: {
          prompt: 'We are currently closed. Please leave a message.',
        },
        priority: 10,
        isActive: true,
      },
      {
        id: 'rule_2',
        name: 'VIP Callers',
        conditionType: 'CALLER_ID',
        conditionValue: {
          patterns: ['+1555*', '+1666*'],
          matchType: 'whitelist',
        },
        actionType: 'AI_AGENT',
        actionConfig: {
          greeting: 'Welcome back! How can I assist you today?',
          priority: 5,
        },
        priority: 20,
        isActive: true,
      },
    ];

    return res.json({ rules });
  } catch (error) {
    console.error('Error fetching routing rules:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/inbound/queue-status
 * Check current call queue status
 */
router.get('/inbound/queue-status', async (req: Request, res: Response) => {
  try {
    const businessId = req.query.businessId as string;

    if (!businessId) {
      return res.status(400).json({ error: 'Business ID required' });
    }

    if (!inboundService) {
      return res.status(500).json({ error: 'Service not initialized' });
    }

    const queueStatus = await inboundService.processCallQueue(businessId);
    
    return res.json(queueStatus);
  } catch (error) {
    console.error('Error fetching queue status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/inbound/transfer
 * Transfer an active call
 */
router.post('/inbound/transfer', async (req: Request, res: Response) => {
  try {
    const { callId, transferTo, warmTransfer } = req.body;

    if (!callId || !transferTo) {
      return res.status(400).json({ error: 'Call ID and transfer destination required' });
    }

    if (!inboundService) {
      return res.status(500).json({ error: 'Service not initialized' });
    }

    const result = await inboundService.transferCall(callId, transferTo, warmTransfer);
    
    return res.json(result);
  } catch (error) {
    console.error('Error transferring call:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/inbound/end
 * End an active call
 */
router.post('/inbound/end', async (req: Request, res: Response) => {
  try {
    const { callId } = req.body;

    if (!callId) {
      return res.status(400).json({ error: 'Call ID required' });
    }

    if (!inboundService) {
      return res.status(500).json({ error: 'Service not initialized' });
    }

    await inboundService.endCall(callId);
    
    return res.json({ success: true, message: 'Call ended' });
  } catch (error) {
    console.error('Error ending call:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/inbound/analytics
 * Get inbound call analytics
 */
router.get('/inbound/analytics', async (req: Request, res: Response) => {
  try {
    const businessId = req.query.businessId as string;
    const period = req.query.period as string || 'daily';
    const dateFrom = req.query.dateFrom as string;
    const dateTo = req.query.dateTo as string;

    // In production, calculate from database
    const analytics = {
      period,
      totalCalls: 156,
      answeredCalls: 142,
      missedCalls: 8,
      voicemailCalls: 6,
      avgDuration: 245,
      avgWaitTime: 12,
      peakHours: [
        { hour: 9, calls: 18 },
        { hour: 10, calls: 24 },
        { hour: 11, calls: 22 },
        { hour: 14, calls: 28 },
        { hour: 15, calls: 25 },
      ],
      sentimentBreakdown: {
        positive: 68,
        neutral: 24,
        negative: 8,
      },
      topReasons: [
        { reason: 'Appointments', count: 45 },
        { reason: 'Pricing', count: 32 },
        { reason: 'Support', count: 28 },
        { reason: 'General Inquiry', count: 51 },
      ],
    };

    return res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

