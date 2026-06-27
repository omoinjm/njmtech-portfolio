# NJMTECH Portfolio — Agent Guide

Personal portfolio for Nhlanhla Junior Malaza (NJMTech). Canonical site: https://njmtech.co.za/

## Stack

- **Framework**: Next.js 16 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui (Radix)
- **i18n**: next-intl — locales `en` (default), `zu`
- **Package manager**: pnpm (Node 24.x)
- **Secrets**: Infisical in dev (`pnpm dev`); local fallback via `.env.local` (`pnpm dev:local`)
- **Data**: Cloudflare D1 (optional), services in `src/services/`
- **AI / TTS**: Chat orchestrator, VoxCPM/Edge TTS providers
- **Tests**: Playwright E2E in `src/tests/`

## Project structure

```
src/
├── app/
│   ├── [locale]/          # i18n pages (home, projects, contact, qr)
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
├── services/              # data, AI orchestrator, TTS providers
├── types/                 # Shared TypeScript models
├── i18n/                  # next-intl routing and request config
├── hooks/                 # Client hooks (chat, speech, toast, …)
└── utils/                 # SEO helpers, logger
public/
├── llms.txt               # Public LLM/crawler context
docs/                      # Config, SEO, SQL setup guides
.agents/skills/            # Domain skills (3D web, game UI)
```

## Conventions

- **Imports**: use `@/*` alias → `src/*`
- **Env vars**: use `config.get('VAR')` from `@/lib/config` on the server; never read secrets via `process.env` in new code. Client: `@/lib/config.client` only.
- **New env vars**: add to `.env.example`, `src/lib/config.ts` (and `config.client.ts` if public), update `docs/CONFIG_QUICK_REF.md`
- **UI**: extend shadcn components in `src/components/ui/`; page sections in feature folders (`home/`, `contact/`, …)
- **3D scenes**: `Hero3DScene`, `Skills3DScene`, etc. — see `.agents/skills/3d-web-experience/`
- **Diff scope**: match neighboring file style; minimal focused changes

## Key commands

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install dependencies |
| `pnpm init` | Link Infisical workspace |
| `pnpm dev` | Dev server with Infisical secrets |
| `pnpm dev:local` | Dev server with `.env.local` only |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm test` | Playwright E2E |

## Reference docs

- `docs/CONFIG_QUICK_REF.md` — env/config service
- `docs/CONFIG_SERVICE.md` — full config guide
- `docs/SEO_GUIDE.md` — SEO patterns
- `public/llms.txt` — public site summary for external LLMs

## Do not

- Commit `.env.local`, `.env`, or secrets
- Prefix server-only values (email, D1, API keys) with `NEXT_PUBLIC_`
- Reuse the 3D voxel dog asset (license — see README)
- Run `npm install` / `yarn` — use pnpm
