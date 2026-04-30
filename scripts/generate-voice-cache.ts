import { OMOI_FALLBACK_KNOWLEDGE } from "../src/lib/ai-config";
import { VoxCpmProvider } from "../src/services/tts/voxcpm-provider";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Configuration
const OUTPUT_DIR = path.join(process.cwd(), "public", "voice", "cache");
const VOXCPM_REF_AUDIO = process.env.VOXCPM_REF_AUDIO || null;
const VOXCPM_VOICE_INSTRUCTION = process.env.VOXCPM_VOICE_INSTRUCTION || "A young male voice with a clear but anxious and overthinking tone. Nervous energy.";
const HF_TOKEN = process.env.HF_TOKEN || "";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generate() {
  console.log("🚀 Starting Voice Cache Generation...");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const provider = new VoxCpmProvider(VOXCPM_REF_AUDIO, VOXCPM_VOICE_INSTRUCTION, HF_TOKEN);
  const sqlStatements: string[] = [];

  // Get unique responses from fallback knowledge
  const uniqueResponses = Array.from(new Set(OMOI_FALLBACK_KNOWLEDGE.map(r => r.response)));

  for (const text of uniqueResponses) {
    const hash = crypto.createHash("sha256").update(text.trim()).digest("hex");
    const fileName = `${hash}.mp3`;
    const filePath = path.join(OUTPUT_DIR, fileName);

    if (fs.existsSync(filePath)) {
      console.log(`⏩ Skipping existing: ${hash.substring(0, 8)}...`);
    } else {
      try {
        console.log(`🎙️ Generating: "${text.substring(0, 30)}..."`);
        const buffer = await provider.synthesize(text);
        fs.writeFileSync(filePath, Buffer.from(buffer));
        console.log(`✅ Saved to ${fileName}`);
      } catch (err) {
        console.error(`❌ Failed for ${hash.substring(0, 8)}:`, err);
        continue;
      }
    }

    // Prepare SQL (assuming user will host them in public/voice/cache/ for now)
    // They can replace the domain later.
    const publicUrl = `https://your-domain.com/voice/cache/${fileName}`;
    sqlStatements.push(
      `INSERT INTO ai_voice_cache (response_text_hash, response_text, audio_url, provider) VALUES ('${hash}', '${text.replace(/'/g, "''")}', '${publicUrl}', 'VoxCPM') ON CONFLICT (response_text_hash) DO NOTHING;`
    );
  }

  const sqlFile = path.join(process.cwd(), "scripts", "seed-voice-cache.sql");
  fs.writeFileSync(sqlFile, sqlStatements.join("\n"));
  
  console.log("\n✨ Done!");
  console.log(`📁 Files saved in: public/voice/cache/`);
  console.log(`📝 SQL seed file created: scripts/seed-voice-cache.sql`);
  console.log("\nIMPORTANT: Update the 'https://your-domain.com' placeholder in the SQL file before importing!");
}

generate().catch(console.error);
