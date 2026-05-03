import { ITtsProvider } from "./types";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  const serializedError = JSON.stringify(error);
  return serializedError ?? String(error);
};

/**
 * Orchestrates multiple TTS providers with fallback.
 * Adheres to SRP and DIP.
 */
export class TtsOrchestrator {
  constructor(
    private readonly providers: ITtsProvider[],
    private readonly providerTimeoutMs: number = 8000 // 8 second timeout per provider
  ) {}

  async getSpeech(text: string): Promise<{ buffer: ArrayBuffer; provider: string }> {
    const errors: Error[] = [];

    for (const provider of this.providers) {
      try {
        // Race the provider against a timeout
        const buffer = await Promise.race([
          provider.synthesize(text),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error(`Timeout: ${provider.name} took too long`)), this.providerTimeoutMs)
          )
        ]);

        return { buffer, provider: provider.name };
      } catch (error) {
        const message = getErrorMessage(error);

        console.warn(`TTS Provider ${provider.name} failed or timed out:`, message);
        errors.push(new Error(message));
        continue; // Try next provider (e.g. Edge TTS)
      }
    }

    throw new Error(`All TTS providers failed: ${errors.map(e => e.message || String(e)).join(" | ")}`);
  }
}
