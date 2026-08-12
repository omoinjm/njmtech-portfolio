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

/** Parse `blog:{slug}` or `blog:{slug}:{chunkIndex}` into slug + optional chunk. */
export function parseBlogVoiceCacheKey(
  cacheKey: string,
): { slug: string; chunkIndex?: number } | null {
  if (!isBlogVoiceCacheKey(cacheKey)) {
    return null;
  }

  const rest = cacheKey.slice(BLOG_VOICE_CACHE_PREFIX.length);
  const separator = rest.lastIndexOf(":");
  if (separator === -1) {
    return { slug: rest };
  }

  const maybeIndex = rest.slice(separator + 1);
  if (/^\d+$/.test(maybeIndex)) {
    return {
      slug: rest.slice(0, separator),
      chunkIndex: Number(maybeIndex),
    };
  }

  return { slug: rest };
}

/**
 * Optional manifest overrides (e.g. non-default file extensions).
 * When empty, chunk keys resolve to the standard S3 layout via {@link blogVoiceS3Url}.
 */
export const BLOG_VOICE_CACHE_URLS: Record<string, string> = {};

export function getBlogVoiceCacheUrl(cacheKey: string): string | undefined {
  if (!isBlogVoiceCacheKey(cacheKey)) {
    return undefined;
  }

  const fromManifest = BLOG_VOICE_CACHE_URLS[cacheKey];
  if (fromManifest) {
    return fromManifest;
  }

  const parsed = parseBlogVoiceCacheKey(cacheKey);
  if (!parsed || parsed.chunkIndex === undefined) {
    return undefined;
  }

  return blogVoiceS3Url(parsed.slug, parsed.chunkIndex);
}

export function blogVoiceS3Url(slug: string, chunkIndex: number, ext = "wav"): string {
  return `${S3_BLOG_VOICE_BASE}/${slug}/${chunkIndex}.${ext}`;
}
