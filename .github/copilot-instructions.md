# Copilot Instructions

## Commands

```bash
pnpm dev          # Start dev server with Turbo (port 3000)
pnpm build        # Production build
pnpm lint         # ESLint check
pnpm lint:fix     # ESLint auto-fix

# E2E Tests (Playwright)
npx playwright test                  # Run all tests (Chromium, Firefox, WebKit)
npx playwright test [file]           # Run a single test file
npx playwright test --headed         # Run with browser UI
npx playwright show-report           # Open HTML test report
```

> Pre-commit hooks (Husky + lint-staged) automatically run `next lint --fix` on staged `.ts`/`.tsx` files.

---

## Architecture

Next.js 15 **App Router** portfolio with a Neon (serverless PostgreSQL) backend. All pages live under `src/app/`, all reusable logic lives outside it.

```
src/
├── app/
│   ├── api/            # Route handlers (contact, projects, skills, menu, subscribe, config)
│   ├── contact/        # Contact page + loading skeleton
│   ├── projects/       # Projects page + loading skeleton
│   ├── layout.tsx      # Root layout — wraps everything in <Providers>
│   └── providers.tsx   # Client-side: React Query + next-themes (dark mode)
├── components/
│   ├── ui/             # shadcn/ui primitives — DO NOT edit manually, regenerate via CLI
│   ├── home/           # Page sections: Hero, Skills, Services, Newsletter
│   ├── projects/       # Projects section
│   ├── contact/        # Contact form section
│   └── layout/         # Layout, Navbar, Footer
├── services/
│   ├── data.service.ts # Central HTTP client (get_call / post_call)
│   └── sql.service.ts  # Raw SQL queries via Neon
├── hooks/
│   └── useDataService.ts  # Generic data-fetching hook wrapping data.service.ts
├── lib/
│   ├── config.ts       # Zod-validated env vars — access config via this, not process.env directly
│   ├── neon-client.ts  # PostgreSQL connection
│   └── utils.ts        # cn() helper (clsx + tailwind-merge)
├── types/              # TypeScript models (snake_case filenames, PascalCase types)
└── utils/
    ├── logger.ts       # Logging utility (debug/info suppressed in production)
    └── seo.ts          # SEO helpers and structured data
```

### Data flow

Client components call the `useDataService` hook → `DataService.get_call()` → `/api/*` route handler → `sql.service.ts` → Neon PostgreSQL.

API routes serving read data use `unstable_cache` with 1-hour revalidation and named cache tags (e.g., `["projects-links-next-js"]`).

---

## Key Conventions

### Components
- Page-level section components are co-located under `src/components/<page>/` and aggregated in `Index.tsx` (e.g., `src/components/home/Index.tsx` renders Hero + Skills + Services).
- All interactive components require `"use client"` at the top.
- Component files use **PascalCase** (`Hero.tsx`); folders and utility files use **kebab-case** or **camelCase**.

### Styling
- Use `cn()` from `src/lib/utils.ts` (wraps `clsx` + `tailwind-merge`) for all conditional class composition.
- Global custom utilities (`.gradient-text`, `.gradient-bg`, `.glass-input`) are defined in `src/index.css` using `@apply`.
- Dark mode is class-based (`darkMode: ["class"]`); theme defaults to dark via `next-themes`.
- **Never use `display:flex` or `display:inline-flex` in email HTML** — Gmail strips these. Use `display:block` with `margin:0 auto` for centering.

### Animations
- Use **Framer Motion** for component animations (entrance, stagger, scroll-triggered via `useInView`).
- Use Tailwind's `animate-*` utilities for simple CSS-only animations.

### Environment / Config
- Access environment variables through the `config` singleton from `src/lib/config.ts`, not `process.env` directly. It validates all vars at startup via Zod.
- Client-safe config is exposed separately via `src/lib/config.client.ts`.
- Required env vars: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_EMAIL_MAIL`, `NEXT_PUBLIC_EMAIL_USER`, `NEXT_PUBLIC_EMAIL_APP_PASS`, `NEXT_PUBLIC_MAILCHIMP_URL`. Database vars (`POSTGRES_URL`, etc.) are optional for email-only operation.

### API Routes
- Validate request bodies with a **type guard** function before processing (see `validateContactForm` in `src/app/api/contact/route.ts` as the reference pattern).
- Use `logger` from `src/utils/logger.ts` for logging — `debug`/`info` are suppressed in production; `warn`/`error` always log.
- CORS is locked to `NEXT_PUBLIC_SITE_URL` (configured in `next.config.js`). Do not use wildcard origins.

### Forms
- Use **React Hook Form** for all forms. Pair with Zod schemas for validation.
- Toast notifications via **Sonner** (`src/components/ui/sonner.tsx`) for user feedback.

### Types
- Type files use `snake_case` filenames (`project_model.ts`) and export `PascalCase` types.
- All types are re-exported from `src/types/index.ts`.

### Shadcn/ui
- Add new shadcn/ui components with the CLI (`npx shadcn@latest add <component>`), not by creating files manually in `src/components/ui/`.

### Images
- Remote images must come from `res.cloudinary.com` (configured in `next.config.js`). Add other domains to `remotePatterns` before using them.
