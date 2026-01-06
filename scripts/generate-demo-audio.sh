#!/usr/bin/env bash
set -euo pipefail

# generate-demo-audio.sh
# Usage: ./scripts/generate-demo-audio.sh <scenario> "Text to speak"
# Scenarios: frustration, assurance

SCENARIO="${1:-assurance}"
TEXT="${2:-"You're in good hands. We'll make sure everything's set and secure."}"
OUT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd demo-audio && pwd)"
OUT_FILE="$OUT_DIR/${SCENARIO}.wav"
BASEURL="${ABEVOICE_API_URL:-http://localhost:8000}"
APIKEY="${ABEVOICE_API_KEY:-}"

mkdir -p "$OUT_DIR"

echo "🔊 Generating demo audio for scenario: $SCENARIO"

echo "Text: $TEXT"

# Prefer AbëVoice API if available
if curl --silent --show-error --fail "$BASEURL/api/status" >/dev/null 2>&1; then
  echo "✅ AbëVoice online — requesting TTS"
  RESP=$(curl -s -X POST "$BASEURL/api/v1/text-to-speech" \
    -H "Content-Type: application/json" \
    ${APIKEY:+-H "Authorization: Bearer $APIKEY"} \
    -d "{\"text\": \"$TEXT\", \"voice_id\": \"abe\", \"metadata\": {\"emotion\": \"$SCENARIO\", \"intensity\": 5}}")

  AUDIO_BASE64=$(echo "$RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('audio_base64',''))")
  if [ -n "$AUDIO_BASE64" ]; then
    echo "✅ Received audio — saving to $OUT_FILE"
    echo "$AUDIO_BASE64" | base64 --decode > "$OUT_FILE"
    exit 0
  else
    echo "⚠️ AbëVoice did not return audio — falling back to local TTS"
  fi
fi

# macOS say fallback (preferred on macOS)
if command -v say >/dev/null 2>&1; then
  echo "🔧 Using macOS 'say' to generate audio"
  TMP_AIFF="$OUT_DIR/${SCENARIO}.aiff"
  say -o "$TMP_AIFF" --data-format=LEF32@22050 "$TEXT"
  if command -v afconvert >/dev/null 2>&1; then
    afconvert -f WAVE -d LEI16@22050 "$TMP_AIFF" "$OUT_FILE"
    rm -f "$TMP_AIFF"
    echo "✅ Saved $OUT_FILE"
    exit 0
  else
    mv "$TMP_AIFF" "$OUT_FILE"
    echo "⚠️ afconvert not available; saved AIFF as $OUT_FILE (may not be WAV)"
    exit 0
  fi
fi

# espeak fallback (Linux)
if command -v espeak >/dev/null 2>&1; then
  echo "🔧 Using espeak to generate audio"
  espeak -w "$OUT_FILE" "$TEXT"
  echo "✅ Saved $OUT_FILE"
  exit 0
fi

# As last resort, create an empty WAV header file (placeholder)
python3 - <<'PY'
import wave
wf = wave.open("$OUT_FILE".replace('$OUT_FILE', "$OUT_FILE"), 'wb')
wf.setnchannels(1)
wf.setsampwidth(2)
wf.setframerate(8000)
wf.writeframes(b'')
wf.close()
print('⚠️ No TTS available; wrote empty WAV placeholder to %s' % "$OUT_FILE")
PY

exit 0
