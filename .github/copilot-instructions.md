# Copilot Instructions

Use **`AGENTS.md`** at the repo root as the single source of truth for architecture, commands, conventions, and file layout.

Quick commands:

```bash
pnpm dev          # Dev server with Infisical
pnpm dev:local    # Dev server with .env.local
pnpm build        # Production build
pnpm lint         # ESLint
pnpm test         # Playwright E2E
```

Pre-commit hooks (Husky + lint-staged) run `next lint --fix` on staged `.ts`/`.tsx` files.
