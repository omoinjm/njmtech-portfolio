import { NextRequest, NextResponse } from "next/server";

// Play.ht TTS (High Quality Voice Cloning)
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

    // If Play.ht is not configured, return 501 so frontend falls back to browser TTS
    if (!PLAYHT_API_KEY || !PLAYHT_USER_ID) {
      return NextResponse.json(
        { error: "Play.ht TTS not configured" },
        { status: 501 },
      );
    }

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
        voice: PLAYHT_VOICE_ID || "s3://voice-cloning-zero-shot/d5896025-a74e-4b4e-9844-31f6d330c6a2/josh/manifest.json", // Fallback to a young male voice if ID missing
        output_format: "mp3",
        speed: 1,
        sample_rate: 24000,
        voice_engine: "PlayHT2.0-turbo",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Play.ht API error:", errorText);
      throw new Error(`Play.ht TTS failed: ${response.status}`);
    }

    // Play.ht v2 stream returns the audio directly
    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audioBuffer.byteLength),
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
