-- Add Vercel sync columns to project table
-- Run: npx wrangler d1 execute njmtech-projects --remote --file=scripts/migrations/add-vercel-sync-columns.sql

ALTER TABLE project ADD COLUMN vercel_project_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_project_vercel_id
  ON project(vercel_project_id)
  WHERE vercel_project_id IS NOT NULL;

ALTER TABLE project ADD COLUMN synced_at TEXT;
