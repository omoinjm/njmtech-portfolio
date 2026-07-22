"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Headphones, Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/hooks/use-speech";
import {
  chunkSpeechText,
  markdownToSpeechText,
} from "@/utils/markdown-to-speech";

interface BlogAudioPlayerProps {
  content: string;
  title: string;
}

export function BlogAudioPlayer({ content, title }: BlogAudioPlayerProps) {
  const t = useTranslations("blog");
  const [isPlaying, setIsPlaying] = useState(false);
  const [chunkIndex, setChunkIndex] = useState(0);
  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef(0);

  const chunks = useMemo(
    () => chunkSpeechText(markdownToSpeechText(content)),
    [content],
  );

  const playFromIndex = useCallback(
    (startIndex: number) => {
      if (chunks.length === 0) return;

      chunksRef.current = chunks;
      indexRef.current = startIndex;
      setChunkIndex(startIndex);
      setIsPlaying(true);
    },
    [chunks],
  );

  const { speak, stop, isSpeaking } = useSpeech({
    isMuted: false,
    profile: "blog",
    onEnd: () => {
      const nextIndex = indexRef.current + 1;

      if (nextIndex >= chunksRef.current.length) {
        setIsPlaying(false);
        setChunkIndex(0);
        indexRef.current = 0;
        return;
      }

      indexRef.current = nextIndex;
      setChunkIndex(nextIndex);
      void speak(chunksRef.current[nextIndex]);
    },
  });

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      stop();
      setIsPlaying(false);
      return;
    }

    indexRef.current = chunkIndex;
    playFromIndex(chunkIndex);
    void speak(chunks[chunkIndex] ?? chunks[0]);
  }, [chunkIndex, chunks, isPlaying, playFromIndex, speak, stop]);

  const handleStop = useCallback(() => {
    stop();
    setIsPlaying(false);
    indexRef.current = 0;
    setChunkIndex(0);
  }, [stop]);

  if (chunks.length === 0) {
    return null;
  }

  const progress =
    chunks.length > 0 ? Math.round(((chunkIndex + 1) / chunks.length) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-card/50 p-4 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <Headphones className="w-5 h-5 text-accent shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium">{t("listen_title")}</p>
          <p className="text-xs text-muted-foreground truncate">
            {isPlaying || isSpeaking
              ? t("reading", { title })
              : t("listen_desc")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePlay}
          aria-label={isPlaying ? t("pause") : t("listen")}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              {t("pause")}
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              {t("listen")}
            </>
          )}
        </Button>
        {(isPlaying || chunkIndex > 0) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleStop}
            aria-label={t("stop")}
          >
            <Square className="w-4 h-4 mr-2" />
            {t("stop")}
          </Button>
        )}
      </div>

      {(isPlaying || isSpeaking) && (
        <div className="mt-3">
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("progress", { current: chunkIndex + 1, total: chunks.length })}
          </p>
        </div>
      )}
    </div>
  );
}
