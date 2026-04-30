export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  content: string;
  cta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  fallback?: boolean;
}

/**
 * Interface for AI Chat Providers (e.g., GitHub Models, Gemini, Local Rules)
 * Adheres to Interface Segregation and Liskov Substitution principles.
 */
export interface IChatProvider {
  readonly name: string;
  generateResponse(messages: ChatMessage[]): Promise<ChatResponse>;
}
