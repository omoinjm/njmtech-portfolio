import { NextRequest, NextResponse } from "next/server";
import { TtsOrchestrator } from "@/services/tts/orchestrator";
import { VoxCpmProvider } from "@/services/tts/voxcpm-provider";
import { EdgeTtsProvider } from "@/services/tts/edge-provider";
import { DatabaseTtsProvider } from "@/services/tts/db-provider";
import { getTtsProfile, type TtsProfile } from "@/lib/tts-profiles";

const VALID_PROFILES: TtsProfile[] = ["assistant", "blog"];

function resolveProfile(value: unknown): TtsProfile {
  if (typeof value === "string" && VALID_PROFILES.includes(value as TtsProfile)) {
    return value as TtsProfile;
  }
  return "assistant";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = body?.text;
    const profile = resolveProfile(body?.profile);

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const voiceProfile = getTtsProfile(profile);
    const providers = [];

    providers.push(new DatabaseTtsProvider());

    const hfToken = process.env.HF_TOKEN || "";
    providers.push(
      new VoxCpmProvider(
        voiceProfile.voxcpmRefAudio,
        voiceProfile.voxcpmInstruction,
        hfToken,
      ),
    );
    providers.push(new EdgeTtsProvider(voiceProfile.edgeVoice));

    const orchestrator = new TtsOrchestrator(providers, 15000);
    const { buffer, provider: usedProvider } = await orchestrator.getSpeech(text);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "public, max-age=3600",
        "X-Speech-Provider": usedProvider,
        "X-Speech-Profile": profile,
      },
    });
  } catch (error) {
    console.error("TTS orchestration critical failure:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 },
    );
  }
}
