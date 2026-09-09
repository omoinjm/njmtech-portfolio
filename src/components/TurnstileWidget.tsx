"use client";

import Script from "next/script";
import type { RefObject } from "react";

interface TurnstileWidgetProps {
  containerRef: RefObject<HTMLDivElement | null>;
  onReady: () => void;
  className?: string;
}

export function TurnstileWidget({ containerRef, onReady, className }: TurnstileWidgetProps) {
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onReady={onReady}
      />
      <div ref={containerRef} className={className} />
    </>
  );
}
