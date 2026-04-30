import { ChatMessage, ChatResponse } from "./types";

export type TransportEventType = "message" | "error" | "status" | "typing";

export interface TransportEvent {
  type: TransportEventType;
  data: ChatResponse | string | boolean;
}

/**
 * Strategy pattern interface for chat delivery.
 * Adheres to LSP and ISP.
 */
export interface IChatTransport {
  readonly name: string;
  
  /**
   * Send a message and wait for a full response (Unary).
   */
  sendMessage(messages: ChatMessage[]): Promise<ChatResponse>;

  /**
   * Subscribe to real-time events (Streaming/Status).
   * Useful for WebSockets or SSE.
   */
  onEvent(callback: (event: TransportEvent) => void): void;

  /**
   * Cleanup resources (connections, listeners).
   */
  dispose(): void;
}
