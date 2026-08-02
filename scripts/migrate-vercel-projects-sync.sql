-- D1 migration: Vercel → portfolio projects sync
-- Run once against njmtech-projects before deploying the Worker:
--   npx wrangler d1 execute njmtech-projects --remote --file=scripts/migrate-vercel-projects-sync.sql
--
-- Adds sync metadata columns and ensures Website / Tools / E-commerce groups exist.

-- Sync identity + provenance (safe to re-run fails if columns already exist — run once)
ALTER TABLE project ADD COLUMN vercel_project_id TEXT;
ALTER TABLE project ADD COLUMN source TEXT NOT NULL DEFAULT 'manual';
ALTER TABLE project ADD COLUMN category_locked INTEGER NOT NULL DEFAULT 0;
ALTER TABLE project ADD COLUMN synced_at TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_project_vercel_project_id
  ON project (vercel_project_id)
  WHERE vercel_project_id IS NOT NULL;

-- Ensure portfolio category groups (codes used by the sync Worker + Projects UI)
INSERT INTO project_group ("key", code, name, icon, is_active)
SELECT 'website', 'WEB', 'Website', 'bi bi-window', 1
WHERE NOT EXISTS (SELECT 1 FROM project_group WHERE code = 'WEB');

INSERT INTO project_group ("key", code, name, icon, is_active)
SELECT 'tools', 'TOOL', 'Tools', 'bi bi-tools', 1
WHERE NOT EXISTS (SELECT 1 FROM project_group WHERE code = 'TOOL');

INSERT INTO project_group ("key", code, name, icon, is_active)
SELECT 'ecommerce', 'ECOM', 'E-commerce', 'bi bi-cart', 1
WHERE NOT EXISTS (SELECT 1 FROM project_group WHERE code = 'ECOM');

-- Activate groups if they already existed but were inactive
UPDATE project_group SET is_active = 1 WHERE code IN ('WEB', 'TOOL', 'ECOM');
