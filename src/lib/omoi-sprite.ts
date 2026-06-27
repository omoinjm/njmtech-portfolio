import type { OmoiState } from "@/lib/omoi-states";

/** Codex-compatible pet atlas (see public/omoi/pet.json). */
export const OMOI_SPRITESHEET = "/omoi/spritesheet.webp";

export const OMOI_ATLAS = {
  width: 1536,
  height: 1872,
  columns: 8,
  rows: 9,
  cellWidth: 192,
  cellHeight: 208,
} as const;

/** Codex row order: idle, running-right, running-left, waving, jumping, failed, waiting, running, review */
export type CodexPetRowId =
  | "idle"
  | "running-right"
  | "running-left"
  | "waving"
  | "jumping"
  | "failed"
  | "waiting"
  | "running"
  | "review";

export type OmoiSpriteAnimation = {
  row: number;
  frames: number;
  durationMs: number;
};

export const OMOI_CODEX_ROWS: Record<CodexPetRowId, OmoiSpriteAnimation> = {
  idle: { row: 0, frames: 8, durationMs: 900 },
  "running-right": { row: 1, frames: 8, durationMs: 700 },
  "running-left": { row: 2, frames: 8, durationMs: 700 },
  waving: { row: 3, frames: 8, durationMs: 800 },
  jumping: { row: 4, frames: 8, durationMs: 550 },
  failed: { row: 5, frames: 8, durationMs: 900 },
  waiting: { row: 6, frames: 8, durationMs: 1000 },
  running: { row: 7, frames: 8, durationMs: 450 },
  review: { row: 8, frames: 8, durationMs: 800 },
};

/** Portfolio assistant states → Codex animation rows. */
export const OMOI_STATE_SPRITE: Record<OmoiState, OmoiSpriteAnimation> = {
  idle: OMOI_CODEX_ROWS.idle,
  ready: OMOI_CODEX_ROWS.waiting,
  thinking: OMOI_CODEX_ROWS.running,
  speaking: OMOI_CODEX_ROWS.jumping,
  guide: OMOI_CODEX_ROWS.waving,
};

export function getOmoiSpriteAnimation(state: OmoiState): OmoiSpriteAnimation {
  return OMOI_STATE_SPRITE[state];
}
