import {
  getBlogVoiceCacheUrl,
  isBlogVoiceCacheKey,
} from "@/lib/blog-voice-cache";
import {
  getLocalVoiceCacheUrl,
  isOmoiVoiceCacheKey,
} from "@/lib/omoi-voice-cache";
import { getVoiceCache, getVoiceCacheByKey } from "@/services/sql.service";

/**
 * Resolve a pre-generated voice URL: D1 first, then built-in S3 manifest.
 */
export async function resolveVoiceCacheUrl(
  cacheKey: string,
): Promise<string | null> {
  const fromD1 = await getVoiceCacheByKey(cacheKey);
  if (fromD1) {
    return fromD1;
  }

  if (isOmoiVoiceCacheKey(cacheKey)) {
    return getLocalVoiceCacheUrl(cacheKey) ?? null;
  }

  if (isBlogVoiceCacheKey(cacheKey)) {
    return getBlogVoiceCacheUrl(cacheKey) ?? null;
  }

  return null;
}

export async function resolveVoiceCacheUrlByHash(
  textHash: string,
): Promise<string | null> {
  return getVoiceCache(textHash);
}
