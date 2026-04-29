import { NextRequest, NextResponse } from "next/server";
import { EdgeTTS } from "edge-tts-universal";
import { Client } from "@gradio/client";

// VoxCPM Configuration
const VOXCPM_REF_AUDIO = process.env.VOXCPM_REF_AUDIO || null;
const VOXCPM_VOICE_INSTRUCTION = process.env.VOXCPM_VOICE_INSTRUCTION || "A young male voice with a clear but anxious and overthinking tone. Nervous energy.";
const HF_TOKEN = process.env.HF_TOKEN || "";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Truncate long texts to avoid excessive API usage
    const truncated = text.length > 1000 ? text.slice(0, 1000) + "..." : text;

    // 1. Try VoxCPM (High-Quality Cloned/Designed Voice)
    try {
      // Connect with token if available
      const client = await Client.connect("openbmb/VoxCPM-Demo", {
        hf_token: HF_TOKEN as `hf_${string}` || undefined,
      });

      const result = await client.predict("/generate", { 
        text_input: truncated,
        control_instruction: VOXCPM_VOICE_INSTRUCTION,
        reference_wav_path_input: VOXCPM_REF_AUDIO ? { 
          path: VOXCPM_REF_AUDIO,
          meta: { _type: "gradio.FileData" }
        } : null,
        use_prompt_text: false,
        prompt_text_input: "",
        cfg_value_input: 1.5,
        do_normalize: true,
        denoise: true,
      });

      if (result && result.data && result.data[0]) {
        const audioData = result.data[0];
        const audioUrl = typeof audioData === 'string' ? audioData : audioData.url;

        if (audioUrl) {
          const audioResponse = await fetch(audioUrl);
          if (audioResponse.ok) {
            const audioBuffer = await audioResponse.arrayBuffer();
            return new NextResponse(audioBuffer, {
              headers: {
                "Content-Type": "audio/mpeg",
                "Content-Length": String(audioBuffer.byteLength),
                "Cache-Control": "public, max-age=3600",
              },
            });
          }
        }
      }
    } catch (err) {
      console.error("VoxCPM failed, falling back to Edge TTS:", err);
    }

    // 2. High-Quality Free Fallback: Microsoft Edge Neural TTS
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
