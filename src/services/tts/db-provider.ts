import { ITtsProvider, TtsSynthesisOptions } from "./types";
import {
  resolveVoiceCacheUrl,
  resolveVoiceCacheUrlByHash,
} from "@/services/voice-cache.service";
import crypto from "crypto";

function contentTypeFromUrl(url: string): string | undefined {
  const path = url.split("?")[0]?.toLowerCase() ?? "";
  if (path.endsWith(".wav")) return "audio/wav";
  if (path.endsWith(".mp3")) return "audio/mpeg";
  if (path.endsWith(".ogg")) return "audio/ogg";
  return undefined;
}

/**
 * TTS Provider that checks a database cache first.
 * Prefers stable `cache_key` lookup, then falls back to text hash.
 */
export class DatabaseTtsProvider implements ITtsProvider {
  public readonly name = "DatabaseCache";
  public lastContentType: string | undefined;

  async synthesize(text: string, options?: TtsSynthesisOptions): Promise<ArrayBuffer> {
    let audioUrl: string | null = null;

    if (options?.cacheKey) {
      audioUrl = await resolveVoiceCacheUrl(options.cacheKey);
      if (audioUrl) {
        console.log(`[TTS] Cache hit by key "${options.cacheKey}": ${audioUrl}`);
      }
    }

    if (!audioUrl) {
      const hash = crypto.createHash("sha256").update(text.trim()).digest("hex");
      audioUrl = await resolveVoiceCacheUrlByHash(hash);

      if (!audioUrl) {
        throw new Error(
          options?.cacheKey
            ? `No cache entry for key "${options.cacheKey}" or text hash ${hash}`
            : `No cache entry found for text hash: ${hash}`,
        );
      }

      console.log(`[TTS] Cache hit by hash! Fetching pre-generated audio from: ${audioUrl}`);
    }

    this.lastContentType = contentTypeFromUrl(audioUrl);

    const response = await fetch(audioUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch cached audio from URL: ${audioUrl}`);
    }

    return await response.arrayBuffer();
  }
}
