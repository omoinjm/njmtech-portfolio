-- Seed blog voice cache: cloudflare-d1-notes (4 chunks)
-- Run: npx wrangler d1 execute njmtech-projects --remote --file=scripts/seed-blog-voice-cloudflare-d1-notes.sql

DELETE FROM ai_voice_cache WHERE cache_key LIKE 'blog:cloudflare-d1-notes:%';

INSERT INTO ai_voice_cache (cache_key, response_text_hash, response_text, audio_url, provider)
VALUES ('blog:cloudflare-d1-notes:0', 'eb4fd12101fa478928a297253dd5ff5680602eb03c859d858e4a1275e1f554e4', 'This site runs on Next.js 16 with optional Cloudflare D1 for structured data: projects, skills, navigation, and TTS voice cache. Blog posts like this one are stored as Markdown on Cloudflare R2 and fetched at build/runtime — not in the repo.

Why D1 for portfolio data', 'https://s3.njmtech.co.za/njmtech-portfolio/voice/blog/cloudflare-d1-notes/0.wav', 'EdgeTTS');

INSERT INTO ai_voice_cache (cache_key, response_text_hash, response_text, audio_url, provider)
VALUES ('blog:cloudflare-d1-notes:1', '543110ba62d96fb5ed58eef76d5f16a92c0de3389559ec7c12255c02df0af01c', 'D1 fits small, relational content that changes occasionally but shouldn''t require a redeploy:
Project cards grouped by category
Nav menu and footer links
Newsletter subscribers
Pre-generated AI voice cache URLs

When D1 is not configured, the app degrades gracefully: empty lists, skipped cache lookups, and static pages still work.

REST from the server', 'https://s3.njmtech.co.za/njmtech-portfolio/voice/blog/cloudflare-d1-notes/1.wav', 'EdgeTTS');

INSERT INTO ai_voice_cache (cache_key, response_text_hash, response_text, audio_url, provider)
VALUES ('blog:cloudflare-d1-notes:2', '84ff82fd035c3fae207100e638bf0662170f9fa7f1d7d7be4cf6122222ca76e6', 'The portfolio talks to D1 through Cloudflare''s HTTP API (src/lib/d1-client.ts), not a Worker binding. That keeps the Next.js app deployable on Vercel while secrets stay server-only via config.get().', 'https://s3.njmtech.co.za/njmtech-portfolio/voice/blog/cloudflare-d1-notes/2.wav', 'EdgeTTS');

INSERT INTO ai_voice_cache (cache_key, response_text_hash, response_text, audio_url, provider)
VALUES ('blog:cloudflare-d1-notes:3', '711b18ff3a1c8ab2542267cd8f40429b9497b0609147cb9789e4f9509b2acc08', 'What I''m busy with next
Blog section — file-based posts with a separate TTS voice for reading aloud
More Edge-native patterns — caching, ISR, and tighter Cloudflare integration
AI assistant polish — better fallback knowledge and voice cache coverage

If you''re exploring D1 for your own site, start with one table and a single API route. Expand when the SQL workflow feels natural.', 'https://s3.njmtech.co.za/njmtech-portfolio/voice/blog/cloudflare-d1-notes/3.wav', 'EdgeTTS');

SELECT cache_key, response_text_hash, substr(audio_url, -24) AS url_suffix FROM ai_voice_cache WHERE cache_key LIKE 'blog:cloudflare-d1-notes:%' ORDER BY cache_key;