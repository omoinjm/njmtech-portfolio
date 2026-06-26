import { ChatMessage, ChatResponse } from "./types";
import { IChatTransport, TransportEvent } from "./transport.types";

/**
 * Standard HTTP Transport for Chat.
 * Adheres to SRP: Only handles HTTP request/response.
 */
export class HttpChatTransport implements IChatTransport {
  public readonly name = "HTTP";
  private eventCallback?: (event: TransportEvent) => void;

  constructor(private readonly endpoint: string = "/api/chat") {}

  async sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      this.eventCallback?.({ type: "status", data: "Connecting..." });
      
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      // Emit event for real-time listeners
      this.eventCallback?.({ type: "message", data });
      
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.eventCallback?.({ type: "error", data: message });
      throw error;
    }
  }

  onEvent(callback: (event: TransportEvent) => void): void {
    this.eventCallback = callback;
  }

  dispose(): void {
    this.eventCallback = undefined;
  }
}
