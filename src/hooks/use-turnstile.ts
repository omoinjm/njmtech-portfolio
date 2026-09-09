"use client";

import { useCallback, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

/**
 * Explicit-render Turnstile widget state. Tokens are single-use, so callers
 * must call `reset()` after each request completes (success or failure)
 * before the next submission.
 */
export function useTurnstile(action: string) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleReady = useCallback(() => {
    if (!containerRef.current || !window.turnstile || widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      action,
      callback: (t: string) => setToken(t),
      "error-callback": () => setToken(null),
      "expired-callback": () => setToken(null),
    });
  }, [action]);

  const reset = useCallback(() => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
    setToken(null);
  }, []);

  return { containerRef, token, handleReady, reset };
}
