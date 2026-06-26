import { ChatMessage, ChatResponse, IChatProvider } from "./types";

export class GitHubModelsProvider implements IChatProvider {
  private readonly baseUrl = "https://models.inference.ai.azure.com/chat/completions";

  constructor(
    private readonly token: string,
    public readonly name: string,
    private readonly model: string,
    private readonly systemPrompt: string,
    private readonly maxTokens: number = 1000
  ) {}

  async generateResponse(messages: ChatMessage[]): Promise<ChatResponse> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: this.systemPrompt },
          ...messages,
        ],
        model: this.model,
        max_completion_tokens: this.maxTokens,
      }),
    });

    if (response.status === 429) {
      throw new Error(`RATE_LIMIT:${this.name}`);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`GitHub Models API error (${this.model}): ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    return this.parseCta(text);
  }

  private parseCta(text: string): ChatResponse {
    const ctaRegex = /\[CTA:(.+?)\|(.+?)(?:\|(external))?\]\s*$/;
    const ctaMatch = text.match(ctaRegex);
    
    if (ctaMatch) {
      return {
        content: text.replace(ctaRegex, "").trim(),
        cta: {
          label: ctaMatch[1],
          href: ctaMatch[2],
          external: ctaMatch[3] === "external",
        },
      };
    }

    return { content: text };
  }
}
