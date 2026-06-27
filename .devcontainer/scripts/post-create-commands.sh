#!/usr/bin/env bash
set -euo pipefail

corepack enable
corepack prepare pnpm@9.15.1 --activate

if [ -f .env.example ] && [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example — update values before deploying."
fi

pnpm install

if [ -n "${GIT_USER_EMAIL:-}" ] && [ -n "${GIT_USER_NAME:-}" ]; then
  git config --global user.email "$GIT_USER_EMAIL"
  git config --global user.name "$GIT_USER_NAME"
fi
