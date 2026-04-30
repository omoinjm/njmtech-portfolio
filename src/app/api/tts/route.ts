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

    const truncated = text.length > 1000 ? text.slice(0, 1000) + "..." : text;

    // 1. Try VoxCPM (Primary - Cloned Voice)
    try {
      console.log("Attempting VoxCPM with config:", {
        hasToken: !!HF_TOKEN,
        refAudio: VOXCPM_REF_AUDIO,
        instruction: VOXCPM_VOICE_INSTRUCTION
      });

      const client = await Client.connect("openbmb/VoxCPM-Demo", {
        hf_token: HF_TOKEN as `hf_${string}` || undefined,
      });

      console.log("Connected to VoxCPM Space. Running prediction...");

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
      
      // If we reach here, VoxCPM didn't return a valid audio buffer but didn't throw
      throw new Error("VoxCPM returned invalid data structure");

    } catch (err) {
      console.error("VoxCPM failed, falling back to Edge TTS:", err);
      
      // 2. Fallback: Microsoft Edge Neural TTS (Only on error)
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
    }

  } catch (error) {
    console.error("TTS critical error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 },
    );
  }
}
