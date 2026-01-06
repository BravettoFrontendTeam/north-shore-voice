# AGENT_PROMPT.md — AbëVoice Emotional Intelligence Agent Guidance

Purpose: Provide concrete, copy/pasteable prompt & verification guidance for AI agents and human engineers working on AbëVoice flows: how to reason about emotion, generate coherent TTS, and validate behavior.

Core Principles
- Appraisal-first: infer Goal Relevance, Goal Congruence, Coping Potential, Norms, Agency, and Temporal Dynamics before deciding _how_ to respond (see `docs/EMOTIONAL_INTELLIGENCE_ARCHITECTURE.md`).
- Vulnerability-mapping: identify which vulnerabilities (Safety, Competence, Identity, Autonomy, Belonging, Meaning) are implicated and prioritize them in the response.
- Emotional coherence: ensure lexicon, syntax, prosody (pacing), and perspective align with the target emotion (e.g., sadness → slower pacing, concrete sensory language, gentle tone).
- Responsibility & agency: take responsibility for system faults, offer clear fixes, and restore agency to the user; do not blame or minimize.

When modifying voice/TTS code
- Edit `backend/src/services/abevoice-integration.ts` for generation flows. Add unit tests that assert returned emission metadata includes `emotion`, `intensity`, and `pacing` fields.
- Add changes to `backend/src/services/context-graph-engine.ts` to update appraisal or context features if the logic needs new context signals.
- Keep webhook raw parsing unchanged (see `backend/src/routes/webhooks.ts`).

Prompt templates (copy/paste)
- Coherent Response Template:
```
Context: <short context summary>
Primary vulnerabilities: <list>
Predicted emotion: <emotion> (intensity: 1-10)
Response goal: <resolve|de-escalate|inform|repair>
Produce: "<short, example utterance>" with pacing=<slow|normal|fast>, lexicon=<concrete|formal|intimate>, perspective=<I|we>.
```
- Example (data-loss; sadness):
```
Context: User's data was deleted by mistake; user highly values data.
Primary vulnerabilities: Safety, Trust
Predicted emotion: sadness (intensity 7)
Response goal: repair, inform
Produce: "I need to tell you something that happened on our end. Your data was deleted. I'm so sorry — I know that was important to you." pacing=slow, lexicon=concrete, perspective=we
```

TTS generation parameters to pass to AbëVoice
- emotion (string): e.g., "sadness", "frustration", "calm"
- intensity (1-10)
- pacing: slow|normal|fast
- voice_style: plain|reflective|assertive
- directive: small guidance for prosody, e.g., "pause after the first sentence; slightly faster on explanation"

Verification & tests (must be included in PRs touching voice)
- Add a unit test that calls the integration (or simulation) in `abevoice-integration` with a canonical prompt and asserts returned metadata includes expected `emotion` and `pacing` values.
- Add a small audio/utterance smoke-check in `scripts/smoke-check.sh` or a new script that plays or inspects sample outputs for the emotional dimension.
- Include a short PR note: "Appraisal: <summary>, Vulnerabilities: <summary>, Chosen tone & why"

Security & safe practices
- Never log or print secrets. Do not commit API keys or credentials.
- Webhook routes require raw bodies for signature verification — do not change `express.raw()` behavior in `webhooks.ts`.

Where to look for examples
- Emotional architecture and rationales: `docs/EMOTIONAL_INTELLIGENCE_ARCHITECTURE.md`
- TTS & integration: `backend/src/services/abevoice-integration.ts`
- Context graph & appraisal: `backend/src/services/context-graph-engine.ts`
- Telephony & webhook behavior: `backend/src/services/telephony/` and `backend/src/routes/webhooks.ts`

Quick checklist for PRs that touch voice flows
- [ ] Appraisal summary included in PR description
- [ ] Unit test for emotion metadata
- [ ] Manual smoke-check instructions (sample curl/example) in PR
- [ ] No secrets committed

Scenario templates (copy/paste)

- Frustrated IT caller (printer/IT systems) — high-intensity anger/frustration
```
Context: Optometrist or IT contact calling about repeated printer/computer/voice system failures; customer voice indicates mounting anger or sarcasm.
Primary vulnerabilities: Competence (they can't complete work), Safety (business impact), Identity (professional reputation at stake)
Predicted emotion: frustration/anger (intensity 7-9)
Response goal: de-escalate, restore control, promise clear remediation steps
Produce (example utterance): "I hear you — this has been a terrible experience and I wouldn't expect you to keep dealing with it. Here's exactly what I'm going to do right now to fix it." pacing=fast, lexicon=concrete, perspective=we, voice_style=assertive
AbëVoice params: emotion=frustration, intensity=8, pacing=fast, voice_style=assertive, directive="short, clipped sentences; quick admission, immediate actions listed"

- Optometrist caller (calm, serious, needs assurance & upbeat outcome)
```
Context: Optometrist client calling for support or account matters; professional but serious tone; needs to feel secure and supported.
Primary vulnerabilities: Safety (business continuity), Competence (trust in service), Autonomy (control over decisions)
Predicted emotion: calm but serious; desire for assurance (intensity 3-5)
Response goal: reassure, provide clear next steps, leave caller feeling secure and surprisingly upbeat
Produce (example utterance): "You're in good hands. I'll make sure everything's set and secure, and we'll follow up with a quick check-in to confirm it's working the way you need." pacing=normal, lexicon=calm+concrete, perspective=we, voice_style=reflective
AbëVoice params: emotion=assurance, intensity=4, pacing=normal, voice_style=reflective, directive="steady pacing; warm close; end with upbeat, confident inflection"

Smoke-test and unit tests added
- Example Jest tests added: `backend/tests/abevoice.emotion.test.ts` (mocks `node-fetch` and asserts outgoing body includes `metadata` fields plus returned `metadata`).
- Smoke script: `scripts/run-voice-smoke.sh` runs the test: `npm test -- abevoice.emotion.test.ts`.

Personalization & creativity (recommendations)
- Keep personalization small and high-signal: use up to 2 personalization tokens per interaction (e.g., `caller_name`, `clinic_name` or `last_issue`). Over-personalization can feel invasive.
- Enable creative generation: prefer a single generative pass (LM) that produces 3 candidate utterances; pick the highest-coherence candidate by a simple heuristic (alignment with predicted emotion + lexical concreteness). Log the rationale.
- For demos, include a short, friendly personalization line near start (e.g., "Dr. <LastName>, thanks for calling — I see the issue pertains to <last_issue>").

YAGNI / John / Abë guidance for requirement thresholds
- Minimum (fast, required for demo/hardening): appraisal extraction, vulnerability mapping, single-pass generative utterance with `metadata`, unit test and a demo fallback.
- Maximum (for production hardening): context graph persistence, trajectory prediction, confidence scoring, A/B testing hooks, escalation monitoring and observability dashboards.
- Rule of thumb: implement Minimum now; add Maximum features only when telemetry shows clear ROI (document the YAGNI rationale in PRs and link to acceptance criteria).

Demo fallback and low-latency options
- Principle: demos must never fail; plan for the web-based AbëVoice failure and offer instant local fallback options:
  - Cached canonical audio for deterministic demos (`scripts/demo-audio/`) — fastest.
  - Native local TTS fallback (macOS `say`, browser SpeechSynthesis) when AbëVoice is unreachable — good low-latency live fallback.
  - Simple stitching of short pre-recorded phrases to simulate live generation when needed.
- I added `scripts/demo-fallback.sh` (see repo) that:
  1. Checks `${ABEVOICE_API_URL:-http://localhost:8000}/api/status`.
  2. If online, posts to `/api/v1/text-to-speech` and decodes `audio_base64` into `tmp/demo.wav` and plays (`afplay`) on macOS.
  3. If AbëVoice is down, uses `say` as a quick fallback with the provided text and logs the chosen fallback.
- Add cached demo audio for common scenarios (frustration, assurance) into `scripts/demo-audio/` for zero-latency demonstrations.

Next steps I can take (pick one)
- Add canonical phrasing variants and audio fixtures for each scenario (requires assets or AbëVoice).
- Add a CI job that validates `scripts/demo-fallback.sh` against a mocked AbëVoice health endpoint.
- Expand the personalization token set (after a brief field trial) and instrument telemetry for personalization benefit.

If you want any of these, tell me which to prioritize (I recommend: 1) add demo audio fixtures, 2) add CI check for fallback script).