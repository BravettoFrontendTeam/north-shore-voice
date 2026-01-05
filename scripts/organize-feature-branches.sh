#!/bin/bash

# Organize Michael's contributions into atomic feature branches
# Each branch represents one logical feature/improvement

set -e

BASE_COMMIT="a990c2e950194f7f0fd91a6fbc2d3dd4e0afe1a0"  # Phani's initial commit
CURRENT_BRANCH=$(git branch --show-current)

echo "🔍 Analyzing commits and creating feature branches..."
echo "Base commit: $BASE_COMMIT"
echo ""

# Function to create a feature branch
create_feature_branch() {
  local branch_name=$1
  shift
  local commits=("$@")
  
  echo "📦 Creating: $branch_name"
  
  # Check if branch already exists
  if git show-ref --verify --quiet refs/heads/"$branch_name"; then
    echo "   ⚠️  Branch $branch_name already exists, skipping..."
    return
  fi
  
  # Create branch from base
  git checkout -b "$branch_name" "$BASE_COMMIT" > /dev/null 2>&1
  
  local success_count=0
  local fail_count=0
  
  # Cherry-pick commits in order
  for commit in "${commits[@]}"; do
    if git cat-file -e "$commit^{commit}" 2>/dev/null; then
      if git cherry-pick "$commit" > /dev/null 2>&1; then
        success_count=$((success_count + 1))
        echo "   ✓ $commit"
      else
        fail_count=$((fail_count + 1))
        echo "   ✗ $commit (conflict - aborting)"
        git cherry-pick --abort > /dev/null 2>&1
      fi
    else
      echo "   ⚠️  $commit (not found)"
    fi
  done
  
  echo "   ✅ Created with $success_count/$((success_count + fail_count)) commits"
  echo ""
}

# Create feature branches
create_feature_branch "feature/code-formatting" "b04c642a" "04505b58"
create_feature_branch "feature/husky-pre-commit" "20ee07a4" "c517f665" "cb8ec406" "0d49a156"
create_feature_branch "feature/launch-preparation" "c1af17ce"
create_feature_branch "feature/vercel-deployment" "bc9e8084" "62d890ae"
create_feature_branch "feature/security-secrets" "df3479b4" "ef193389"
create_feature_branch "feature/ci-voice-smoke" "c7a3d55e" "d776c143"
create_feature_branch "feature/bugfixes" "0ded4cfb" "78c15bf0"
create_feature_branch "feature/docs-ei-architecture" "4f7dbdbf"

# Return to original branch
git checkout "$CURRENT_BRANCH" > /dev/null 2>&1

echo "✨ Feature branches created!"
echo ""
echo "📋 Summary:"
git branch | grep "feature/" | sed 's/^/   /'
echo ""
echo "🚀 To push all branches:"
echo "   git push origin --all"
echo ""
echo "📝 To push specific branch:"
echo "   git push origin feature/<name>"
echo ""
echo "🔍 To review a branch:"
echo "   git checkout feature/<name>"
echo "   git log --oneline $BASE_COMMIT..HEAD"
