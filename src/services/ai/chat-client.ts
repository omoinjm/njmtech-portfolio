import { ChatMessage, ChatResponse } from "./types";
import { IChatTransport, TransportEvent } from "./transport.types";

/**
 * Chat Client that orchestrates transport.
 * Adheres to DIP: Depends on IChatTransport abstraction.
 */
export class ChatClient {
  constructor(private transport: IChatTransport) {}

  /**
   * Swap transport at runtime (OCP/LSP).
   */
  setTransport(transport: IChatTransport): void {
    this.transport.dispose();
    this.transport = transport;
  }

  async send(messages: ChatMessage[]): Promise<ChatResponse> {
    return this.transport.sendMessage(messages);
  }

  onEvent(callback: (event: TransportEvent) => void): void {
    this.transport.onEvent(callback);
  }

  dispose(): void {
    this.transport.dispose();
  }
}
