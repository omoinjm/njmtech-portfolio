import { ChatResponse } from "./types";

const CTA_REGEX = /\[CTA:(.+?)\|(.+?)(?:\|(external))?\]\s*$/;

export function parseCta(text: string): ChatResponse {
  const ctaMatch = text.match(CTA_REGEX);

  if (ctaMatch) {
    return {
      content: text.replace(CTA_REGEX, "").trim(),
      cta: {
        label: ctaMatch[1],
        href: ctaMatch[2],
        external: ctaMatch[3] === "external",
      },
    };
  }

  return { content: text };
}
