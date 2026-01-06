## Voice / Telephony PR checklist

Use this template when your PR touches voice generation, TTS metadata, telephony providers, or webhook handling.

- [ ] Short Appraisal summary (1–2 sentences): what context/signalsTriggered and what response/behavior this change aims to produce.
- [ ] Primary vulnerabilities identified (choose from: Safety, Competence, Identity, Autonomy, Belonging, Meaning)
- [ ] Tests added/updated:
  - [ ] Unit tests asserting AbëVoice emission `metadata` includes **emotion**, **intensity**, **pacing**
  - [ ] Smoke-check script or instructions added (`scripts/run-voice-smoke.sh` or `scripts/demo-fallback.sh`)
- [ ] Manual smoke-check instructions included in PR description (curl sample or `scripts/demo-fallback.sh` invocation)
- [ ] No secrets committed (double-checked `.env` and code changes)
- [ ] If DB schema changed: Prisma migration included and reviewed
- [ ] If webhook changes: signature verification intact and tests added for security path

Notes:
- For any change that alters user-facing tone or call behavior, request a manual review by `@oncall` (replace with the right handle) and include steps for manual QA.
- Keep PRs small and focused for voice-affecting changes.
