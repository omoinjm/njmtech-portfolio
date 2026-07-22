/**
 * Strip Markdown formatting for TTS playback.
 */
export function markdownToSpeechText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/[*_~>|]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Split speech text into chunks suitable for TTS API timeouts.
 */
export function chunkSpeechText(text: string, maxLength = 400): string[] {
  const paragraphs = text
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  const flush = () => {
    if (current.trim()) {
      chunks.push(current.trim());
      current = "";
    }
  };

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxLength) {
      flush();
      const sentences = paragraph.match(/[^.!?]+[.!?]+|\S+/g) ?? [paragraph];

      for (const sentence of sentences) {
        const trimmed = sentence.trim();
        const next = current ? `${current} ${trimmed}` : trimmed;

        if (next.length > maxLength) {
          flush();
          current = trimmed;
        } else {
          current = next;
        }
      }
      continue;
    }

    const next = current ? `${current}\n\n${paragraph}` : paragraph;

    if (next.length > maxLength) {
      flush();
      current = paragraph;
    } else {
      current = next;
    }
  }

  flush();
  return chunks;
}
