---
title: "Building with Cloudflare D1"
slug: "cloudflare-d1-notes"
publishedAt: "2026-07-19"
excerpt: "What I'm learning wiring D1 into a Next.js portfolio — REST access, optional fallbacks, and keeping server secrets off the client."
tags: ["cloudflare", "nextjs", "d1"]
draft: false
---

This site runs on **Next.js 16** with optional **Cloudflare D1** for structured data: projects, skills, navigation, and TTS voice cache. There is no headless CMS — blog posts like this one live as Markdown in the repo.

## Why D1 for portfolio data

D1 fits small, relational content that changes occasionally but shouldn't require a redeploy:

- Project cards grouped by category
- Nav menu and footer links
- Newsletter subscribers
- Pre-generated AI voice cache URLs

When D1 is not configured, the app degrades gracefully: empty lists, skipped cache lookups, and static pages still work.

## REST from the server

The portfolio talks to D1 through Cloudflare's HTTP API (`src/lib/d1-client.ts`), not a Worker binding. That keeps the Next.js app deployable on Vercel while secrets stay server-only via `config.get()`.

```typescript
// Server-only — never expose D1 tokens to the client
const accountId = config.get("D1_ACCOUNT_ID");
```

## What I'm busy with next

- **Blog section** — file-based posts with a separate TTS voice for reading aloud
- **More Edge-native patterns** — caching, ISR, and tighter Cloudflare integration
- **AI assistant polish** — better fallback knowledge and voice cache coverage

If you're exploring D1 for your own site, start with one table and a single API route. Expand when the SQL workflow feels natural.
