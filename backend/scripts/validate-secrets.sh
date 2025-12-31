#!/usr/bin/env bash
set -euo pipefail

# Load local .env if present (support both backend/ and repo root .env)
if [ -f "$(pwd)/.env" ]; then
  set -o allexport
  source "$(pwd)/.env"
  set +o allexport
fi
if [ -f "$(dirname "$0")/../.env" ]; then
  set -o allexport
  source "$(dirname "$0")/../.env"
  set +o allexport
fi

# Minimal, conservative validator: only critical secrets make this fail.
# ABEVOICE_API_KEY is optional for local dev (YAGNI approach).

required=(
  "JWT_SECRET"
  "TWILIO_ACCOUNT_SID"
  "TWILIO_AUTH_TOKEN"
)
optional=(
  "ABEVOICE_API_KEY"
  "ELEVENLABS_API_KEY"
)

missing=()
for v in "${required[@]}"; do
  if [ -z "${!v:-}" ]; then
    echo "$v: MISSING"
    missing+=("$v")
  else
    echo "$v: present"
  fi
done

for v in "${optional[@]}"; do
  if [ -z "${!v:-}" ]; then
    echo "$v: MISSING (optional)"
  else
    echo "$v: present (optional)"
  fi
done

if [ ${#missing[@]} -gt 0 ]; then
  echo "One or more critical secrets missing: ${missing[*]}"
  exit 1
else
  echo "All critical secrets present"
  exit 0
fi
