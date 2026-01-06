import express from 'express'
import { getEmpathyConfig, setEmpathyConfig, getAbeKeys } from '../utils/admin-storage'
import { abevoiceIntegration } from '../services/abevoice-integration'

const router = express.Router()

// Get empathy config for a facility
router.get('/empathy-config', async (req, res) => {
  const facilityId = String(req.query.facilityId || 'default')
  const cfg = getEmpathyConfig(facilityId) || {
    friendliness: 50,
    empathy: 50,
    warmth: 50,
    professionalism: 50,
    context_window: 'medium',
  }
  res.json({ facilityId, config: cfg })
})

// Save empathy config
router.post('/empathy-config', async (req, res) => {
  const { facilityId = 'default', config } = req.body || {}
  if (!config) return res.status(400).json({ error: 'Missing config' })
  setEmpathyConfig(facilityId, config)
  res.json({ ok: true, facilityId })
})

// Test Abë keys and return masked status + optional sample audio (base64)
router.post('/abekeys/test', async (req, res) => {
  const { facilityId = 'default' } = req.body || {}

  const keys = getAbeKeys(facilityId)
  // Do not return keys. Only return masked status and provider result.

  const status: any = {}

  // Test AbëVoice provider via existing integration (will use env ABEVOICE_API_KEY if set)
  try {
    const voices = await abevoiceIntegration.getVoices()
    status.abevoice = { ok: Array.isArray(voices) && voices.length > 0 }
  } catch (e: any) {
    status.abevoice = { ok: false, error: String(e.message || e) }
  }

  // If local keys include other providers we could test them here (e.g., elevenlabs)
  if (keys && keys.elevenlabs_api_key) {
    // perform a lightweight health check against ElevenLabs voices endpoint
    try {
      const res = await fetch('https://api.elevenlabs.io/v1/voices', {
        method: 'GET',
        headers: { 'xi-api-key': keys.elevenlabs_api_key },
        timeout: 5000 as any,
      } as any)

      if (res.ok) {
        status.elevenlabs = { ok: true }
      } else {
        status.elevenlabs = { ok: false, reason: `status ${res.status}` }
      }
    } catch (e: any) {
      status.elevenlabs = { ok: false, reason: String(e.message || e) }
    }
  } else {
    status.elevenlabs = { ok: false, reason: 'missing' }
  }

  // Optionally attempt a small sample generation using AbëVoice if available
  let sample_base64: string | undefined
  try {
    const sample = await abevoiceIntegration.generate({ text: 'This is a test of the Abë voice.', voice: 'abe' })
    if (sample.success && sample.audio_base64) sample_base64 = sample.audio_base64
  } catch (e) {
    // ignore
  }

  res.json({ ok: true, facilityId, status, sample_base64 })
})

// GET /admin/failures - return recent failures (newest first)
router.get('/failures', async (req, res) => {
  const limit = Number(req.query.limit || 50)
  try {
    const { getRecentFailures } = require('../utils/failure-store')
    const failures = getRecentFailures(limit)
    res.json({ ok: true, failures })
  } catch (e: any) {
    res.status(500).json({ ok: false, error: String(e.message || e) })
  }
})

export default router
