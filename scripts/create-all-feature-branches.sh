#!/bin/bash

# Complete script to create all atomic feature branches
# Handles uncommitted changes and creates clean branches

set -e

BASE_COMMIT="a990c2e950194f7f0fd91a6fbc2d3dd4e0afe1a0"
ORIGINAL_BRANCH=$(git branch --show-current)

echo "🚀 Creating atomic feature branches from Michael's contributions"
echo "Base commit: $BASE_COMMIT"
echo ""

# Stash changes
if ! git diff-index --quiet HEAD --; then
  echo "📦 Stashing uncommitted changes..."
  git stash push -m "Auto-stash before creating feature branches $(date +%s)"
  STASHED=true
else
  STASHED=false
fi

# Function to create branch
create_feature() {
  local name=$1
  shift
  local commits=("$@")
  
  echo "📦 Creating: $name"
  
  # Delete if exists
  git branch -D "$name" 2>/dev/null || true
  
  # Create from base
  git checkout -b "$name" "$BASE_COMMIT" 2>&1 | grep -v "Switched\|HEAD" || true
  
  # Cherry-pick
  local success=0
  for commit in "${commits[@]}"; do
    if git show "$commit" >/dev/null 2>&1; then
      if git cherry-pick "$commit" >/dev/null 2>&1; then
        success=$((success + 1))
        echo "   ✓ $(git log -1 --oneline $commit | cut -d' ' -f2-)"
      else
        echo "   ✗ $commit (conflict)"
        git cherry-pick --abort >/dev/null 2>&1
      fi
    fi
  done
  
  echo "   ✅ $success/${#commits[@]} commits"
  echo ""
}

# Create all features
create_feature "feature/code-formatting" "b04c642a" "04505b58"
create_feature "feature/husky-pre-commit" "20ee07a4" "c517f665" "cb8ec406" "0d49a156"
create_feature "feature/vercel-deployment" "bc9e8084" "62d890ae"
create_feature "feature/security-secrets" "df3479b4" "ef193389"
create_feature "feature/bugfixes" "0ded4cfb" "78c15bf0"
create_feature "feature/docs-ei-architecture" "4f7dbdbf"

# Note: launch-preparation has conflicts, handle separately
echo "⚠️  feature/launch-preparation skipped (large commit with dependencies)"
echo "   Consider: git checkout -b feature/launch-preparation $BASE_COMMIT"
echo "   Then: git cherry-pick c1af17ce (resolve conflicts manually)"
echo ""

# Return to original
git checkout "$ORIGINAL_BRANCH" 2>&1 | grep -v "Switched\|HEAD" || true

# Restore stash
if [ "$STASHED" = true ]; then
  echo "📦 Restoring stashed changes..."
  git stash pop >/dev/null 2>&1 || echo "   ⚠️  Stash conflicts, resolve manually"
fi

echo "✨ Feature branches created!"
echo ""
echo "📋 Branches:"
git branch | grep "feature/" | sed 's/^/   /'
echo ""
echo "🚀 Push all: git push origin --all"
echo "📝 Or use: ./scripts/push-all-features.sh"

