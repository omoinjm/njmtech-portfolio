#!/usr/bin/env bash
set -euo pipefail

corepack enable
corepack prepare pnpm@9.15.1 --activate

pnpm install

echo "Secrets are in Infisical — run 'pnpm init' once, then 'pnpm dev'."

if [ -n "${GIT_USER_EMAIL:-}" ] && [ -n "${GIT_USER_NAME:-}" ]; then
  git config --global user.email "$GIT_USER_EMAIL"
  git config --global user.name "$GIT_USER_NAME"
fi
