"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  getOmoiSpriteAnimation,
  OMOI_ATLAS,
  OMOI_SPRITESHEET,
} from "@/lib/omoi-sprite";
import type { OmoiState } from "@/lib/omoi-states";
import "@/components/layout/omoi-sprite.css";

type OmoiSpriteProps = {
  state: OmoiState;
  size?: "sm" | "lg";
  className?: string;
  float?: boolean;
};

const sizeScale = {
  sm: 48 / OMOI_ATLAS.cellHeight,
  lg: 80 / OMOI_ATLAS.cellHeight,
} as const;

export function OmoiSprite({ state, size = "sm", className, float = false }: OmoiSpriteProps) {
  const reduceMotion = useReducedMotion();
  const animation = getOmoiSpriteAnimation(state);
  const scale = sizeScale[size];
  const cellWidth = OMOI_ATLAS.cellWidth * scale;
  const cellHeight = OMOI_ATLAS.cellHeight * scale;
  const sheetWidth = OMOI_ATLAS.width * scale;
  const sheetHeight = OMOI_ATLAS.height * scale;
  const stripOffsetX = -(animation.frames * OMOI_ATLAS.cellWidth * scale);
  const rowOffsetY = -(animation.row * OMOI_ATLAS.cellHeight * scale);
  const durationSec = animation.durationMs / 1000;
  const shouldAnimate = !reduceMotion && animation.frames > 1;

  return (
    <motion.div
      className={cn("relative inline-flex items-end justify-center", className)}
      style={{ width: cellWidth, height: cellHeight }}
      animate={
        float && state === "idle" && !reduceMotion ? { y: [0, -4, 0] } : undefined
      }
      transition={
        float && state === "idle" && !reduceMotion
          ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
    >
      <div
        key={state}
        role="img"
        aria-label="Omoi"
        className={cn("omoi-sprite", shouldAnimate && "omoi-sprite--animated")}
        style={{
          width: cellWidth,
          height: cellHeight,
          backgroundImage: `url(${OMOI_SPRITESHEET})`,
          backgroundSize: `${sheetWidth}px ${sheetHeight}px`,
          backgroundPosition: `${0}px ${rowOffsetY}px`,
          ["--omoi-strip-offset-x" as string]: `${stripOffsetX}px`,
          animation: shouldAnimate
            ? `omoi-sprite-strip ${durationSec}s steps(${animation.frames}) infinite`
            : undefined,
        }}
      />
    </motion.div>
  );
}
