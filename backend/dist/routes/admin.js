"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_storage_1 = require("../utils/admin-storage");
const abevoice_integration_1 = require("../services/abevoice-integration");
const router = express_1.default.Router();
// Get empathy config for a facility
router.get('/empathy-config', async (req, res) => {
    const facilityId = String(req.query.facilityId || 'default');
    const cfg = (0, admin_storage_1.getEmpathyConfig)(facilityId) || {
        friendliness: 50,
        empathy: 50,
        warmth: 50,
        professionalism: 50,
        context_window: 'medium',
    };
    res.json({ facilityId, config: cfg });
});
// Save empathy config
router.post('/empathy-config', async (req, res) => {
    const { facilityId = 'default', config } = req.body || {};
    if (!config)
        return res.status(400).json({ error: 'Missing config' });
    (0, admin_storage_1.setEmpathyConfig)(facilityId, config);
    res.json({ ok: true, facilityId });
});
// Test Abë keys and return masked status + optional sample audio (base64)
router.post('/abekeys/test', async (req, res) => {
    const { facilityId = 'default' } = req.body || {};
    const keys = (0, admin_storage_1.getAbeKeys)(facilityId);
    // Do not return keys. Only return masked status and provider result.
    const status = {};
    // Test AbëVoice provider via existing integration (will use env ABEVOICE_API_KEY if set)
    try {
        const voices = await abevoice_integration_1.abevoiceIntegration.getVoices();
        status.abevoice = { ok: Array.isArray(voices) && voices.length > 0 };
    }
    catch (e) {
        status.abevoice = { ok: false, error: String(e.message || e) };
    }
    // If local keys include other providers we could test them here (e.g., elevenlabs)
    if (keys && keys.elevenlabs_api_key) {
        // perform a lightweight health check against ElevenLabs voices endpoint
        try {
            const res = await fetch('https://api.elevenlabs.io/v1/voices', {
                method: 'GET',
                headers: { 'xi-api-key': keys.elevenlabs_api_key },
                timeout: 5000,
            });
            if (res.ok) {
                status.elevenlabs = { ok: true };
            }
            else {
                status.elevenlabs = { ok: false, reason: `status ${res.status}` };
            }
        }
        catch (e) {
            status.elevenlabs = { ok: false, reason: String(e.message || e) };
        }
    }
    else {
        status.elevenlabs = { ok: false, reason: 'missing' };
    }
    // Optionally attempt a small sample generation using AbëVoice if available
    let sample_base64;
    try {
        const sample = await abevoice_integration_1.abevoiceIntegration.generate({ text: 'This is a test of the Abë voice.', voice: 'abe' });
        if (sample.success && sample.audio_base64)
            sample_base64 = sample.audio_base64;
    }
    catch (e) {
        // ignore
    }
    res.json({ ok: true, facilityId, status, sample_base64 });
});
// GET /admin/failures - return recent failures (newest first)
router.get('/failures', async (req, res) => {
    const limit = Number(req.query.limit || 50);
    try {
        const { getRecentFailures } = require('../utils/failure-store');
        const failures = getRecentFailures(limit);
        res.json({ ok: true, failures });
    }
    catch (e) {
        res.status(500).json({ ok: false, error: String(e.message || e) });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map