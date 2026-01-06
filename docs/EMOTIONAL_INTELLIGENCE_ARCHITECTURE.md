EMOTIONAL INTELLIGENCE ARCHITECTURE (Radically Simple)

## Purpose

This document describes a minimal, secure, and actionable integration plan to expose and control AI "emotional intelligence" features (friendliness, empathy, warmth, context-awareness, professionalism) across the North Shore demo and admin UI. The goal is to provide Bravètto / North Shore / Optometrist facilities with simple sliders and an easy AbëKEYs onboarding flow so they can safely tune behavior with no tutorials.

## Core components

- Frontend (Admin UI): a single page `/admin/empathy-controls` with simple sliders:

  - friendliness (0-100)
  - empathy (0-100)
  - warmth (0-100)
  - professionalism (0-100)
  - context-window (short/medium/long)
  - Save / Test buttons (Test runs a small sample prompt and returns masked audio/text)

- Backend (Service): read-only integration with secret storage (AbëKEYs), an admin endpoint to test keys, and a small config store for facility-level controls. Minimal endpoints:

  - GET /api/admin/empathy-config?facilityId={id}
  - POST /api/admin/empathy-config { facilityId, config }
  - POST /api/admin/abekeys/test { facilityId } → runs provider sanity checks and returns masked status

- Secrets (AbëKEYs): store provider keys as JSON per facility in AWS Secrets Manager (recommended) or local encrypted file for dev. Example JSON:
  {
  "elevenlabs_api_key": "xxxx",
  "openai_api_key": "xxxx"
  }

- AI hooks: middleware that merges current empathy config into prompts/parameters before calling TTS/LLM services (i.e., set temperature, style tokens, voice selectors, and prompt templates).

- Metrics & health: expose `/api/north-shore/phone/status` + `/metrics` with keys: last_tts_success, last_test_call, empathy_config_last_changed, abekeys_status.

## Radically simple integration steps (MVP)

1. Add the admin endpoints (GET/POST empathy config & abekeys test) and store configurations locally (JSON file) for immediate demo use. No infra changes needed for the MVP.
2. Add the front-end page with sliders and a Test button. The Test triggers POST `/api/admin/abekeys/test` and a short sample TTS generation (fallback to pre-recorded audio if keys are missing).
3. Add a small Terraform module and stub that writes an example secret to Secrets Manager (optional for demo; full production flow later).
4. Add smoke tests: `smoke-north-shore.sh` should verify staff can set sliders, run the test, and receive masked success status.

## Security & privacy

- Never return plaintext secrets. Test endpoints only return masked status and provider metadata.
- Use AWS Secrets Manager for production; for local/demo, provide an encrypted local fallback or committed fallback audio for presentations.
- Add audit logs for admin changes (who changed, when, diff of config).

## Quick acceptance tests

- Admin can set empathy sliders and save a config for a facility.
- Test endpoint returns `ok` for known good keys or `missing`/`invalid` with provider error messages (no key material).
- Smoke test runs and asserts last_tts_success or fallback audio served.

## Next steps (recommended)

- Implement the admin endpoints + simple frontend (React) component and add feature flags for enabling Secrets Manager vs local mode.
- Add a Terraform module to manage AbëKEYs + optional KMS key and an IAM policy for service role.
- Add CI smoke workflow to validate admin flows on PRs that touch demo code or docs.

## Notes

This document is intentionally concise to enable fast demo integration; we can expand each section into an implementation plan and tasks once you confirm this direction.
