import { parseCta } from "./cta-parser";
import { ChatMessage, ChatResponse, IChatProvider } from "./types";

interface WorkersAIResponse {
  success: boolean;
  errors: Array<{ code: number; message: string }>;
  result?: { response?: string };
}

export class WorkersAIProvider implements IChatProvider {
  constructor(
    private readonly apiToken: string,
    private readonly accountId: string,
    public readonly name: string,
    private readonly model: string,
    private readonly systemPrompt: string,
    private readonly maxTokens: number = 1000
  ) {}

  async generateResponse(messages: ChatMessage[]): Promise<ChatResponse> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${this.model}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiToken}`,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: this.systemPrompt },
          ...messages,
        ],
        max_tokens: this.maxTokens,
      }),
    });

    if (response.status === 429) {
      throw new Error(`RATE_LIMIT:${this.name}`);
    }

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`Workers AI HTTP error (${this.model}): ${response.status} ${errorBody}`);
    }

    const data: WorkersAIResponse = await response.json();

    if (!data.success) {
      throw new Error(`Workers AI error (${this.model}): ${JSON.stringify(data.errors)}`);
    }

    const text = data.result?.response ?? "";

    return parseCta(text);
  }
}
