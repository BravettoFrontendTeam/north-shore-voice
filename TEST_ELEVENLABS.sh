#!/usr/bin/env bash
# Test ElevenLabs integration - waits for backend to be ready

echo "🧪 Testing ElevenLabs Integration"
echo ""

echo "Waiting for backend to be ready..."
for i in {1..30}; do
  if curl -sf http://127.0.0.1:5050/api/status > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  echo "  Waiting... ($i/30)"
  sleep 1
  if [ $i -eq 30 ]; then
    echo "❌ Backend never became ready"
    echo ""
    echo "Last 50 lines of backend log:"
    tail -n 50 /tmp/northshore-backend.log
    exit 1
  fi
done

echo ""
echo "1️⃣ Testing voice generation endpoint..."
RESULT=$(curl -s -X POST "http://127.0.0.1:5050/api/voice/generate" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, this is a test of ElevenLabs voice","voice":"abe","provider":"elevenlabs"}')

echo "Result:"
echo "$RESULT" | jq '.'
echo ""

SUCCESS=$(echo "$RESULT" | jq -r '.success')
if [ "$SUCCESS" = "true" ]; then
  echo "✅ ElevenLabs is WORKING!"
  echo ""
  echo "Audio base64 preview:"
  echo "$RESULT" | jq -r '.audio_base64' | head -c 100
  echo "..."
else
  echo "❌ ElevenLabs FAILED"
  echo ""
  echo "Error:"
  echo "$RESULT" | jq -r '.error'
  echo ""
  echo "Backend logs (last 30 lines):"
  tail -n 30 /tmp/northshore-backend.log
fi
