# Config Service Setup Guide

## Overview

Type-safe configuration via Zod-validated env vars. **Secrets are stored in Infisical**, not in repo `.env` files.

## Infisical setup

```bash
pnpm install
pnpm init          # link Infisical project (once per machine)
pnpm dev           # infisical run --env=dev -- next dev
```

Scripts that need secrets (`ai_cache`, `blog:upload`, `voice-cache:test:d1`) already wrap `infisical run`.

**Production:** mirror Infisical `prod` keys in the Vercel project environment settings.

## Files

```
src/lib/config.ts              # Server config + Zod validation
src/lib/config.client.ts       # NEXT_PUBLIC_* only (browser-safe)
.env.example                   # Variable catalog with priority tags (not for copying)
docs/CONFIG_QUICK_REF.md       # Priority table + quick reference
```

## Quick start

### Server-side

```typescript
import { config } from '@/lib/config'

const siteUrl = config.get('NEXT_PUBLIC_SITE_URL')
const d1AccountId = config.get('D1_ACCOUNT_ID')

if (config.isProduction()) {
  // production logic
}

const url = config.getSiteUrl() // no trailing slash
```

### Client-side

```typescript
'use client'

import { publicConfig } from '@/lib/config.client'

export function Component() {
  return <a href={publicConfig.RESUME_URL}>Download Resume</a>
}
```

## Variable priority (summary)

See [`CONFIG_QUICK_REF.md`](./CONFIG_QUICK_REF.md) for the full table.

| Tier | Examples | If missing |
|------|----------|------------|
| **P0** | `EMAIL_*`, `NEXT_PUBLIC_SITE_URL` | Contact/subscribe broken; SEO defaults |
| **P1** | `D1_*`, `GITHUB_TOKEN`, `HF_TOKEN`, `BLOG_*` | Fallbacks / degraded AI & TTS |
| **P2** | `NEXT_PUBLIC_RESUME_URL`, Mailchimp | Hardcoded defaults in code |
| **P3** | `R2_*`, script/test vars | Scripts fail; app unaffected |

## Validated schema (`config.ts`)

**Public (also in `config.client.ts` where noted):**

- `NEXT_PUBLIC_SITE_URL` — site URL
- `NEXT_PUBLIC_RESUME_URL` — optional resume link

**Server-only:**

- `EMAIL_MAIL`, `EMAIL_USER`, `EMAIL_APP_PASS` — required (P0)
- `D1_ACCOUNT_ID`, `D1_DATABASE_ID`, `D1_API_TOKEN` — optional (P1)
- `BLOG_VOXCPM_REF_AUDIO`, `BLOG_VOXCPM_VOICE_INSTRUCTION`, `BLOG_EDGE_TTS_VOICE` — optional (P1)
- `BLOG_STORAGE_BASE_URL` — optional (P1, default in `blog-storage.ts`)

**Used via `process.env` in routes/scripts (add to Infisical + catalog when extending):**

- `GITHUB_TOKEN` — `/api/chat`
- `HF_TOKEN`, `VOXCPM_*` — `/api/tts`, voice-cache scripts
- `R2_BUCKET_NAME`, `BLOG_STORAGE_PREFIX` — `pnpm blog:upload`

## Add a new variable

1. Create the key in Infisical (`dev` and `prod`).
2. Document in `.env.example` with a priority comment (P0–P3).
3. Add to `envSchema` in `src/lib/config.ts` (if the app reads it at runtime).
4. Export from `config.client.ts` only if it is `NEXT_PUBLIC_*`.
5. Update `docs/CONFIG_QUICK_REF.md`.

## Error handling

```
❌ Invalid environment variables:
EMAIL_MAIL: Invalid email

Verify keys in Infisical (dev) or Vercel (production). See .env.example for the catalog.
```

During production build, missing optional secrets log a warning instead of aborting.

## Best practices

- Use `config.get()` on the server — not raw `process.env`
- Never prefix server secrets with `NEXT_PUBLIC_`
- Never commit `.env`, `.env.local`, or secret values
- Keep `.env.example` as documentation only

## Testing

```bash
pnpm dev                              # Infisical dev env
curl http://localhost:3000/api/config?endpoint=health
pnpm build                            # Vercel injects prod env at build
```

## See also

- [`CONFIG_QUICK_REF.md`](./CONFIG_QUICK_REF.md)
- [`.env.example`](../.env.example) — Infisical variable catalog
- [`AGENTS.md`](../AGENTS.md)
- [Zod Documentation](https://zod.dev/)
