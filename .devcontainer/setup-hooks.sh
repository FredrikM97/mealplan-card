#!/usr/bin/env bash
set -euo pipefail

if [[ ! -d .git ]]; then
  echo "Skipping hook install: no .git directory found"
  exit 0
fi

mkdir -p .git/hooks
cp .devcontainer/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Force this repository to use its .git/hooks directory, even if global config overrides hooksPath.
git config --local core.hooksPath .git/hooks

echo "Installed pre-commit hook and set core.hooksPath=.git/hooks"
