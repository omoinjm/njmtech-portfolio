import { ChatMessage, ChatResponse } from "./types";
import { IChatTransport, TransportEvent } from "./transport.types";

/**
 * WebSocket Transport for Chat.
 * Adheres to SRP: Only handles WebSocket lifecycle and data framing.
 */
export class WebSocketChatTransport implements IChatTransport {
  public readonly name = "WebSocket";
  private socket: WebSocket | null = null;
  private eventCallback?: (event: TransportEvent) => void;
  private reconnectAttempts = 0;
  private isDisposed = false;

  constructor(
    private readonly url: string,
    private conversationId?: string
  ) {}

  async sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
    // WebSockets typically send single messages in real-time.
    // For this generic interface, we send the latest user message.
    const lastMessage = messages[messages.length - 1];
    
    return new Promise((resolve, reject) => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        this.connect();
        // Return a temporary message or wait for connection? 
        // For SOLID, we'll throw if not ready but attempt to connect for next time.
        return reject(new Error("WebSocket not connected. Attempting to connect..."));
      }

      const payload = {
        message: lastMessage.content,
        conversation_id: this.conversationId,
      };

      this.socket.send(JSON.stringify(payload));
      
      // Since WS is event-driven, "Unary" response is technically handled via onEvent.
      // We resolve with a placeholder and let the event stream handle the display.
      resolve({ content: "..." }); 
    });
  }

  onEvent(callback: (event: TransportEvent) => void): void {
    this.eventCallback = callback;
    if (!this.socket) this.connect();
  }

  private connect(): void {
    if (this.isDisposed || !this.url) return;

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        this.eventCallback?.({ type: "status", data: true });
      };

      this.socket.onclose = () => {
        this.eventCallback?.({ type: "status", data: false });
        this.handleReconnect();
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "typing") {
            this.eventCallback?.({ type: "typing", data: true });
          } else if (data.type === "response") {
            this.eventCallback?.({ type: "typing", data: false });
            if (data.conversation_id) this.conversationId = data.conversation_id;
            this.eventCallback?.({ type: "message", data: { content: data.content } });
          } else if (data.type === "error") {
            this.eventCallback?.({ type: "error", data: data.content });
          }
        } catch {
          this.eventCallback?.({ type: "message", data: { content: event.data } });
        }
      };

      this.socket.onerror = (err) => {
        this.eventCallback?.({ type: "error", data: "Connection error" });
      };

    } catch (error) {
      this.handleReconnect();
    }
  }

  private handleReconnect(): void {
    if (this.isDisposed) return;
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;
    
    setTimeout(() => this.connect(), delay);
  }

  dispose(): void {
    this.isDisposed = true;
    this.socket?.close();
    this.socket = null;
    this.eventCallback = undefined;
  }
}
