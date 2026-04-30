import { ChatMessage, ChatResponse, IChatProvider } from "./types";

export interface FallbackRule {
  patterns: string[];
  response: string;
  cta?: { href: string; label: string; external?: boolean };
}

export class RuleBasedChatProvider implements IChatProvider {
  public readonly name = "RuleBasedFallback";

  constructor(private readonly rules: FallbackRule[]) {}

  /**
   * Checks if the prompt exactly matches a pill pattern.
   * Used for short-circuiting.
   */
  public isExactMatch(prompt: string): boolean {
    const normalizedInput = this.normalizePrompt(prompt);
    return this.rules.some(rule => 
      rule.patterns.some(p => this.normalizePrompt(p) === normalizedInput)
    );
  }

  async generateResponse(messages: ChatMessage[]): Promise<ChatResponse> {
    const lastMessage = messages[messages.length - 1];
    const prompt = this.normalizePrompt(lastMessage.content);

    if (!prompt) {
      return {
        content: "Ask me about Nhlanhla, his services, projects, skills, resume, contact details, or site navigation.",
        fallback: true,
      };
    }

    let bestMatch: FallbackRule | null = null;
    let bestScore = 0;

    for (const rule of this.rules) {
      const score = rule.patterns.reduce((total, pattern) => {
        const normalizedPattern = this.normalizePrompt(pattern);
        return prompt.includes(normalizedPattern)
          ? total + normalizedPattern.split(" ").length + 1
          : total;
      }, 0);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = rule;
      }
    }

    if (bestMatch) {
      return {
        content: bestMatch.response,
        cta: bestMatch.cta,
        fallback: true,
      };
    }

    return {
      content: 'I can help with Nhlanhla\'s background, skills, services, projects, resume, newsletter, contact details, socials, or general site navigation. Try asking something like "What services do you offer?" or "How can I get in touch?"',
      fallback: true,
    };
  }

  private normalizePrompt(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
}
