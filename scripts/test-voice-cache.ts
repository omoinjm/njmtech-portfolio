/**
 * Verify Omoi + blog voice cache URLs (S3 manifest + optional D1).
 * Does not load @/lib/config — no EMAIL_* required.
 *
 * Usage:
 *   pnpm voice-cache:test              # S3 manifest only
 *   pnpm voice-cache:test:d1           # manifest + D1 via Infisical
 */
import {
  blogChunkCacheKey,
  getBlogVoiceCacheUrl,
} from "../src/lib/blog-voice-cache";
import {
  OMOI_PROMPT_CHIPS,
  OMOI_VOICE_CACHE_KEYS,
  OMOI_VOICE_CACHE_URLS,
  type OmoiVoiceCacheKey,
} from "../src/lib/omoi-voice-cache";

const BLOG_VOICE_TEST_SLUG = "cloudflare-d1-notes";
const BLOG_VOICE_TEST_CHUNKS = 4;

async function fetchD1AudioUrl(cacheKey: string): Promise<string | null> {
  const accountId = process.env.D1_ACCOUNT_ID;
  const databaseId = process.env.D1_DATABASE_ID;
  const apiToken = process.env.D1_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    return null;
  }

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sql: "SELECT audio_url FROM ai_voice_cache WHERE cache_key = ? LIMIT 1",
      params: [cacheKey],
    }),
  });

  if (!response.ok) {
    throw new Error(`D1 request failed: HTTP ${response.status}`);
  }

  const payload = (await response.json()) as {
    success: boolean;
    result?: { results?: { audio_url: string }[] }[];
    errors?: { message: string }[];
  };

  if (!payload.success) {
    throw new Error(payload.errors?.[0]?.message ?? "D1 query failed");
  }

  return payload.result?.[0]?.results?.[0]?.audio_url ?? null;
}

async function resolveUrl(
  cacheKey: string,
  useD1: boolean,
): Promise<{ url: string | null; source: "d1" | "manifest" | "none" }> {
  if (useD1) {
    const fromD1 = await fetchD1AudioUrl(cacheKey);
    if (fromD1) {
      return { url: fromD1, source: "d1" };
    }
  }

  const fromOmoiManifest = OMOI_VOICE_CACHE_URLS[cacheKey as OmoiVoiceCacheKey];
  if (fromOmoiManifest) {
    return { url: fromOmoiManifest, source: "manifest" };
  }

  const fromBlogManifest = getBlogVoiceCacheUrl(cacheKey) ?? null;
  return fromBlogManifest
    ? { url: fromBlogManifest, source: "manifest" }
    : { url: null, source: "none" };
}

async function main() {
  const useD1 = process.argv.includes("--d1");
  const keys: OmoiVoiceCacheKey[] = [
    OMOI_VOICE_CACHE_KEYS.welcome,
    ...OMOI_PROMPT_CHIPS.map((chip) => chip.id),
  ];

  const d1Configured = Boolean(
    process.env.D1_ACCOUNT_ID && process.env.D1_DATABASE_ID && process.env.D1_API_TOKEN,
  );

  console.log(
    useD1
      ? `Voice cache test (D1${d1Configured ? "" : " not configured → manifest only"} → manifest fallback):\n`
      : "Voice cache test (S3 manifest):\n",
  );

  if (useD1 && !d1Configured) {
    console.log("  Tip: run `pnpm voice-cache:test:d1` or set D1_* in the environment.\n");
  }

  for (const cacheKey of keys) {
    await reportCacheKey(cacheKey, useD1);
  }

  console.log("Blog voice cache:\n");
  for (let index = 0; index < BLOG_VOICE_TEST_CHUNKS; index += 1) {
    const cacheKey = blogChunkCacheKey(BLOG_VOICE_TEST_SLUG, index);
    await reportCacheKey(cacheKey, useD1);
  }
}

async function reportCacheKey(cacheKey: string, useD1: boolean) {
  const { url, source } = await resolveUrl(cacheKey, useD1);
  if (!url) {
    console.log(`  ✗ ${cacheKey.padEnd(32)} no URL`);
    return;
  }

  const response = await fetch(url, { method: "HEAD" }).catch(() => null);
  const status = response?.status ?? "ERR";
  console.log(
    `  ${response?.ok ? "✓" : "✗"} ${cacheKey.padEnd(32)} HTTP ${status}  [${source}]`,
  );
  console.log(`    ${url}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
