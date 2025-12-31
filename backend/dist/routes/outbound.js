"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeOutboundRoutes = void 0;
const express_1 = require("express");
const outbound_call_service_1 = require("../services/outbound-call.service");
const router = (0, express_1.Router)();
// Initialize services (in production, use dependency injection)
let outboundService = null;
const initializeOutboundRoutes = (wsService, abevoice) => {
    outboundService = new outbound_call_service_1.OutboundCallService(wsService, abevoice);
};
exports.initializeOutboundRoutes = initializeOutboundRoutes;
/**
 * POST /api/outbound/call
 * Initiate a single outbound call
 */
router.post('/outbound/call', async (req, res) => {
    try {
        const { businessId, recipient, script, voiceId } = req.body;
        if (!businessId || !recipient?.phoneNumber) {
            return res.status(400).json({ error: 'Business ID and recipient phone number required' });
        }
        if (!outboundService) {
            return res.status(500).json({ error: 'Service not initialized' });
        }
        const session = await outboundService.initiateCall(businessId, recipient, script, voiceId);
        return res.json({
            success: true,
            session,
        });
    }
    catch (error) {
        console.error('Error initiating call:', error);
        return res.status(500).json({
            error: error.message || 'Failed to initiate call'
        });
    }
});
/**
 * POST /api/outbound/campaign
 * Create a new outbound call campaign
 */
router.post('/outbound/campaign', async (req, res) => {
    try {
        const { businessId, name, description, contacts, scriptTemplate, voiceId, schedule, rateLimiting } = req.body;
        if (!businessId || !name || !contacts?.length || !scriptTemplate) {
            return res.status(400).json({
                error: 'Business ID, name, contacts, and script template required'
            });
        }
        if (!outboundService) {
            return res.status(500).json({ error: 'Service not initialized' });
        }
        const config = {
            name,
            description,
            scriptTemplate,
            voiceId,
            rateLimiting,
        };
        const campaign = await outboundService.scheduleBulkCalls(businessId, contacts, config, schedule);
        return res.json({
            success: true,
            campaign,
        });
    }
    catch (error) {
        console.error('Error creating campaign:', error);
        return res.status(500).json({
            error: error.message || 'Failed to create campaign'
        });
    }
});
/**
 * GET /api/outbound/campaigns
 * List all campaigns for a business
 */
router.get('/outbound/campaigns', async (req, res) => {
    try {
        const businessId = req.query.businessId;
        const status = req.query.status;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        if (!outboundService) {
            return res.status(500).json({ error: 'Service not initialized' });
        }
        const campaigns = outboundService.getCampaigns(businessId);
        // Filter by status if provided
        const filtered = status
            ? campaigns.filter(c => c.status === status)
            : campaigns;
        return res.json({
            campaigns: filtered,
            pagination: {
                page,
                limit,
                total: filtered.length,
                totalPages: Math.ceil(filtered.length / limit),
            },
        });
    }
    catch (error) {
        console.error('Error fetching campaigns:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * GET /api/outbound/campaigns/:campaignId
 * Get campaign details
 */
router.get('/outbound/campaigns/:campaignId', async (req, res) => {
    try {
        const { campaignId } = req.params;
        if (!outboundService) {
            return res.status(500).json({ error: 'Service not initialized' });
        }
        const campaign = outboundService.getCampaign(campaignId);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        return res.json(campaign);
    }
    catch (error) {
        console.error('Error fetching campaign:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * POST /api/outbound/campaigns/:campaignId/start
 * Start a campaign
 */
router.post('/outbound/campaigns/:campaignId/start', async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { businessId } = req.body;
        if (!businessId) {
            return res.status(400).json({ error: 'Business ID required' });
        }
        if (!outboundService) {
            return res.status(500).json({ error: 'Service not initialized' });
        }
        await outboundService.startCampaign(campaignId, businessId);
        return res.json({
            success: true,
            message: 'Campaign started',
        });
    }
    catch (error) {
        console.error('Error starting campaign:', error);
        return res.status(500).json({
            error: error.message || 'Failed to start campaign'
        });
    }
});
/**
 * POST /api/outbound/campaigns/:campaignId/pause
 * Pause a running campaign
 */
router.post('/outbound/campaigns/:campaignId/pause', async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { businessId } = req.body;
        if (!businessId) {
            return res.status(400).json({ error: 'Business ID required' });
        }
        if (!outboundService) {
            return res.status(500).json({ error: 'Service not initialized' });
        }
        await outboundService.pauseCampaign(campaignId, businessId);
        return res.json({
            success: true,
            message: 'Campaign paused',
        });
    }
    catch (error) {
        console.error('Error pausing campaign:', error);
        return res.status(500).json({
            error: error.message || 'Failed to pause campaign'
        });
    }
});
/**
 * POST /api/outbound/campaigns/:campaignId/resume
 * Resume a paused campaign
 */
router.post('/outbound/campaigns/:campaignId/resume', async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { businessId } = req.body;
        if (!businessId) {
            return res.status(400).json({ error: 'Business ID required' });
        }
        if (!outboundService) {
            return res.status(500).json({ error: 'Service not initialized' });
        }
        await outboundService.resumeCampaign(campaignId, businessId);
        return res.json({
            success: true,
            message: 'Campaign resumed',
        });
    }
    catch (error) {
        console.error('Error resuming campaign:', error);
        return res.status(500).json({
            error: error.message || 'Failed to resume campaign'
        });
    }
});
/**
 * POST /api/outbound/campaigns/:campaignId/cancel
 * Cancel a campaign
 */
router.post('/outbound/campaigns/:campaignId/cancel', async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { businessId } = req.body;
        if (!businessId) {
            return res.status(400).json({ error: 'Business ID required' });
        }
        if (!outboundService) {
            return res.status(500).json({ error: 'Service not initialized' });
        }
        await outboundService.cancelCampaign(campaignId, businessId);
        return res.json({
            success: true,
            message: 'Campaign cancelled',
        });
    }
    catch (error) {
        console.error('Error cancelling campaign:', error);
        return res.status(500).json({
            error: error.message || 'Failed to cancel campaign'
        });
    }
});
/**
 * GET /api/outbound/results
 * Get campaign results and analytics
 */
router.get('/outbound/results', async (req, res) => {
    try {
        const campaignId = req.query.campaignId;
        if (!campaignId) {
            return res.status(400).json({ error: 'Campaign ID required' });
        }
        if (!outboundService) {
            return res.status(500).json({ error: 'Service not initialized' });
        }
        const results = outboundService.getCampaignResults(campaignId);
        if (!results) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        return res.json(results);
    }
    catch (error) {
        console.error('Error fetching results:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * POST /api/outbound/schedule
 * Schedule a callback
 */
router.post('/outbound/schedule', async (req, res) => {
    try {
        const { businessId, phoneNumber, name, reason, preferredTime } = req.body;
        if (!businessId || !phoneNumber) {
            return res.status(400).json({ error: 'Business ID and phone number required' });
        }
        if (!outboundService) {
            return res.status(500).json({ error: 'Service not initialized' });
        }
        const callback = await outboundService.scheduleCallback(businessId, phoneNumber, name, reason, preferredTime ? new Date(preferredTime) : undefined);
        return res.json({
            success: true,
            callback,
        });
    }
    catch (error) {
        console.error('Error scheduling callback:', error);
        return res.status(500).json({
            error: error.message || 'Failed to schedule callback'
        });
    }
});
/**
 * GET /api/outbound/session/:sessionId
 * Get call session status
 */
router.get('/outbound/session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        if (!outboundService) {
            return res.status(500).json({ error: 'Service not initialized' });
        }
        const session = outboundService.getSession(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        return res.json(session);
    }
    catch (error) {
        console.error('Error fetching session:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * GET /api/outbound/analytics
 * Get outbound call analytics
 */
router.get('/outbound/analytics', async (req, res) => {
    try {
        const businessId = req.query.businessId;
        const period = req.query.period || 'daily';
        // In production, calculate from database
        const analytics = {
            period,
            totalCalls: 89,
            answeredCalls: 52,
            voicemailCalls: 24,
            failedCalls: 13,
            avgDuration: 180,
            answerRate: 58,
            conversionRate: 12,
            campaignStats: {
                active: 2,
                completed: 5,
                scheduled: 1,
            },
            dailyTrend: [
                { date: '2024-01-15', calls: 15, answered: 9 },
                { date: '2024-01-16', calls: 18, answered: 11 },
                { date: '2024-01-17', calls: 12, answered: 7 },
                { date: '2024-01-18', calls: 22, answered: 13 },
                { date: '2024-01-19', calls: 22, answered: 12 },
            ],
            topPerformingCampaigns: [
                { name: 'Q1 Outreach', answerRate: 72, conversions: 8 },
                { name: 'Follow-up Campaign', answerRate: 65, conversions: 5 },
                { name: 'New Leads', answerRate: 45, conversions: 3 },
            ],
        };
        return res.json(analytics);
    }
    catch (error) {
        console.error('Error fetching analytics:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * POST /api/outbound/contacts/import
 * Import contacts for campaigns
 */
router.post('/outbound/contacts/import', async (req, res) => {
    try {
        const { businessId, contacts } = req.body;
        if (!businessId || !contacts?.length) {
            return res.status(400).json({ error: 'Business ID and contacts required' });
        }
        // Validate contacts
        const validContacts = [];
        const errors = [];
        contacts.forEach((contact, index) => {
            if (!contact.phoneNumber) {
                errors.push({ index, error: 'Phone number required' });
                return;
            }
            // Basic phone validation
            const cleanedPhone = contact.phoneNumber.replace(/\D/g, '');
            if (cleanedPhone.length < 10) {
                errors.push({ index, error: 'Invalid phone number' });
                return;
            }
            validContacts.push({
                id: `contact_${Date.now()}_${index}`,
                phoneNumber: contact.phoneNumber,
                name: contact.name,
                email: contact.email,
                customFields: contact.customFields,
            });
        });
        return res.json({
            success: true,
            imported: validContacts.length,
            errors: errors.length,
            errorDetails: errors.slice(0, 10), // Limit error details
            contacts: validContacts,
        });
    }
    catch (error) {
        console.error('Error importing contacts:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * POST /api/outbound/dnc/check
 * Check if numbers are on Do Not Call list
 */
router.post('/outbound/dnc/check', async (req, res) => {
    try {
        const { phoneNumbers } = req.body;
        if (!phoneNumbers?.length) {
            return res.status(400).json({ error: 'Phone numbers required' });
        }
        // In production, check against actual DNC list
        const results = phoneNumbers.map((number) => ({
            phoneNumber: number,
            onDNCList: false, // Simulated
            lastUpdated: new Date().toISOString(),
        }));
        return res.json({
            results,
            checked: phoneNumbers.length,
            blocked: 0,
        });
    }
    catch (error) {
        console.error('Error checking DNC:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=outbound.js.map