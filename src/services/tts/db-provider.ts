import { ITtsProvider } from "./types";
import { getVoiceCache } from "../sql.service";
import crypto from "crypto";

/**
 * TTS Provider that checks a database cache first.
 * If a URL is found, it fetches the pre-generated audio.
 */
export class DatabaseTtsProvider implements ITtsProvider {
  public readonly name = "DatabaseCache";

  async synthesize(text: string): Promise<ArrayBuffer> {
    const hash = crypto.createHash("sha256").update(text.trim()).digest("hex");
    
    // Check DB for cached URL
    const audioUrl = await getVoiceCache(hash);
    
    if (!audioUrl) {
      throw new Error(`No cache entry found for text hash: ${hash}`);
    }

    console.log(`[TTS] Cache hit! Fetching pre-generated audio from: ${audioUrl}`);

    const response = await fetch(audioUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch cached audio from URL: ${audioUrl}`);
    }

    return await response.arrayBuffer();
  }
}
