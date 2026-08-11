# Project hero screenshots (GitHub Actions)

Portfolio project cards on `/work` use `project.img_url` — hero screenshots captured by **Playwright on GitHub Actions**, uploaded to **Cloudflare R2**, and linked in **D1**.

Vercel does not expose deployment thumbnails via a public API, so this pipeline is the supported approach.

## Architecture

```text
Cloudflare Worker (Vercel → D1 sync, every 6h)
        ↓ new rows with empty img_url
GitHub Actions (Playwright cron, 15 min later)
        ↓
  live_url → Chromium screenshot → WebP → R2 → D1 img_url
```

| Component | Location |
|-----------|----------|
| Workflow | [`.github/workflows/project-sync-screenshots-cron.yml`](../.github/workflows/project-sync-screenshots-cron.yml) |
| Script | [`scripts/capture-project-screenshots.ts`](../scripts/capture-project-screenshots.ts) |
| Schedule | `15 */6 * * *` (UTC) |
| R2 path | `njmtech-portfolio/projects/{id}.webp` |
| Public URL | `https://s3.njmtech.co.za/njmtech-portfolio/projects/{id}.webp` |

## One-time setup

### 1. D1 migration (retry tracking)

```bash
npx wrangler d1 execute njmtech-projects --remote \
  --file=scripts/migrations/add-screenshot-attempted-at.sql
```

### 2. GitHub repository secrets

Settings → Secrets and variables → Actions:

| Secret | Required | Purpose |
|--------|----------|---------|
| `CLOUDFLARE_API_TOKEN` | Yes | D1 REST queries + `wrangler r2 object put` |
| `CLOUDFLARE_ACCOUNT_ID` | Yes | Cloudflare account ID |
| `WORKER_SYNC_URL` | No | e.g. `https://njmtech-vercel-project-sync.njmalaza.workers.dev` — runs sync before capture |
| `CRON_SECRET` | No | Bearer token for `POST /sync` (pair with `WORKER_SYNC_URL`) |

The token needs **D1 read/write** and **R2 object write** on bucket `njmtech-blob`.

### 3. Enable the workflow

Push to `main` (workflow file must be on the default branch for the schedule to run).

## Manual runs

**GitHub UI:** Actions → **Project sync screenshots** → **Run workflow**

| Input | Effect |
|-------|--------|
| `force=false` | Only active projects with empty `img_url` (24h retry cooldown on failures) |
| `force=true` | Re-capture all active projects |
| `project_id=12` | Single D1 row only |

**Local (Infisical):**

```bash
pnpm project:screenshots
pnpm project:screenshots -- --force
pnpm project:screenshots -- --id=12
pnpm project:screenshots -- --dry-run
```

Local runs need the same D1/R2 env vars as in [`.env.example`](../.env.example) (`D1_*`, `R2_BUCKET_NAME`, `PROJECT_SCREENSHOT_*`).

## Capture behaviour

- Viewport **1280×720**, hero detected via common selectors (`#hero`, first main section, etc.)
- PNG → **WebP** (quality 82) via `sharp`
- Skips rows where `img_url` is already set (unless `--force`)
- On failure, sets `screenshot_attempted_at` — retries after **24 hours**
- Vercel sync worker **never** overwrites `img_url` after insert

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| No images on `/work` | Check Actions run logs; confirm `img_url` in D1 |
| Same project every run | Capture failing — check timeout/auth on `live_url`; use `--id=N` to debug |
| `screenshot_attempted_at` errors | Run migration above |
| R2 upload 403 | Token missing R2 write on `njmtech-blob` |
| Empty queue | All projects already have `img_url`; use **force=true** to refresh |

See also [VERCEL_PROJECT_SYNC.md](./VERCEL_PROJECT_SYNC.md) for the Vercel → D1 worker.
