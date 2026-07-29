/**
 * Stable voice-cache keys for Omoi TTS.
 * D1 `ai_voice_cache.cache_key` maps to these — copy can change without re-seeding audio.
 */
export const OMOI_VOICE_CACHE_KEYS = {
  welcome: "welcome",
  about: "about",
  services: "services",
  skills: "skills",
  projects: "projects",
  contact: "contact",
  resume: "resume",
  greeting: "greeting",
  default: "default",
} as const;

export type OmoiVoiceCacheKey =
  (typeof OMOI_VOICE_CACHE_KEYS)[keyof typeof OMOI_VOICE_CACHE_KEYS];

export const OMOI_WELCOME_MESSAGE = {
  cacheKey: OMOI_VOICE_CACHE_KEYS.welcome,
  content:
    "I-I'm Omoi. I've been assigned to protect Nhlanhla's portfolio... but what if I fail? What if a server explodes right now? *Munch*... This lollipop is the only thing keeping me sane. Ask me about his services, skills, or projects. I'll do my best to answer... if the world doesn't end first.",
} as const;

/** Prompt chips — `id` is the D1 `cache_key` for pre-generated audio. */
export const OMOI_PROMPT_CHIPS = [
  { id: OMOI_VOICE_CACHE_KEYS.about, prompt: "Who is Nhlanhla Junior Malaza?" },
  { id: OMOI_VOICE_CACHE_KEYS.services, prompt: "What services do you offer?" },
  { id: OMOI_VOICE_CACHE_KEYS.skills, prompt: "What technologies do you work with?" },
  { id: OMOI_VOICE_CACHE_KEYS.projects, prompt: "Can I see the projects?" },
  { id: OMOI_VOICE_CACHE_KEYS.contact, prompt: "How can I get in touch?" },
  { id: OMOI_VOICE_CACHE_KEYS.resume, prompt: "Can I view the resume?" },
] as const;

export type OmoiPromptChipId = (typeof OMOI_PROMPT_CHIPS)[number]["id"];

export type OmoiPromptChipLabelKey =
  | "chip_about"
  | "chip_services"
  | "chip_skills"
  | "chip_projects"
  | "chip_contact"
  | "chip_resume";

const PROMPT_CHIP_LABEL_KEYS: Record<OmoiPromptChipId, OmoiPromptChipLabelKey> = {
  about: "chip_about",
  services: "chip_services",
  skills: "chip_skills",
  projects: "chip_projects",
  contact: "chip_contact",
  resume: "chip_resume",
};

export function getOmoiPromptChipLabelKey(id: OmoiPromptChipId): OmoiPromptChipLabelKey {
  return PROMPT_CHIP_LABEL_KEYS[id];
}

const S3_VOICE_BASE =
  "https://s3.njmtech.co.za/njmtech-portfolio/voice/omoi/samples";

/**
 * Local dev fallback when D1 is not configured.
 * Production should use D1 `ai_voice_cache.cache_key` rows instead.
 */
export const OMOI_VOICE_CACHE_URLS: Partial<Record<OmoiVoiceCacheKey, string>> = {
  welcome: `${S3_VOICE_BASE}/733911b86d5036919736e655722d8e3363c678986783011a6814058dcfa8709d_fcrsth.wav`,
  about: `${S3_VOICE_BASE}/37f94b48cf633d48d3eb5558e4d83519d1ffeffa826391f4f4bd9f62ae9bdc61_irzs9g.wav`,
  services: `${S3_VOICE_BASE}/c2cff6f05c9ab441cc1ce52ecba6142a5ac49064a721540e6bcb528b011b69b1_nl0vff.wav`,
  skills: `${S3_VOICE_BASE}/45002da0e0b7d12351c0e200f9f503fc8c6f1a1bfa8490f2be031065f46cff9c_zyvi8p.wav`,
  projects: `${S3_VOICE_BASE}/2a7ee9be7352a673da7642103fe8d2e6e01d5b3b7b39331c5ff9b6e831b28f11_mwhpu5.wav`,
  contact: `${S3_VOICE_BASE}/f8a46aa0d60e0ee6d0cb16088e875b61310450915819f171ed56274f2069fd6d_guw7sp.wav`,
  resume: `${S3_VOICE_BASE}/c44cc1ca95f56e923fe7f7ab682eeb3ead9a2c04454cf5a3028b8467233ebb44_lmippl.wav`,
  greeting: `${S3_VOICE_BASE}/8246c217bd73fe3dcac55f35042d5be6e7f478b19e1f356d65420077f97e3d0d_fuxqlb.wav`,
};

export function getLocalVoiceCacheUrl(cacheKey: OmoiVoiceCacheKey): string | undefined {
  return OMOI_VOICE_CACHE_URLS[cacheKey];
}

export function isOmoiVoiceCacheKey(value: unknown): value is OmoiVoiceCacheKey {
  return (
    typeof value === "string" &&
    Object.values(OMOI_VOICE_CACHE_KEYS).includes(value as OmoiVoiceCacheKey)
  );
}

export function isOmoiPromptChipId(value: string): value is OmoiPromptChipId {
  return OMOI_PROMPT_CHIPS.some((chip) => chip.id === value);
}
