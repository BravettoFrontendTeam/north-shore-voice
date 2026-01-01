#!/usr/bin/env bash
# Vercel Build Check Script
# Returns 0 to build, 1 to skip build

set -euo pipefail

# Get the commit range (what changed)
if [ -n "${VERCEL_GIT_COMMIT_REF:-}" ]; then
  # Vercel provides this
  COMMIT_RANGE="${VERCEL_GIT_COMMIT_REF}"
else
  # Fallback: compare with previous commit
  COMMIT_RANGE="HEAD~1..HEAD"
fi

# Check if frontend or backend changed
FRONTEND_CHANGED=$(git diff --name-only "$COMMIT_RANGE" | grep -E "^frontend/" | wc -l)
BACKEND_CHANGED=$(git diff --name-only "$COMMIT_RANGE" | grep -E "^backend/" | wc -l)

# Also check if vercel.json or package files changed (affect build)
CONFIG_CHANGED=$(git diff --name-only "$COMMIT_RANGE" | grep -E "(vercel\.json|package\.json|package-lock\.json)" | wc -l)

# Build if:
# - Frontend changed
# - Backend changed  
# - Config files changed
# - Force build (if VERCEL_FORCE_BUILD is set)

if [ "$FRONTEND_CHANGED" -gt 0 ] || [ "$BACKEND_CHANGED" -gt 0 ] || [ "$CONFIG_CHANGED" -gt 0 ] || [ -n "${VERCEL_FORCE_BUILD:-}" ]; then
  echo "✅ Building: Changes detected in frontend, backend, or config"
  exit 0  # Build
else
  echo "⏭️  Skipping build: No relevant changes"
  exit 1  # Skip build
fi

