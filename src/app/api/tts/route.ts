import { NextRequest, NextResponse } from "next/server";
import { TtsOrchestrator } from "@/services/tts/orchestrator";
import { VoxCpmProvider } from "@/services/tts/voxcpm-provider";
import { EdgeTtsProvider } from "@/services/tts/edge-provider";
import { DatabaseTtsProvider } from "@/services/tts/db-provider";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Dependency Injection: Initialize providers and orchestrator
    const providers = [];

    // 0. Cache (Check for pre-generated audio first - INSTANT)
    providers.push(new DatabaseTtsProvider());

    // 1. VoxCPM (Primary Generation - if configured)
    const refAudio = process.env.VOXCPM_REF_AUDIO || null;
    const instruction = process.env.VOXCPM_VOICE_INSTRUCTION || "A young male voice with a clear but anxious and overthinking tone. Nervous energy.";
    const hfToken = process.env.HF_TOKEN || "";

    providers.push(new VoxCpmProvider(refAudio, instruction, hfToken));

    // 2. Edge TTS (Fallback)
    providers.push(new EdgeTtsProvider("en-US-ChristopherNeural"));

    const orchestrator = new TtsOrchestrator(providers, 15000); // 15s timeout
    const { buffer, provider } = await orchestrator.getSpeech(text);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "public, max-age=3600",
        "X-Speech-Provider": provider,
      },
    });

  } catch (error) {
    console.error("TTS orchestration critical failure:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
