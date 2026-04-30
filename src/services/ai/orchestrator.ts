import { ChatMessage, ChatResponse, IChatProvider } from "./types";

/**
 * Orchestrates multiple chat providers with a fallback mechanism.
 * Adheres to Single Responsibility and Open/Closed principles.
 */
export class ChatOrchestrator {
  constructor(
    private readonly providers: IChatProvider[],
    private readonly globalTimeoutMs: number = 5000 // 5 second strict limit
  ) {}

  async getResponse(messages: ChatMessage[]): Promise<ChatResponse> {
    const errors: Error[] = [];
    const lastMessage = messages[messages.length - 1];

    // 1. Short-circuit: If this is an exact match for a pill, use the rule immediately.
    // This guarantees a voice cache hit and saves AI tokens.
    const ruleProvider = this.providers.find(p => p.name === "RuleBasedFallback") as any;
    if (ruleProvider && typeof ruleProvider.isExactMatch === 'function') {
      if (ruleProvider.isExactMatch(lastMessage.content)) {
        console.log("[Orchestrator] Exact match found. Short-circuiting to rules.");
        return await ruleProvider.generateResponse(messages);
      }
    }

    // 2. Race the entire chain against a global timeout
    try {
      return await Promise.race([
        this.executeChain(messages, errors),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("GLOBAL_TIMEOUT")), this.globalTimeoutMs)
        ),
      ]);
    } catch (error) {
      if (error instanceof Error && error.message === "GLOBAL_TIMEOUT") {
        console.warn("AI Chat timed out globally. Falling back to local rules.");
        // Find the rule-based provider if it exists in the chain
        const ruleProvider = this.providers.find(p => p.name === "RuleBasedFallback");
        if (ruleProvider) {
          return await ruleProvider.generateResponse(messages);
        }
      }
      throw error;
    }
  }

  private async executeChain(messages: ChatMessage[], errors: Error[]): Promise<ChatResponse> {
    for (const provider of this.providers) {
      // Don't try the rule-based fallback inside the chain execution 
      // if we want to reserve it for the final/timeout fallback.
      // However, the current chain has it at the end.
      try {
        return await provider.generateResponse(messages);
      } catch (error) {
        console.warn(`Provider ${provider.name} failed:`, error instanceof Error ? error.message : error);
        errors.push(error instanceof Error ? error : new Error(String(error)));
        continue;
      }
    }
    throw new Error(`All chat providers failed: ${errors.map(e => e.message).join(", ")}`);
  }
}
