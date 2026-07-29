import { OMOI_FALLBACK_KNOWLEDGE } from "../src/lib/ai-config";
import {
  OMOI_VOICE_CACHE_KEYS,
  OMOI_WELCOME_MESSAGE,
} from "../src/lib/omoi-voice-cache";
import { VoxCpmProvider } from "../src/services/tts/voxcpm-provider";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = path.join(process.cwd(), "public", "voice", "cache");
const VOXCPM_REF_AUDIO = process.env.VOXCPM_REF_AUDIO || null;
const VOXCPM_VOICE_INSTRUCTION =
  process.env.VOXCPM_VOICE_INSTRUCTION ||
  "A young male voice with a clear but anxious and overthinking tone. Nervous energy.";
const HF_TOKEN = process.env.HF_TOKEN || "";
const S3_BASE_URL =
  process.env.VOICE_CACHE_S3_BASE_URL ||
  "https://s3.njmtech.co.za/njmtech-portfolio/voice/omoi/samples";

type CacheEntry = {
  cacheKey: string;
  text: string;
};

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

async function generate() {
  console.log("Starting voice cache generation...");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const provider = new VoxCpmProvider(VOXCPM_REF_AUDIO, VOXCPM_VOICE_INSTRUCTION, HF_TOKEN);
  const sqlStatements: string[] = [
    "-- Run scripts/migrate-voice-cache-keys.sql on D1 before importing rows.",
    "",
  ];

  const entries: CacheEntry[] = [
    { cacheKey: OMOI_WELCOME_MESSAGE.cacheKey, text: OMOI_WELCOME_MESSAGE.content },
    ...OMOI_FALLBACK_KNOWLEDGE.map((rule) => ({
      cacheKey: rule.cacheKey,
      text: rule.response,
    })),
  ];

  const seenKeys = new Set<string>();
  for (const entry of entries) {
    if (seenKeys.has(entry.cacheKey)) continue;
    seenKeys.add(entry.cacheKey);

    const hash = crypto.createHash("sha256").update(entry.text.trim()).digest("hex");
    const fileName = `${hash}.mp3`;
    const filePath = path.join(OUTPUT_DIR, fileName);

    if (fs.existsSync(filePath)) {
      console.log(`Skipping existing: ${entry.cacheKey} (${hash.slice(0, 8)}...)`);
    } else {
      try {
        console.log(`Generating [${entry.cacheKey}]: "${entry.text.slice(0, 40)}..."`);
        const buffer = await provider.synthesize(entry.text);
        fs.writeFileSync(filePath, Buffer.from(buffer));
        console.log(`Saved ${fileName}`);
      } catch (err) {
        console.error(`Failed for ${entry.cacheKey}:`, err);
        continue;
      }
    }

    const publicUrl = `${S3_BASE_URL}/${hash}.mp3`;
    sqlStatements.push(
      `INSERT INTO ai_voice_cache (cache_key, response_text_hash, response_text, audio_url, provider) VALUES ('${entry.cacheKey}', '${hash}', '${escapeSql(entry.text)}', '${publicUrl}', 'VoxCPM') ON CONFLICT (cache_key) DO UPDATE SET response_text_hash = excluded.response_text_hash, response_text = excluded.response_text, audio_url = excluded.audio_url, provider = excluded.provider;`,
    );
  }

  if (!seenKeys.has(OMOI_VOICE_CACHE_KEYS.default)) {
    console.warn(
      `No audio entry for cache key "${OMOI_VOICE_CACHE_KEYS.default}" — add one manually if needed.`,
    );
  }

  const sqlFile = path.join(process.cwd(), "scripts", "seed-voice-cache.sql");
  fs.writeFileSync(sqlFile, sqlStatements.join("\n"));

  console.log("\nDone.");
  console.log(`Files: ${OUTPUT_DIR}`);
  console.log(`SQL seed: ${sqlFile}`);
  console.log("Set VOICE_CACHE_S3_BASE_URL to override the default S3 prefix.");
}

generate().catch(console.error);
