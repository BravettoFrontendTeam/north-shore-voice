#!/usr/bin/env bash
set -euo pipefail

# demo-fallback.sh
# Usage: ./scripts/demo-fallback.sh "Text to speak" [voice]
# Tries AbëVoice API first; falls back to macOS `say` if unavailable.

SCENARIO="${1:-assurance}"
TEXT="${2:-Hello, this is a demo from North Shore Voice.}"
VOICE="${3:-abe}"
BASEURL="${ABEVOICE_API_URL:-http://localhost:8000}"
APIKEY="${ABEVOICE_API_KEY:-}"

AUDIO_CACHE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/demo-audio/${SCENARIO}.wav"

# Prefer cached demo audio if present
if [ -f "$AUDIO_CACHE" ]; then
  echo "✅ Found cached demo audio: $AUDIO_CACHE"
  if command -v afplay >/dev/null 2>&1; then
    afplay "$AUDIO_CACHE"
    exit 0
  elif command -v play >/dev/null 2>&1; then
    play "$AUDIO_CACHE"
    exit 0
  else
    echo "Cached audio saved at $AUDIO_CACHE (no playback tool detected)"
    exit 0
  fi
fi

echo "🔎 Checking AbëVoice status at $BASEURL/api/status"

if curl --silent --show-error --fail "$BASEURL/api/status" >/dev/null 2>&1; then
  echo "✅ AbëVoice appears online — requesting TTS..."
  RESP=$(curl -s -X POST "$BASEURL/api/v1/text-to-speech" \
    -H "Content-Type: application/json" \
    ${APIKEY:+-H "Authorization: Bearer $APIKEY"} \
    -d "{\"text\": \"$TEXT\", \"voice_id\": \"$VOICE\", \"metadata\": {\"emotion\": \"$SCENARIO\", \"intensity\": 4}}")

  AUDIO_BASE64=$(echo "$RESP" | python3 -c "import sys, json; print(json.load(sys.stdin).get('audio_base64',''))")

  if [ -n "$AUDIO_BASE64" ]; then
    echo "✅ Received audio — saving to tmp/demo.wav"
    mkdir -p tmp
    echo "$AUDIO_BASE64" | base64 --decode > tmp/demo.wav
    if command -v afplay >/dev/null 2>&1; then
      afplay tmp/demo.wav || true
    elif command -v play >/dev/null 2>&1; then
      play tmp/demo.wav || true
    else
      echo "Audio saved to tmp/demo.wav (no playback tool detected)"
    fi
    exit 0
  else
    echo "⚠️ AbëVoice did not return audio — falling back"
  fi
else
  echo "⚠️ AbëVoice not available — using local fallback"
fi

# macOS fallback
if command -v say >/dev/null 2>&1; then
  echo "🔊 Using 'say' fallback for low-latency demo"
  say "$TEXT"
  exit 0
fi

# Generic fallback: print text
echo "--- FALLBACK OUTPUT ---"
echo "$TEXT"

exit 0
