# Copilot Instructions

Use **`AGENTS.md`** at the repo root as the single source of truth for architecture, commands, conventions, and file layout.

Quick commands:

```bash
pnpm init          # Link Infisical (once)
pnpm dev           # Dev server with Infisical secrets
pnpm build         # Production build
pnpm lint          # ESLint
pnpm test          # Playwright E2E
```

Secrets live in **Infisical**, not `.env` files. See `docs/CONFIG_QUICK_REF.md` for variable priorities.

Pre-commit hooks (Husky + lint-staged) run `next lint --fix` on staged `.ts`/`.tsx` files.
