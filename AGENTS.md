# NJMTECH Portfolio — Agent Guide

Personal portfolio for Nhlanhla Junior Malaza (NJMTech). Canonical site: https://njmtech.co.za/

## Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui (Radix), Framer Motion
- **i18n**: next-intl — locales `en` (default), `zu`
- **Package manager**: pnpm (Node 24.x)
- **Secrets**: Infisical (`pnpm dev`, script wrappers) — not `.env` files
- **Data**: Cloudflare D1 (optional), services in `src/services/`
- **AI / TTS**: Chat orchestrator, VoxCPM/Edge TTS providers
- **Tests**: Playwright E2E in `src/tests/`

## Project structure

```
src/
├── app/
│   ├── [locale]/          # i18n pages (home, projects, contact, qr, blog)
│   └── api/               # Route handlers (contact, chat, tts, projects, skills, …)
├── components/
│   ├── ui/                # shadcn/ui primitives
│   ├── layout/            # Navbar, Footer, FloatingAssistant, theme
│   ├── home/              # Hero, Skills, Services, 3D scenes
│   ├── contact/           # Contact page sections
│   └── projects/          # Projects page sections
├── lib/
│   ├── config.ts          # Server env (Zod-validated)
│   ├── config.client.ts   # Public env only
│   ├── ai-config.ts       # Chat system prompts / fallback knowledge
│   └── d1-client.ts       # Cloudflare D1 REST client
├── services/              # data, AI orchestrator, TTS, sql.service
├── types/                 # Shared TypeScript models
├── i18n/                  # next-intl routing and request config
├── hooks/                 # Client hooks (chat, speech, toast, …)
└── utils/                 # SEO helpers, logger
public/
├── llms.txt               # Public LLM/crawler context
docs/                      # Config, SEO, SQL setup guides
.agents/skills/            # Domain skills (3D web, game UI)
```

## Architecture

### Configuration

Environment variables are in **Infisical** (local/scripts) and **Vercel** (production). Validated in `src/lib/config.ts`. **Always** use `config.get('VAR')` on the server — not raw `process.env`. Client code uses `@/lib/config.client` for `NEXT_PUBLIC_*` only.

**Priority:** P0 `EMAIL_*` + site URL → P1 D1/AI/TTS/blog → P2 public extras → P3 scripts. See `docs/CONFIG_QUICK_REF.md`.

### Data management

- **`src/services/data.service.ts`**: Client-side API wrapper (`get_call`, `post_call`).
- **`src/services/sql.service.ts`**: Server-side Cloudflare D1 access and row mapping.
- **API routes**: `src/app/api/` — contact, chat, projects, skills, menu, subscribe, config, tts.

### UI

- **shadcn/ui** primitives in `src/components/ui/`.
- **Layout shell**: `src/components/layout/Layout.tsx` wrapped by `Providers` in `src/app/providers.tsx`.
- **3D scenes**: `src/components/home/` — see `.agents/skills/3d-web-experience/`.

## Conventions

- **Imports**: use `@/*` alias → `src/*`
- **New env vars**: add to Infisical + `.env.example` (catalog), `src/lib/config.ts` (and `config.client.ts` if public), update `docs/CONFIG_QUICK_REF.md`
- **UI**: extend shadcn components in `src/components/ui/`; page sections in feature folders (`home/`, `contact/`, …)
- **Logging**: use `src/utils/logger.ts` instead of `console.log`
- **Diff scope**: match neighboring file style; minimal focused changes

## Key commands

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install dependencies |
| `pnpm init` | Link Infisical workspace |
| `pnpm dev` | Dev server with Infisical secrets |
| `pnpm build` | Production build |
| `pnpm start:local` | Production server (env must be injected) |
| `pnpm lint` | ESLint |
| `pnpm test` | Playwright E2E |
| `pnpm ai_cache` | Generate TTS voice cache (Infisical) |
| `pnpm blog:upload` | Upload blog seed to R2 (Infisical) |

## Reference docs

- `docs/CONFIG_QUICK_REF.md` — env priority + quick reference
- `docs/CONFIG_SERVICE.md` — Infisical + config setup
- `docs/SEO_GUIDE.md` — SEO patterns
- `public/llms.txt` — public site summary for external LLMs

## Do not

- Commit secrets, `.env`, or `.env.local`
- Copy `.env.example` into a local env file — use Infisical
- Prefix server-only values (email, D1, API keys) with `NEXT_PUBLIC_`
- Reuse the 3D voxel dog asset (license — see README)
- Run `npm install` / `yarn` — use pnpm
