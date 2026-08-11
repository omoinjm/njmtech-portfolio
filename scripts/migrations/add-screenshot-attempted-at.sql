-- Track screenshot attempts so failed captures are not retried every cron run.
-- Run: npx wrangler d1 execute njmtech-projects --remote --file=scripts/migrations/add-screenshot-attempted-at.sql

ALTER TABLE project ADD COLUMN screenshot_attempted_at TEXT;
