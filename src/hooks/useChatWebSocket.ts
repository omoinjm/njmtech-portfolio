"use client";

import { useEffect, useRef, useCallback, useState } from "react";

type WSMessageType = "typing" | "response" | "error";

type WSIncoming = {
  type: WSMessageType;
  content: string;
  conversation_id?: string;
  timestamp: number;
};

type WSSend = {
  message: string;
  conversation_id?: string;
};

type UseChatWebSocketOptions = {
  url: string;
  onMessage: (content: string, type: WSMessageType) => void;
  onTyping: (isTyping: boolean) => void;
  onConnectionChange: (connected: boolean) => void;
  conversationId?: string;
  onConversationIdChange?: (id: string) => void;
};

export function useChatWebSocket({
  url,
  onMessage,
  onTyping,
  onConnectionChange,
  conversationId,
  onConversationIdChange,
}: UseChatWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const [isConnected, setIsConnected] = useState(false);

  const connectRef = useRef<(() => void) | null>(null);

  const getBackoffDelay = useCallback((attempt: number) => {
    // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
    return Math.min(1000 * Math.pow(2, attempt), 30000);
  }, []);

  const connect = useCallback(() => {
    if (!url) return;

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsUrl = new URL(url);
    if (conversationId) {
      wsUrl.searchParams.set("conversation_id", conversationId);
    }

    const ws = new WebSocket(wsUrl.toString());
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[ChatWS] Connected");
      setIsConnected(true);
      onConnectionChange(true);
      reconnectAttempts.current = 0;
    };

    ws.onclose = () => {
      console.log("[ChatWS] Disconnected");
      setIsConnected(false);
      onConnectionChange(false);
      onTyping(false);

      // Auto-reconnect with backoff
      const delay = getBackoffDelay(reconnectAttempts.current);
      reconnectAttempts.current += 1;
      console.log(`[ChatWS] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`);

      reconnectTimeoutRef.current = setTimeout(() => {
        connectRef.current?.();
      }, delay);
    };

    ws.onerror = (error) => {
      console.error("[ChatWS] Error:", error);
    };

    ws.onmessage = (event) => {
      try {
        const data: WSIncoming = JSON.parse(event.data);

        if (data.type === "typing") {
          onTyping(true);
        } else if (data.type === "response") {
          onTyping(false);
          if (data.conversation_id && onConversationIdChange) {
            onConversationIdChange(data.conversation_id);
          }
          onMessage(data.content, "response");
        } else if (data.type === "error") {
          onTyping(false);
          onMessage(data.content, "error");
        }
      } catch {
        // Plain text response
        onTyping(false);
        onMessage(event.data, "response");
      }
    };
  }, [url, conversationId, onMessage, onTyping, onConnectionChange, onConversationIdChange, getBackoffDelay]);

  // Store connect in ref so onclose can call it without dependency issues
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.warn("[ChatWS] Cannot send: not connected");
        return;
      }

      const payload: WSSend = { message: content };
      if (conversationId) {
        payload.conversation_id = conversationId;
      }

      wsRef.current.send(JSON.stringify(payload));
    },
    [conversationId],
  );

  useEffect(() => {
    if (url) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, connect]);

  return {
    isConnected,
    sendMessage,
  };
}
