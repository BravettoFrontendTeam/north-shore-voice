#!/bin/bash

# Script to create atomic feature branches from Michael's contributions
# Base: Phani's initial commit
# Creates clean feature branches for each atomic feature

set -e

BASE_BRANCH="main"
BASE_COMMIT="a990c2e950194f7f0fd91a6fbc2d3dd4e0afe1a0"  # Phani's initial commit

# Feature groups - each becomes a branch
declare -A FEATURES=(
  ["feature/code-formatting"]="b04c642a 04505b58"
  ["feature/husky-pre-commit"]="20ee07a4 c517f665 cb8ec406 0d49a156"
  ["feature/vercel-deployment"]="bc9e8084 62d890ae"
  ["feature/security-secrets"]="df3479b4 ef193389"
  ["feature/ci-voice-smoke"]="c7a3d55e d776c143"
  ["feature/demo-scaffold"]="725cd266"
  ["feature/docs-ei-architecture"]="4f7dbdbf"
  ["feature/bugfixes"]="78c15bf0 0ded4cfb"
)

echo "🚀 Creating atomic feature branches from base: $BASE_COMMIT"
echo ""

# Ensure we're on main and up to date
git checkout $BASE_BRANCH
git pull origin $BASE_BRANCH

# Create each feature branch
for feature_name in "${!FEATURES[@]}"; do
  commits="${FEATURES[$feature_name]}"
  
  echo "📦 Creating branch: $feature_name"
  echo "   Commits: $commits"
  
  # Create branch from base
  git checkout -b $feature_name $BASE_COMMIT
  
  # Cherry-pick commits in order
  for commit in $commits; do
    if git cat-file -e "$commit^{commit}" 2>/dev/null; then
      echo "   ✓ Cherry-picking $commit"
      git cherry-pick $commit || {
        echo "   ⚠️  Conflict in $commit - resolving..."
        git cherry-pick --abort
        echo "   ⚠️  Skipping $commit"
      }
    else
      echo "   ⚠️  Commit $commit not found, skipping"
    fi
  done
  
  echo "   ✅ Branch $feature_name created"
  echo ""
done

# Return to main
git checkout $BASE_BRANCH

echo "✨ All feature branches created!"
echo ""
echo "To push all branches:"
echo "  git push origin --all"
echo ""
echo "To push specific branch:"
echo "  git push origin feature/<name>"

