/**
 * Stable cache keys for pre-generated blog narration audio.
 * D1 `ai_voice_cache.cache_key` format: `blog:{slug}` or `blog:{slug}:{chunkIndex}`.
 */

export const BLOG_VOICE_CACHE_PREFIX = "blog:" as const;

const S3_BLOG_VOICE_BASE =
  "https://s3.njmtech.co.za/njmtech-portfolio/voice/blog";

/** Full-article audio (single file). */
export function blogFullCacheKey(slug: string): string {
  return `${BLOG_VOICE_CACHE_PREFIX}${slug}`;
}

/** Per-chunk audio (matches BlogAudioPlayer chunk index). */
export function blogChunkCacheKey(slug: string, chunkIndex: number): string {
  return `${BLOG_VOICE_CACHE_PREFIX}${slug}:${chunkIndex}`;
}

export function isBlogVoiceCacheKey(cacheKey: string): boolean {
  return cacheKey.startsWith(BLOG_VOICE_CACHE_PREFIX);
}

/**
 * Local/dev manifest — add URLs after running `pnpm blog-voice:generate`.
 * Keys use blogChunkCacheKey(slug, index) or blogFullCacheKey(slug).
 */
export const BLOG_VOICE_CACHE_URLS: Record<string, string> = {
  // Example after generation:
  // "blog:cloudflare-d1-notes:0": `${S3_BLOG_VOICE_BASE}/cloudflare-d1-notes/0.wav`,
};

export function getBlogVoiceCacheUrl(cacheKey: string): string | undefined {
  if (!isBlogVoiceCacheKey(cacheKey)) {
    return undefined;
  }

  return BLOG_VOICE_CACHE_URLS[cacheKey];
}

export function blogVoiceS3Url(slug: string, chunkIndex: number, ext = "wav"): string {
  return `${S3_BLOG_VOICE_BASE}/${slug}/${chunkIndex}.${ext}`;
}
