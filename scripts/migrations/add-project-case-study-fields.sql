-- Case study fields for /work portfolio entries
-- Run: npx wrangler d1 execute njmtech-projects --remote --file=scripts/migrations/add-project-case-study-fields.sql

ALTER TABLE project ADD COLUMN industry TEXT;
ALTER TABLE project ADD COLUMN challenge TEXT;
ALTER TABLE project ADD COLUMN solution TEXT;
ALTER TABLE project ADD COLUMN result TEXT;
