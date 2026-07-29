-- D1 migration: stable voice cache keys for Omoi TTS
-- Run once on your Cloudflare D1 database before using cache_key lookups.

ALTER TABLE ai_voice_cache ADD COLUMN cache_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_voice_cache_cache_key
  ON ai_voice_cache (cache_key)
  WHERE cache_key IS NOT NULL;

-- Map existing S3 rows to stable keys (adjust audio_url / hashes to match your bucket).
-- Example from production data:
-- UPDATE ai_voice_cache
-- SET cache_key = 'welcome'
-- WHERE response_text_hash = '733911b86d5036919736e655722d8e3363c678986783011a6814058dcfa8709d';

-- Canonical keys (see src/lib/omoi-voice-cache.ts):
--   welcome, about, services, skills, projects, contact, resume, greeting, default

-- Projects sample (hash verified against current ai-config copy):
-- UPDATE ai_voice_cache
-- SET cache_key = 'projects'
-- WHERE response_text_hash = '2a7ee9be7352a673da7642103fe8d2e6e01d5b3b7b39331c5ff9b6e831b28f11';

-- After mapping, verify:
-- SELECT cache_key, response_text_hash, substr(audio_url, 1, 80) FROM ai_voice_cache ORDER BY cache_key;
