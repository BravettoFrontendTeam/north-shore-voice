#!/usr/bin/env bash
# Lightweight wrapper to run the demo test from anywhere
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo '/Users/michaelmataluni/Desktop/North Shore Phani/north-shore')"
cd "$REPO_ROOT"

# Pass through all args to scripts/run-demo-test.sh
bash "$REPO_ROOT/scripts/run-demo-test.sh" "$@"
