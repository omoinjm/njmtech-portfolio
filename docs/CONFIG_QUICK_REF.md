# Config Service - Quick Reference

## Secrets source

All environment variables are managed in **Infisical** (not `.env` files).

| Context | How vars are loaded |
|---------|---------------------|
| Local dev | `pnpm init` (once) → `pnpm dev` (`infisical run --env=dev`) |
| Scripts | `pnpm ai_cache`, `pnpm blog:upload`, etc. wrap `infisical run` |
| Production | Vercel project env (mirror Infisical `prod` keys) |

`.env.example` is a **catalog** of variable names and priorities — do not copy it to `.env.local`.

## Variable priority

### P0 — Required

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical URL (SEO, sitemap, OG) |
| `EMAIL_MAIL` | Server | Inbox that receives contact submissions |
| `EMAIL_USER` | Server | SMTP sender address |
| `EMAIL_APP_PASS` | Server | SMTP app password |

Without P0 email vars the contact form and subscribe flow fail at runtime.

### P1 — Core production features

| Variable | Scope | Purpose |
|----------|-------|---------|
| `D1_ACCOUNT_ID` | Server | Cloudflare account for D1 REST |
| `D1_DATABASE_ID` | Server | D1 database (`njmtech-projects`) |
| `D1_API_TOKEN` | Server | API token with D1 read/write |
| `GITHUB_TOKEN` | Server | GitHub Models for Omoi chat (rule fallback if missing) |
| `HF_TOKEN` | Server | VoxCPM TTS auth / rate limits |
| `VOXCPM_REF_AUDIO` | Server | Omoi voice clone reference (optional if instruction set) |
| `VOXCPM_VOICE_INSTRUCTION` | Server | Omoi voice description when no ref audio |
| `BLOG_STORAGE_BASE_URL` | Server | R2 public URL for blog Markdown |
| `BLOG_VOXCPM_*` / `BLOG_EDGE_TTS_VOICE` | Server | Blog article narration voice profile |

Without D1, projects/skills load from fallbacks and Omoi TTS uses the in-code manifest. Without `GITHUB_TOKEN`, Omoi uses rule-based replies only.

### P2 — Optional (defaults exist)

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_RESUME_URL` | Public | CV download link |
| `NEXT_PUBLIC_MAILCHIMP_URL` | Public | Newsletter embed |
| `NEXT_PUBLIC_WS_CHAT_URL` | Public | Optional WebSocket chat endpoint |

### P3 — Scripts & tests only

| Variable | Used by |
|----------|---------|
| `R2_BUCKET_NAME`, `BLOG_STORAGE_PREFIX` | `pnpm blog:upload` |
| `VOICE_CACHE_S3_BASE_URL` | `pnpm ai_cache` |
| `TEST_EMAIL`, `BASE_URL`, `TEMPLATE_API_URL` | Playwright email tests |
| `VERCEL_TOKEN`, `VERCEL_TEAM_ID`, `SITE_URL`, `CRON_SECRET` | Cloudflare Worker `njmtech-vercel-project-sync` (wrangler secrets) |
| `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions deploy for `njmtech-vercel-project-sync` (repo secrets) |

Worker deploy: `pnpm worker:sync:deploy` · CI: `.github/workflows/deploy-vercel-sync-worker.yml` · see [`VERCEL_PROJECT_SYNC.md`](./VERCEL_PROJECT_SYNC.md).

## Import & use

### Server-side

```typescript
import { config } from '@/lib/config'

config.get('D1_ACCOUNT_ID')
config.get('NEXT_PUBLIC_SITE_URL')
config.isProduction()
config.getSiteUrl()
config.getAll()
```

### Client-side

```typescript
import { publicConfig } from '@/lib/config.client'

publicConfig.SITE_URL
publicConfig.RESUME_URL
```

## Add a new variable

1. Add the key to Infisical (`dev` + `prod`) and document it in `.env.example` with a priority tag.
2. Update `src/lib/config.ts` schema (and `config.client.ts` if `NEXT_PUBLIC_*`).
3. Use `config.get('VAR')` on the server — not raw `process.env`.

## Error handling

If validation fails on startup:

```
❌ Invalid environment variables:
EMAIL_MAIL: Invalid email

Verify keys in Infisical (dev) or Vercel (production). See .env.example for the catalog.
```

Build-time (`NEXT_PHASE=phase-production-build`) logs a warning instead of throwing so CI/Vercel builds can complete with partial env.

## Debugging

```typescript
console.log(config.getAll())
console.log('Environment:', config.isDevelopment() ? 'dev' : 'prod')
```

Health check: `GET /api/config?endpoint=health`

## See also

- [`CONFIG_SERVICE.md`](./CONFIG_SERVICE.md) — Infisical setup and full guide
- [`AGENTS.md`](../AGENTS.md) — agent conventions
- [Zod Docs](https://zod.dev) — validation library
