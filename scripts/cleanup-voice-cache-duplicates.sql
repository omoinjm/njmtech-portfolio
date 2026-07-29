-- Remove legacy ai_voice_cache rows that have no cache_key.
-- Safe to run: each deleted row is superseded by a newer row with the same intent.
--
-- Null rows explained:
--   id 3  — old "skills" copy     → id 18 has cache_key = 'skills' (current copy)
--   id 4  — old "projects" copy   → id 19 has cache_key = 'projects'
--   id 5  — old "contact" copy    → id 20 has cache_key = 'contact'
--   id 6  — old "resume" copy     → id 21 has cache_key = 'resume'
--   id 8  — "You're welcome…"     → not used in app (no cache_key defined)
--
-- Run:
--   npx wrangler d1 execute njmtech-projects --remote --file=scripts/cleanup-voice-cache-duplicates.sql

-- Preview rows to be removed:
SELECT id, response_text_hash, cache_key, substr(response_text, 1, 64) AS preview
FROM ai_voice_cache
WHERE id IN (3, 4, 5, 6, 8)
ORDER BY id;

DELETE FROM ai_voice_cache WHERE id IN (3, 4, 5, 6, 8);

-- Verify: every active key should appear exactly once; no null cache_key left (except if you keep orphans).
SELECT cache_key, id, response_text_hash, substr(audio_url, 1, 80) AS audio_url
FROM ai_voice_cache
ORDER BY cache_key, id;

-- Optional: rows still missing a key (should be empty after cleanup):
SELECT id, response_text_hash, substr(response_text, 1, 72) AS preview
FROM ai_voice_cache
WHERE cache_key IS NULL OR cache_key = ''
ORDER BY id;
