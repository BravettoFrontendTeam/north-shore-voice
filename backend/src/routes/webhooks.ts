/**
 * Webhook Routes
 * Handles incoming webhooks from external services
 */

import { Router, Request, Response } from 'express';
import { callHandler } from '../services/call-handler';

const router = Router();

/**
 * POST /api/webhooks/call/incoming
 * Handle incoming call webhook from phone provider
 * YAGNI × JØHN: Signature verification for telephony providers (essential security)
 */
router.post('/call/incoming', async (req: Request, res: Response) => {
  try {
    // P0 Fix 3: Verify webhook signatures - enforce in production
    const provider = req.headers['x-provider'] || req.body.provider || 'unknown';
    const isTwilio = provider === 'twilio' || req.headers['x-twilio-signature'];
    
    if (isTwilio && process.env.TWILIO_AUTH_TOKEN) {
      const { verifyTwilioWebhook } = require('../utils/webhook-security');
      const signature = req.headers['x-twilio-signature'] as string | undefined;
      const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      
      // P0 Fix 3: In production, signature is required
      if (process.env.NODE_ENV === 'production' && !signature) {
        return res.status(403).json({ error: 'Missing webhook signature' });
      }
      
      const isValid = verifyTwilioWebhook(
        url,
        req.body,
        signature,
        process.env.TWILIO_AUTH_TOKEN
      );
      
      if (!isValid) {
        return res.status(403).json({ error: 'Invalid webhook signature' });
      }
    } else if (process.env.NODE_ENV === 'production' && isTwilio) {
      // P0 Fix 3: Production requires signature verification
      return res.status(403).json({ error: 'Webhook signature verification required' });
    }

    const { callSid, from, to, direction } = req.body;

    console.log(`Incoming call webhook: ${from} -> ${to}`);

    if (direction === 'inbound') {
      const session = await callHandler.handleIncomingCall({
        callId: callSid,
        from,
        to,
        timestamp: new Date(),
      });

      if (session) {
        res.json({
          success: true,
          session_id: session.id,
          action: 'answer',
        });
      } else {
        res.status(500).json({ error: 'Failed to handle call' });
      }
    } else {
      res.json({ success: true, action: 'continue' });
    }
  } catch (error) {
    console.error('Incoming call webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * POST /api/webhooks/call/status
 * Handle call status updates
 */
router.post('/call/status', async (req: Request, res: Response) => {
  try {
    const { callSid, callStatus, sessionId, duration } = req.body;

    console.log(`Call status update: ${callSid} - ${callStatus}`);

    if (callStatus === 'completed' && sessionId) {
      await callHandler.endCall(sessionId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Call status webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * POST /api/webhooks/call/transcription
 * Handle real-time transcription webhook
 */
router.post('/call/transcription', async (req: Request, res: Response) => {
  try {
    const { sessionId, text, confidence, isFinal } = req.body;

    if (isFinal && sessionId && text) {
      await callHandler.processSpeech(sessionId, text);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Transcription webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhooks
 * YAGNI × JØHN: Signature verification required (essential security)
 */
router.post('/stripe', async (req: Request, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'] as string | undefined;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Verify webhook signature (YAGNI × JØHN: Essential security)
    if (process.env.NODE_ENV === 'production' || webhookSecret) {
      const { verifyStripeWebhook } = require('../utils/webhook-security');
      const isValid = verifyStripeWebhook(req.body, sig, webhookSecret);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }
    }

    const event = JSON.parse(req.body.toString());

    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Checkout completed:', event.data.object);
        // Handle successful checkout
        break;

      case 'customer.subscription.created':
        console.log('Subscription created:', event.data.object);
        // Update user plan
        break;

      case 'customer.subscription.updated':
        console.log('Subscription updated:', event.data.object);
        // Update user plan
        break;

      case 'customer.subscription.deleted':
        console.log('Subscription cancelled:', event.data.object);
        // Downgrade user to free plan
        break;

      case 'invoice.payment_succeeded':
        console.log('Payment succeeded:', event.data.object);
        // Record payment
        break;

      case 'invoice.payment_failed':
        console.log('Payment failed:', event.data.object);
        // Notify user
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

/**
 * GET /api/webhooks/health
 * Health check for webhooks
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/webhooks/call/incoming',
      '/api/webhooks/call/status',
      '/api/webhooks/call/transcription',
      '/api/webhooks/stripe',
    ],
  });
});

export default router;

