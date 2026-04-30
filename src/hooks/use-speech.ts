import { useCallback, useRef, useState, useEffect } from "react";

interface UseSpeechOptions {
  isMuted: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * Hook for handling text-to-speech with high-quality fallback.
 * Adheres to SRP by isolating audio management logic.
 */
export function useSpeech({ isMuted, onStart, onEnd }: UseSpeechOptions) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (isMuted || !text || typeof window === "undefined") return;

      stop();

      try {
        setIsSpeaking(true);
        onStart?.();

        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) throw new Error("TTS API failed");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          onEnd?.();
          URL.revokeObjectURL(url);
          audioRef.current = null;
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          onEnd?.();
          URL.revokeObjectURL(url);
          audioRef.current = null;
        };

        await audio.play();
      } catch (error) {
        console.warn("High-quality TTS failed, falling back to browser synthesis:", error);
        
        // Final fallback to browser SpeechSynthesis
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(
            (v) => v.name.includes("Google US English") || v.lang.startsWith("en-US")
          );

          if (preferredVoice) utterance.voice = preferredVoice;
          utterance.rate = 1.0;
          utterance.pitch = 0.9;

          utterance.onstart = () => {
            setIsSpeaking(true);
            onStart?.();
          };
          utterance.onend = () => {
            setIsSpeaking(false);
            onEnd?.();
          };
          utterance.onerror = () => {
            setIsSpeaking(false);
            onEnd?.();
          };

          window.speechSynthesis.speak(utterance);
        } else {
          setIsSpeaking(false);
          onEnd?.();
        }
      }
    },
    [isMuted, onStart, onEnd, stop]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { isSpeaking, speak, stop };
}
