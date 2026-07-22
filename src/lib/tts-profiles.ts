import { config } from "@/lib/config";

export type TtsProfile = "assistant" | "blog";

export interface TtsProfileConfig {
  voxcpmRefAudio: string | null;
  voxcpmInstruction: string;
  edgeVoice: string;
}

const ASSISTANT_DEFAULT_INSTRUCTION =
  "A young male voice with a clear but anxious and overthinking tone. Nervous energy.";

const BLOG_DEFAULT_INSTRUCTION =
  "A clear, calm male narrator. Steady pace, professional documentary tone.";

export function getTtsProfile(profile: TtsProfile): TtsProfileConfig {
  if (profile === "blog") {
    return {
      voxcpmRefAudio: config.get("BLOG_VOXCPM_REF_AUDIO") || null,
      voxcpmInstruction:
        config.get("BLOG_VOXCPM_VOICE_INSTRUCTION") ?? BLOG_DEFAULT_INSTRUCTION,
      edgeVoice: config.get("BLOG_EDGE_TTS_VOICE") ?? "en-US-GuyNeural",
    };
  }

  return {
    voxcpmRefAudio: process.env.VOXCPM_REF_AUDIO ?? null,
    voxcpmInstruction:
      process.env.VOXCPM_VOICE_INSTRUCTION ?? ASSISTANT_DEFAULT_INSTRUCTION,
    edgeVoice: "en-US-ChristopherNeural",
  };
}
