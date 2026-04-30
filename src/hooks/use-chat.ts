import { useState, useEffect, useRef, useCallback } from "react";
import { ChatMessage, ChatResponse } from "@/services/ai/types";
import { ChatClient } from "@/services/ai/chat-client";
import { HttpChatTransport } from "@/services/ai/http-transport";
import { WebSocketChatTransport } from "@/services/ai/ws-transport";

interface UseChatOptions {
  mode: "copilot" | "websocket";
  wsUrl?: string;
  onMessage?: (response: ChatResponse) => void;
  onError?: (error: string) => void;
  onTyping?: (isTyping: boolean) => void;
}

/**
 * Unified Chat Hook.
 * Adheres to SRP by managing UI-related chat state.
 */
export function useChat({ mode, wsUrl, onMessage, onError, onTyping }: UseChatOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const clientRef = useRef<ChatClient | null>(null);

  // Stable references for callbacks to avoid re-triggering effects
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const onTypingRef = useRef(onTyping);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
    onTypingRef.current = onTyping;
  }, [onMessage, onError, onTyping]);

  // Initialize client on mount or mode change
  useEffect(() => {
    const transport = mode === "websocket" && wsUrl
      ? new WebSocketChatTransport(wsUrl)
      : new HttpChatTransport();

    const client = new ChatClient(transport);
    
    client.onEvent((event) => {
      switch (event.type) {
        case "message":
          setIsLoading(false);
          onMessageRef.current?.(event.data as ChatResponse);
          break;
        case "typing":
          onTypingRef.current?.(event.data as boolean);
          break;
        case "error":
          setIsLoading(false);
          onErrorRef.current?.(event.data as string);
          break;
        case "status":
          // Handle connection status if needed
          break;
      }
    });

    clientRef.current = client;

    return () => client.dispose();
  }, [mode, wsUrl]); // Removed callbacks from dependencies

  const sendMessage = useCallback(async (messages: ChatMessage[]) => {
    if (!clientRef.current) return;
    
    setIsLoading(true);
    try {
      await clientRef.current.send(messages);
    } catch (error) {
      setIsLoading(false);
      onError?.(error instanceof Error ? error.message : "Failed to send message");
    }
  }, [onError]);

  return {
    sendMessage,
    isLoading,
  };
}
