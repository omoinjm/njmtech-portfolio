# Vercel → D1 project sync

Cloudflare Worker cron that syncs all Vercel team projects into the portfolio D1 database (`project` / `project_group` tables). The Next.js app continues to read projects via `/api/projects` — no runtime changes required.

## Architecture

- **Worker:** `workers/vercel-project-sync/` (`njmtech-vercel-project-sync`)
- **Schedule:** every 6 hours (`0 */6 * * *`)
- **Bindings:** D1 (`njmtech-projects`), Workers AI
- **New projects:** auto-categorized into **Website**, **Tools**, or **E-commerce** via Workers AI; `is_code = 0` and empty `code_url` until you set them manually in D1
- **Removed from Vercel:** soft-deleted (`is_active = 0`) for rows with `vercel_project_id`

## Prerequisites

1. Cloudflare account with D1 database `njmtech-projects` (`773865eb-1e3b-4ee3-9592-ffe658765d19`)
2. Vercel API token with access to list team projects
3. Vercel team ID (from team settings or API)
4. Active `project_group` rows named **Website**, **Tools**, **E-commerce**

Verify groups in D1:

```bash
npx wrangler d1 execute njmtech-projects --remote --command \
  "SELECT id, name, code FROM project_group WHERE is_active = 1;"
```

## 1. Run the D1 migration

Adds `vercel_project_id` and `synced_at` to `project`:

```bash
npx wrangler d1 execute njmtech-projects --remote \
  --file=scripts/migrations/add-vercel-sync-columns.sql
```

Re-running `ALTER TABLE` will fail if columns already exist — that is expected after the first apply.

## 2. Install dependencies

From repo root:

```bash
pnpm install
```

## 3. Set Worker secrets

Secrets are **Worker-only** (not Infisical / Next.js `config.ts`):

```bash
wrangler secret put VERCEL_TOKEN --config workers/vercel-project-sync/wrangler.jsonc
wrangler secret put VERCEL_TEAM_ID --config workers/vercel-project-sync/wrangler.jsonc
wrangler secret put SITE_URL --config workers/vercel-project-sync/wrangler.jsonc
# optional — required for manual POST /sync
wrangler secret put CRON_SECRET --config workers/vercel-project-sync/wrangler.jsonc
```

| Secret | Example | Purpose |
|--------|---------|---------|
| `VERCEL_TOKEN` | `vercel_…` | Bearer token for Vercel REST API |
| `VERCEL_TEAM_ID` | `team_…` | Team scope for `GET /v9/projects` |
| `SITE_URL` | `https://njmtech.co.za` | Sets `is_current_domain` when live URL matches |
| `CRON_SECRET` | random string | Protects manual sync endpoint |

Create a Vercel token: [Vercel Account → Tokens](https://vercel.com/account/tokens).

## 4. Deploy

### GitHub Actions (recommended)

Pushes to `main` or `development` that touch `workers/vercel-project-sync/` trigger [`.github/workflows/deploy-vercel-sync-worker.yml`](../.github/workflows/deploy-vercel-sync-worker.yml). The workflow installs deps with pnpm, then runs `pnpm exec wrangler deploy` (uses the repo's Wrangler version — do not pin a separate `wranglerVersion` in the action).

Add these **repository secrets** (Settings → Secrets and variables → Actions):

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with **Workers Scripts Edit** (and D1 read if needed) |
| `CLOUDFLARE_ACCOUNT_ID` | Same value as `D1_ACCOUNT_ID` in Infisical |

Worker runtime secrets (`VERCEL_TOKEN`, `VERCEL_TEAM_ID`, `SITE_URL`, `CRON_SECRET`) are **not** set by CI — configure once with `wrangler secret put` (see step 3). They persist across deploys.

Manual re-deploy from GitHub: **Actions → Deploy Vercel sync worker → Run workflow**.

### Local / CLI

```bash
pnpm worker:sync:deploy
```

Confirm the cron trigger in **Cloudflare Dashboard → Workers → njmtech-vercel-project-sync → Triggers**.

## 5. Manual sync (optional)

After deploy, trigger an immediate run:

```bash
curl -X POST "https://njmtech-vercel-project-sync.<your-subdomain>.workers.dev/sync" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Response:

```json
{
  "ok": true,
  "summary": {
    "fetched": 12,
    "inserted": 3,
    "updated": 9,
    "deactivated": 0,
    "errors": []
  }
}
```

## 6. Local development

```bash
pnpm worker:sync:dev
```

Then open `http://localhost:8787/__scheduled` to fire the cron handler, or:

```bash
curl -X POST http://localhost:8787/sync -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Use `wrangler dev --remote` if you need live D1 + Workers AI bindings during local testing.

## Field behaviour

| Field | Sync behaviour |
|-------|----------------|
| `title`, `live_url`, `stack_json`, `is_current_domain` | Updated every run |
| `project_group_id` | Set on **insert only** (AI); manual D1 edits preserved |
| `description` | AI-generated on **insert only** |
| `img_url` | Empty on insert; never overwritten by sync |
| `is_code`, `code_url` | `0` / empty on insert; never overwritten once you set them |
| `is_active` | `1` when on Vercel; `0` when removed (sync-managed rows only) |

Manually added projects (no `vercel_project_id`) are never soft-deleted by the worker.

## Verify synced rows

```bash
npx wrangler d1 execute njmtech-projects --remote --command \
  "SELECT id, title, vercel_project_id, project_group_id, is_code, is_active FROM project ORDER BY id DESC LIMIT 20;"
```

The portfolio `/projects` page uses a 1-hour cache on `/api/projects`. New rows may take up to an hour to appear unless you redeploy or add cache revalidation later.

## Troubleshooting

| Issue | Check |
|-------|-------|
| `No Website project_group row found` | Ensure D1 has an active group named Website (code `WEB`) |
| Vercel API 403 | Token scope / team ID |
| AI categorization always Website | Workers AI binding enabled; check `wrangler tail` logs |
| Project missing on site but in D1 | `is_active = 1` and `/api/projects` cache (wait or redeploy) |

Logs:

```bash
wrangler tail njmtech-vercel-project-sync
```

## See also

- [`CONFIG_QUICK_REF.md`](./CONFIG_QUICK_REF.md) — env catalog (P3 Worker vars)
- [`sql-setup.md`](./sql-setup.md) — original project schema
- Worker source: [`workers/vercel-project-sync/`](../workers/vercel-project-sync/)
