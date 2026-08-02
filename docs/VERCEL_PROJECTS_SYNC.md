# Vercel → D1 projects sync

Cloudflare Worker that keeps the portfolio `project` table in sync with apps hosted on Vercel.

- **Worker**: [`workers/vercel-projects-sync/`](../workers/vercel-projects-sync/)
- **Migration**: [`scripts/migrate-vercel-projects-sync.sql`](../scripts/migrate-vercel-projects-sync.sql)
- **Schedule**: hourly cron (`0 * * * *`)
- **Categories**: Website (`WEB`), Tools (`TOOL`), E-commerce (`ECOM`)

## What it does

1. Lists **all** projects on the Vercel account/team.
2. Upserts each into D1 with `source = 'vercel'` keyed by `vercel_project_id`.
3. Maps new apps into Website / Tools / E-commerce (see categorization below).
4. Soft-deletes synced rows (`is_active = 0`) when the Vercel project is gone.
5. Leaves hand-curated rows (`source = 'manual'`) untouched.

Synced fields on every run: title, live URL, stack, code URL, active flag.  
Description and image are set **once on insert** so you can polish them in D1 without the job overwriting them.

## One-time setup

### 1. Run the D1 migration

```bash
npx wrangler d1 execute njmtech-projects --remote \
  --file=scripts/migrate-vercel-projects-sync.sql
```

This adds `vercel_project_id`, `source`, `category_locked`, `synced_at`, and ensures the three category groups exist.

### 2. Install and deploy the Worker

```bash
cd workers/vercel-projects-sync
pnpm install
pnpm deploy
```

From the repo root you can also use:

```bash
pnpm projects:sync:deploy
```

### 3. Set Worker secrets

In the Cloudflare dashboard (Worker → Settings → Variables) or via CLI:

```bash
cd workers/vercel-projects-sync
npx wrangler secret put VERCEL_TOKEN
npx wrangler secret put SYNC_SECRET
# optional — required for team-scoped accounts
npx wrangler secret put VERCEL_TEAM_ID
```

| Secret / var | Required | Purpose |
|--------------|----------|---------|
| `VERCEL_TOKEN` | Yes | Vercel personal/token with project read access |
| `SYNC_SECRET` | Yes | Protects manual `GET /sync` |
| `VERCEL_TEAM_ID` | No | Scope listing to a team |
| `PROJECT_CATEGORY_MAP` | No | JSON overrides (plain var in `wrangler.toml` or dashboard) |

Example category map:

```json
{"my-shop":"ECOM","admin-dashboard":"TOOL","njmtech-portfolio":"WEB"}
```

Update the map as a plain Worker var (dashboard or `[vars]` in `wrangler.toml`) — it is not secret.

## Manual sync

```bash
curl -H "X-Sync-Secret: $SYNC_SECRET" https://vercel-projects-sync.<your-subdomain>.workers.dev/sync
```

Successful response includes `fetched`, `inserted`, `updated`, `deactivated`, `syncedAt`.

## Categorization

Priority:

1. `PROJECT_CATEGORY_MAP` entry for the Vercel project **name** (case-insensitive)
2. Name heuristics:
   - **ECOM**: `shop`, `store`, `cart`, `commerce`, `ecomm`, `e-comm`
   - **TOOL**: `tool`, `cli`, `util`, `api`, `dashboard`, `admin`, `generator`, `converter`
   - **WEB**: everything else
3. On later syncs, category is only rewritten when `category_locked = 0`

### Lock a category after a manual move

If you move a synced card to another tab in D1 and want the job to stop re-mapping it:

```sql
UPDATE project
SET category_locked = 1
WHERE vercel_project_id = 'prj_...';
```

## Local development

```bash
cd workers/vercel-projects-sync
cp .dev.vars.example .dev.vars   # fill secrets
pnpm install
pnpm dev
```

Trigger the scheduled handler with Wrangler’s scheduled testing, or call `/sync` with the secret header.

## Notes

- The Next.js app keeps reading via `GET /api/projects` (1h cache). After a sync you may wait up to the revalidate window, or redeploy/purge that cache tag if you need an immediate refresh.
- Vercel does not provide portfolio blurbs or screenshots — polish `description` / `img_url` in D1 after the first sync.
- Do not commit `.dev.vars` or tokens.
