# Demo Audio — scripts/demo-audio/

This folder holds cached audio used for zero-latency demos.

Files:
- `frustration.wav` — canonical frustration scenario (printer/IT issues)
- `assurance.wav` — canonical assurance scenario (optometrist reassurance)

How to generate (recommended):
- Use the generator script: `./scripts/generate-demo-audio.sh <scenario> "Text to speak"`
  - Example: `./scripts/generate-demo-audio.sh frustration "I hear you — this has been a terrible experience..."`
  - The script prefers the AbëVoice API when available, otherwise falls back to macOS `say` or `espeak`.

Tip: Commit small cached WAVs into this folder for deterministic demos (review size before committing). If you want, I can generate canonical audio locally and add them for you—tell me whether to proceed and which voice to use.