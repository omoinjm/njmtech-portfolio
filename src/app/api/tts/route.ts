import { NextRequest, NextResponse } from "next/server";
import { EdgeTTS } from "edge-tts-universal";

// Play.ht TTS (High Quality Voice Cloning - Optional Paid)
const PLAYHT_API_KEY = process.env.PLAYHT_API_KEY || "";
const PLAYHT_USER_ID = process.env.PLAYHT_USER_ID || "";
const PLAYHT_VOICE_ID = process.env.PLAYHT_VOICE_ID || "";

const PLAYHT_API_URL = "https://api.play.ht/api/v2/tts/stream";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Truncate long texts to avoid excessive API usage
    const truncated = text.length > 1000 ? text.slice(0, 1000) + "..." : text;

    // 1. Try Play.ht if configured
    if (PLAYHT_API_KEY && PLAYHT_USER_ID) {
      try {
        const response = await fetch(PLAYHT_API_URL, {
          method: "POST",
          headers: {
            "X-User-Id": PLAYHT_USER_ID,
            "Authorization": `Bearer ${PLAYHT_API_KEY}`,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
          },
          body: JSON.stringify({
            text: truncated,
            voice: PLAYHT_VOICE_ID || "s3://voice-cloning-zero-shot/d5896025-a74e-4b4e-9844-31f6d330c6a2/josh/manifest.json",
            output_format: "mp3",
            speed: 1,
            sample_rate: 24000,
            voice_engine: "PlayHT2.0-turbo",
          }),
        });

        if (response.ok) {
          const audioBuffer = await response.arrayBuffer();
          return new NextResponse(audioBuffer, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Length": String(audioBuffer.byteLength),
              "Cache-Control": "public, max-age=3600",
            },
          });
        }
      } catch (err) {
        console.error("Play.ht failed, falling back to Edge TTS:", err);
      }
    }

    // 2. High-Quality Free Fallback: Microsoft Edge Neural TTS
    // This provides very natural human-like voices for free.
    // "en-US-ChristopherNeural" is a good natural male voice.
    const tts = new EdgeTTS(truncated, "en-US-ChristopherNeural");
    const result = await tts.synthesize();
    const audioBuffer = result.audio;

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audioBuffer.length),
        "Cache-Control": "public, max-age=3600",
      },
    });

  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 },
    );
  }
}
