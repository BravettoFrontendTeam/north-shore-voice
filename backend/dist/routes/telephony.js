"use strict";
/**
 * Telephony API Routes
 * Handles multi-provider telephony operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTelephonyService = exports.initializeTelephony = void 0;
const express_1 = require("express");
const telephony_1 = require("../services/telephony");
const security_1 = require("../utils/security");
const router = (0, express_1.Router)();
// Initialize telephony service
let telephonyService = null;
// Twilio Credentials - MUST be set via environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
// Validate that credentials are properly configured
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.warn('⚠️  WARNING: Twilio credentials not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables.');
}
const initializeTelephony = () => {
    telephonyService = (0, telephony_1.createTelephonyService)({
        webhookBaseUrl: process.env.WEBHOOK_BASE_URL || 'http://localhost:5000/api/telephony/webhooks',
        defaultFromNumber: process.env.DEFAULT_FROM_NUMBER || '+15551234567',
        // Configure providers based on environment variables
        ...(process.env.TELNYX_API_KEY && {
            telnyx: {
                apiKey: process.env.TELNYX_API_KEY,
            },
        }),
        ...(process.env.PLIVO_AUTH_ID && process.env.PLIVO_AUTH_TOKEN && {
            plivo: {
                authId: process.env.PLIVO_AUTH_ID,
                authToken: process.env.PLIVO_AUTH_TOKEN,
            },
        }),
        ...(process.env.SIGNALWIRE_PROJECT_ID && process.env.SIGNALWIRE_AUTH_TOKEN && process.env.SIGNALWIRE_SPACE_URL && {
            signalwire: {
                projectId: process.env.SIGNALWIRE_PROJECT_ID,
                authToken: process.env.SIGNALWIRE_AUTH_TOKEN,
                spaceUrl: process.env.SIGNALWIRE_SPACE_URL,
            },
        }),
        // Twilio - only configure if credentials are set
        ...(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && {
            twilio: {
                accountSid: TWILIO_ACCOUNT_SID,
                authToken: TWILIO_AUTH_TOKEN,
            },
        }),
    });
    console.log('Telephony service initialized with providers:', telephonyService.getProviders());
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
        console.log('✅ Twilio configured:', { accountSid: TWILIO_ACCOUNT_SID.substring(0, 8) + '...', authToken: '***hidden***' });
    }
};
exports.initializeTelephony = initializeTelephony;
const getTelephonyService = () => telephonyService;
exports.getTelephonyService = getTelephonyService;
// ==================== Call Endpoints ====================
/**
 * POST /api/telephony/calls
 * Initiate an outbound call
 */
router.post('/calls', async (req, res) => {
    try {
        if (!telephonyService) {
            return res.status(503).json({ error: 'Telephony service not initialized' });
        }
        const { to, from, webhookUrl, timeout, machineDetection, recordCall, provider } = req.body;
        if (!to) {
            return res.status(400).json({ error: 'Phone number (to) is required' });
        }
        // Sanitize and validate phone numbers
        const sanitizedTo = (0, security_1.sanitizePhoneNumber)(to);
        if (!(0, security_1.validatePhoneNumber)(sanitizedTo)) {
            return res.status(400).json({ error: 'Invalid phone number format. Use E.164 format (e.g., +14155551234)' });
        }
        let sanitizedFrom = from;
        if (from) {
            sanitizedFrom = (0, security_1.sanitizePhoneNumber)(from);
            if (!(0, security_1.validatePhoneNumber)(sanitizedFrom)) {
                return res.status(400).json({ error: 'Invalid "from" phone number format' });
            }
        }
        const request = {
            to: sanitizedTo,
            from: sanitizedFrom,
            webhookUrl,
            timeout,
            machineDetection,
            recordCall,
        };
        const response = provider
            ? await telephonyService.makeCallWithProvider(provider, request)
            : await telephonyService.makeCall(request);
        return res.json(response);
    }
    catch (error) {
        console.error('Call error:', error);
        return res.status(500).json({ error: 'Failed to initiate call' });
    }
});
/**
 * GET /api/telephony/calls/:callId
 * Get call status
 */
router.get('/calls/:callId', async (req, res) => {
    try {
        if (!telephonyService) {
            return res.status(503).json({ error: 'Telephony service not initialized' });
        }
        const { callId } = req.params;
        const provider = req.query.provider;
        const status = await telephonyService.getCallStatus(callId, provider);
        if (!status) {
            return res.status(404).json({ error: 'Call not found' });
        }
        return res.json(status);
    }
    catch (error) {
        console.error('Get call status error:', error);
        return res.status(500).json({ error: 'Failed to get call status' });
    }
});
/**
 * POST /api/telephony/calls/:callId/end
 * End an active call
 */
router.post('/calls/:callId/end', async (req, res) => {
    try {
        if (!telephonyService) {
            return res.status(503).json({ error: 'Telephony service not initialized' });
        }
        const { callId } = req.params;
        const provider = req.body.provider;
        const success = await telephonyService.endCall(callId, provider);
        return res.json({ success });
    }
    catch (error) {
        console.error('End call error:', error);
        return res.status(500).json({ error: 'Failed to end call' });
    }
});
/**
 * POST /api/telephony/calls/:callId/transfer
 * Transfer an active call
 */
router.post('/calls/:callId/transfer', async (req, res) => {
    try {
        if (!telephonyService) {
            return res.status(503).json({ error: 'Telephony service not initialized' });
        }
        const { callId } = req.params;
        const { transferTo, provider } = req.body;
        if (!transferTo) {
            return res.status(400).json({ error: 'Transfer destination (transferTo) is required' });
        }
        const success = await telephonyService.transferCall(callId, transferTo, provider);
        return res.json({ success });
    }
    catch (error) {
        console.error('Transfer call error:', error);
        return res.status(500).json({ error: 'Failed to transfer call' });
    }
});
// ==================== SMS Endpoints ====================
/**
 * POST /api/telephony/sms
 * Send an SMS
 */
router.post('/sms', async (req, res) => {
    try {
        if (!telephonyService) {
            return res.status(503).json({ error: 'Telephony service not initialized' });
        }
        const { to, from, body, mediaUrls } = req.body;
        if (!to || !body) {
            return res.status(400).json({ error: 'Phone number (to) and message (body) are required' });
        }
        const response = await telephonyService.sendSMS({
            to,
            from,
            body,
            mediaUrls,
        });
        return res.json(response);
    }
    catch (error) {
        console.error('SMS error:', error);
        return res.status(500).json({ error: 'Failed to send SMS' });
    }
});
// ==================== Phone Number Endpoints ====================
/**
 * GET /api/telephony/numbers
 * List phone numbers
 */
router.get('/numbers', async (req, res) => {
    try {
        if (!telephonyService) {
            return res.status(503).json({ error: 'Telephony service not initialized' });
        }
        const provider = req.query.provider;
        const numbers = await telephonyService.listNumbers(provider);
        return res.json({ numbers });
    }
    catch (error) {
        console.error('List numbers error:', error);
        return res.status(500).json({ error: 'Failed to list numbers' });
    }
});
/**
 * POST /api/telephony/numbers
 * Purchase a phone number
 */
router.post('/numbers', async (req, res) => {
    try {
        if (!telephonyService) {
            return res.status(503).json({ error: 'Telephony service not initialized' });
        }
        const { number, provider } = req.body;
        if (!number) {
            return res.status(400).json({ error: 'Phone number is required' });
        }
        const result = await telephonyService.purchaseNumber(number, provider);
        if (!result) {
            return res.status(500).json({ error: 'Failed to purchase number' });
        }
        return res.json(result);
    }
    catch (error) {
        console.error('Purchase number error:', error);
        return res.status(500).json({ error: 'Failed to purchase number' });
    }
});
/**
 * DELETE /api/telephony/numbers/:number
 * Release a phone number
 */
router.delete('/numbers/:number', async (req, res) => {
    try {
        if (!telephonyService) {
            return res.status(503).json({ error: 'Telephony service not initialized' });
        }
        const { number } = req.params;
        const provider = req.query.provider;
        const success = await telephonyService.releaseNumber(number, provider);
        return res.json({ success });
    }
    catch (error) {
        console.error('Release number error:', error);
        return res.status(500).json({ error: 'Failed to release number' });
    }
});
// ==================== Provider Management ====================
/**
 * GET /api/telephony/providers
 * List configured providers and their health status
 */
router.get('/providers', async (req, res) => {
    try {
        const service = telephonyService;
        if (!service) {
            return res.status(503).json({ error: 'Telephony service not initialized' });
        }
        const providers = service.getProviders();
        const health = service.getProviderHealth();
        const providerInfo = providers.map(p => ({
            name: p,
            healthy: health.get(p) || false,
            costPerMinute: service.getProviderCost(p),
        }));
        return res.json({
            providers: providerInfo,
            cheapest: service.getCheapestProvider(),
        });
    }
    catch (error) {
        console.error('List providers error:', error);
        return res.status(500).json({ error: 'Failed to list providers' });
    }
});
/**
 * GET /api/telephony/providers/:provider/health
 * Check provider health
 */
router.get('/providers/:provider/health', async (req, res) => {
    try {
        if (!telephonyService) {
            return res.status(503).json({ error: 'Telephony service not initialized' });
        }
        const { provider } = req.params;
        const healthy = await telephonyService.checkProviderHealth(provider);
        return res.json({ provider, healthy });
    }
    catch (error) {
        console.error('Health check error:', error);
        return res.status(500).json({ error: 'Failed to check provider health' });
    }
});
/**
 * POST /api/telephony/providers/:provider/set-primary
 * Set a provider as primary
 */
router.post('/providers/:provider/set-primary', async (req, res) => {
    try {
        if (!telephonyService) {
            return res.status(503).json({ error: 'Telephony service not initialized' });
        }
        const { provider } = req.params;
        telephonyService.setPrimaryProvider(provider);
        return res.json({ success: true, primaryProvider: provider });
    }
    catch (error) {
        console.error('Set primary error:', error);
        return res.status(500).json({ error: 'Failed to set primary provider' });
    }
});
/**
 * GET /api/telephony/estimate
 * Estimate call cost across providers
 */
router.get('/estimate', async (req, res) => {
    try {
        if (!telephonyService) {
            return res.status(503).json({ error: 'Telephony service not initialized' });
        }
        const durationMinutes = parseFloat(req.query.duration) || 1;
        const estimates = await telephonyService.estimateCallCost(durationMinutes);
        return res.json({
            durationMinutes,
            estimates,
        });
    }
    catch (error) {
        console.error('Estimate error:', error);
        return res.status(500).json({ error: 'Failed to estimate cost' });
    }
});
// ==================== Webhook Endpoints ====================
/**
 * POST /api/telephony/webhooks/:provider/voice
 * Handle voice webhooks from providers
 */
router.post('/webhooks/:provider/voice', async (req, res) => {
    try {
        const { provider } = req.params;
        // Validate webhook signature for Twilio
        if (provider === 'twilio' && TWILIO_AUTH_TOKEN) {
            const signature = req.headers['x-twilio-signature'];
            const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
            if (!signature || !(0, security_1.validateTwilioSignature)(signature, fullUrl, req.body, TWILIO_AUTH_TOKEN)) {
                console.warn('Invalid Twilio webhook signature');
                return res.status(403).send('Invalid signature');
            }
        }
        console.log(`Received voice webhook from ${provider}:`, req.body);
        if (telephonyService) {
            const event = telephonyService.parseWebhook(provider, req.body);
            if (event) {
                console.log('Parsed webhook event:', event);
                // TODO: Emit to WebSocket, update call status, etc.
            }
        }
        // Respond with TwiML/PCML/etc. for IVR
        // This is a simple example - customize based on your needs
        const response = generateVoiceResponse(provider);
        res.type('application/xml').send(response);
    }
    catch (error) {
        console.error('Voice webhook error:', error);
        res.status(500).send('Error processing webhook');
    }
});
/**
 * POST /api/telephony/webhooks/:provider/status
 * Handle call status webhooks
 */
router.post('/webhooks/:provider/status', async (req, res) => {
    try {
        const { provider } = req.params;
        console.log(`Received status webhook from ${provider}:`, req.body);
        if (telephonyService) {
            const event = telephonyService.parseWebhook(provider, req.body);
            if (event) {
                console.log('Call status update:', event);
                // TODO: Update database, emit to WebSocket
            }
        }
        res.status(200).send('OK');
    }
    catch (error) {
        console.error('Status webhook error:', error);
        res.status(500).send('Error processing webhook');
    }
});
/**
 * POST /api/telephony/webhooks/:provider/sms-status
 * Handle SMS status webhooks
 */
router.post('/webhooks/:provider/sms-status', async (req, res) => {
    try {
        const { provider } = req.params;
        console.log(`Received SMS status webhook from ${provider}:`, req.body);
        res.status(200).send('OK');
    }
    catch (error) {
        console.error('SMS status webhook error:', error);
        res.status(500).send('Error processing webhook');
    }
});
// Helper function to generate voice response XML
function generateVoiceResponse(provider) {
    const abevoiceWebhook = process.env.ABEVOICE_WEBHOOK_URL || 'http://localhost:8000/api/v1/voice';
    switch (provider) {
        case 'plivo':
            return `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Speak voice="WOMAN">Hello! Welcome to North Shore Voice. How can I help you today?</Speak>
          <GetDigits action="${abevoiceWebhook}" method="POST" timeout="10" numDigits="1">
            <Speak>Press 1 for sales, 2 for support, or stay on the line to speak with our AI assistant.</Speak>
          </GetDigits>
        </Response>`;
        case 'signalwire':
        case 'twilio':
            return `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="alice">Hello! Welcome to North Shore Voice. How can I help you today?</Say>
          <Gather action="${abevoiceWebhook}" method="POST" timeout="10" numDigits="1">
            <Say>Press 1 for sales, 2 for support, or stay on the line to speak with our AI assistant.</Say>
          </Gather>
        </Response>`;
        case 'telnyx':
            // Telnyx uses JSON for call control
            return JSON.stringify({
                speak: {
                    payload: 'Hello! Welcome to North Shore Voice. How can I help you today?',
                    voice: 'female',
                    language: 'en-US',
                },
            });
        default:
            return `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say>Hello! Welcome to North Shore Voice.</Say>
        </Response>`;
    }
}
exports.default = router;
//# sourceMappingURL=telephony.js.map