export type OmoiState = "idle" | "ready" | "thinking" | "speaking" | "guide";

export function resolveOmoiState(input: {
  isOpen: boolean;
  isLoading: boolean;
  isSpeaking: boolean;
  guideHighlight: boolean;
}): OmoiState {
  if (input.isLoading) return "thinking";
  if (input.isSpeaking) return "speaking";
  if (input.guideHighlight) return "guide";
  if (input.isOpen) return "ready";
  return "idle";
}

export type GuideDialogEvent = "open-shortcuts" | "open-seo-guide" | "open-keyboard-guide";

export const GUIDE_DIALOG_EVENTS: GuideDialogEvent[] = [
  "open-shortcuts",
  "open-seo-guide",
  "open-keyboard-guide",
];

export function dispatchGuideDialog(event: GuideDialogEvent) {
  window.dispatchEvent(new CustomEvent(event));
}
