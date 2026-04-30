"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Candy,
  ExternalLink,
  Keyboard,
  Loader2,
  RotateCcw,
  Send,
  ShieldAlert,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { publicConfig } from "@/lib/config.client";
import { cn } from "@/lib/utils";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";

type AssistantCta = {
  href: string;
  label: string;
  external?: boolean;
};

type AssistantMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  cta?: AssistantCta;
};

type PromptChip = {
  id: string;
  label: string;
  prompt: string;
};

type ChatMode = "copilot" | "websocket";

const promptChips: PromptChip[] = [
  {
    id: "about",
    label: "Who is Nhlanhla?",
    prompt: "Who is Nhlanhla Junior Malaza?",
  },
  {
    id: "services",
    label: "Services",
    prompt: "What services do you offer?",
  },
  {
    id: "skills",
    label: "Tech stack",
    prompt: "What technologies do you work with?",
  },
  {
    id: "projects",
    label: "Projects",
    prompt: "Can I see the projects?",
  },
  {
    id: "contact",
    label: "Contact",
    prompt: "How can I get in touch?",
  },
  {
    id: "resume",
    label: "Resume",
    prompt: "Can I view the resume?",
  },
];

const omoiStatuses = [
  "Kumogakure's finest... I suppose.",
  "Munching on a grape lollipop...",
  "Overthinking server stability...",
  "Wondering what if the internet disappears...",
  "Polishing my sword... just in case.",
  "Calculating worst-case scenarios...",
];

const loadingMessages = [
  "Overthinking every possibility...",
  "Imagining worst-case scenarios...",
  "Consulting the clouds...",
  "Checking for cosmic ray interference...",
  "Trying not to panic...",
  "What if I give the wrong answer?",
];

const initialMessages: AssistantMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "I-I'm Omoi. I've been assigned to protect Nhlanhla's portfolio... but what if I fail? What if a server explodes right now? *Munch*... This lollipop is the only thing keeping me sane. Ask me about his services, skills, or projects. I'll do my best to answer... if the world doesn't end first.",
  },
];

const ctaBaseClassName =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all";

const isDev = process.env.NODE_ENV === "development";

export const FloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWsTyping, setIsWsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [statusIndex, setStatusIndex] = useState(0);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("chat-muted") === "true";
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [visibleChips, setVisibleChips] = useState<PromptChip[]>(promptChips);
  const messagesRef = useRef<HTMLDivElement>(null);
  const messageSequenceRef = useRef(0);
  const lastAssistantContentRef = useRef("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle assistant with Cmd/Ctrl + K
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Close with Escape
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
      // Reset conversation with Cmd/Ctrl + L (only when open)
      if ((event.metaKey || event.ctrlKey) && event.key === "l" && isOpen) {
        event.preventDefault();
        resetConversation();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Cycle status messages
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % omoiStatuses.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Cycle loading messages
  useEffect(() => {
    if (!isLoading && !isWsTyping) return;
    const interval = setInterval(() => {
      setLoadingIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading, isWsTyping]);

  // Dev-only: chat mode toggle (persisted in sessionStorage)
  const [chatMode, setChatMode] = useState<ChatMode>(() => {
    if (!isDev) return "copilot";
    return (
      (typeof window !== "undefined" &&
        (sessionStorage.getItem("chat-mode") as ChatMode)) ||
      "copilot"
    );
  });

  // Speech synthesis via Edge TTS (neural voices)
  const speak = useCallback(
    async (text: string) => {
      if (isMuted || !text || typeof window === "undefined") return;

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      try {
        setIsSpeaking(true);

        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          throw new Error("TTS API failed");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
          audioRef.current = null;
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
          audioRef.current = null;
        };

        await audio.play();
      } catch (error) {
        // Fallback to browser SpeechSynthesis
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(text);

          // Try to find a nice voice
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(
            (v) =>
              v.name.includes("Google US English") ||
              v.name.includes("Male") ||
              v.lang.startsWith("en-US"),
          );

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }

          utterance.rate = 1.0;
          utterance.pitch = 0.9; // Slightly lower pitch for Omoi's anxious/muttering vibe

          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);

          window.speechSynthesis.speak(utterance);
        } else {
          setIsSpeaking(false);
        }
      }
    },
    [isMuted],
  );

  // Stop speaking when panel closes
  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    }
  }, [isOpen]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem("chat-muted", String(next));
      if (next && audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setIsSpeaking(false);
      }
      return next;
    });
  }, []);

  const wsUrl = process.env.NEXT_PUBLIC_WS_CHAT_URL || "";
  const useWebSocket = isDev && chatMode === "websocket" && !!wsUrl;

  const handleWsMessage = useCallback(
    (content: string, type: "response" | "error") => {
      messageSequenceRef.current += 1;
      const messageId = `message-${messageSequenceRef.current}`;

      // Parse CTA from response if present
      const ctaRegex = /\[CTA:(.+?)\|(.+?)(?:\|(external))?\]\s*$/;
      const ctaMatch = content.match(ctaRegex);
      let messageContent = content;
      let cta: AssistantCta | undefined;

      if (ctaMatch) {
        messageContent = content.replace(ctaRegex, "").trim();
        cta = {
          label: ctaMatch[1],
          href: ctaMatch[2],
          external: ctaMatch[3] === "external",
        };
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `${messageId}-assistant`,
          role: "assistant",
          content: messageContent,
          cta,
        },
      ]);
      setIsLoading(false);
      speak(messageContent);
    },
    [speak],
  );

  const { isConnected, sendMessage } = useChatWebSocket({
    url: wsUrl,
    onMessage: handleWsMessage,
    onTyping: setIsWsTyping,
    onConnectionChange: () => {},
    conversationId,
    onConversationIdChange: setConversationId,
  });

  useEffect(() => {
    if (!messagesRef.current) {
      return;
    }

    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isOpen, isWsTyping]);

  const appendConversation = async (userPrompt: string) => {
    const trimmedPrompt = userPrompt.trim();
    if (!trimmedPrompt) {
      return;
    }

    messageSequenceRef.current += 1;
    const messageId = `message-${messageSequenceRef.current}`;

    // Add user message immediately
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `${messageId}-user`,
        role: "user",
        content: trimmedPrompt,
      },
    ]);
    setPrompt("");
    setIsLoading(true);
    setIsOpen(true);

    // WebSocket mode
    if (useWebSocket) {
      sendMessage(trimmedPrompt);
      return;
    }

    // Copilot mode (GitHub Models API)
    try {
      const apiMessages = [
        ...messages,
        { role: "user" as const, content: trimmedPrompt },
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const responseContent = data.fallback
        ? `${data.content}\n\n_(AI is temporarily unavailable — using quick answers)_`
        : data.content;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `${messageId}-assistant`,
          role: "assistant",
          content: responseContent,
          cta: data.cta,
        },
      ]);
      speak(responseContent);
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `${messageId}-assistant`,
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again or contact Nhlanhla directly.",
          cta: {
            href: "/contact",
            label: "Contact Nhlanhla",
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (nextPrompt: string, chipId: string) => {
    setVisibleChips((prev) => prev.filter((c) => c.id !== chipId));
    appendConversation(nextPrompt);
  };

  const resetConversation = () => {
    setMessages(initialMessages);
    setPrompt("");
    setConversationId(undefined);
    setVisibleChips(promptChips);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    }
  };

  const toggleChatMode = () => {
    if (!isDev) return;
    const nextMode = chatMode === "copilot" ? "websocket" : "copilot";
    setChatMode(nextMode);
    sessionStorage.setItem("chat-mode", nextMode);
    resetConversation();
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const activeLoading = isLoading || isWsTyping;

  return (
    <div className="fixed bottom-4 right-4 z-[45] sm:bottom-6 sm:right-6">
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.section
            id="copilot-assistant-panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-4 flex w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.75rem] border border-border bg-background/95 shadow-2xl backdrop-blur-xl"
            aria-label="AI virtual assistant"
          >
            <div className="gradient-bg relative overflow-hidden px-4 py-4 text-primary-foreground">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_45%)]" />
              <div className="relative flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-background/15 ring-1 ring-white/20">
                  <motion.div
                    animate={
                      activeLoading
                        ? {
                            x: [0, -1, 1, -1, 1, 0],
                            y: [0, 1, -1, 1, -1, 0],
                          }
                        : {}
                    }
                    transition={{ repeat: Infinity, duration: 0.2 }}
                  >
                    <Image
                      src="/omoi-mascot-v2.png"
                      alt="Omoi"
                      width={48}
                      height={48}
                      className="h-12 w-12 object-contain"
                    />
                  </motion.div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Omoi</p>
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                    <Candy className="h-3 w-3 text-pink-300/80" />
                  </div>
                  <motion.p
                    key={statusIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-primary-foreground/80"
                  >
                    {useWebSocket
                      ? `Llama 3.2${isConnected ? " — connected" : " — connecting..."}`
                      : isSpeaking
                        ? "Speaking..."
                        : omoiStatuses[statusIndex]}
                  </motion.p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("open-shortcuts"))}
                    className="hidden md:flex rounded-full p-2 text-primary-foreground/80 transition-colors hover:bg-background/15 hover:text-primary-foreground"
                    aria-label="View keyboard shortcuts"
                    title="Keyboard shortcuts (?)"
                  >
                    <Keyboard className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    className={cn(
                      "rounded-full p-2 text-primary-foreground/80 transition-colors hover:bg-background/15 hover:text-primary-foreground",
                      isSpeaking && "text-primary-foreground animate-pulse",
                    )}
                    aria-label={isMuted ? "Unmute assistant" : "Mute assistant"}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetConversation}
                    className="rounded-full p-2 text-primary-foreground/80 transition-colors hover:bg-background/15 hover:text-primary-foreground"
                    aria-label="Reset assistant conversation"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-2 text-primary-foreground/80 transition-colors hover:bg-background/15 hover:text-primary-foreground"
                    aria-label="Close assistant"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div
              ref={messagesRef}
              className="max-h-[22rem] space-y-3 overflow-y-auto bg-card/30 px-4 py-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                      message.role === "user"
                        ? "gradient-bg text-primary-foreground"
                        : "border border-border bg-background text-foreground",
                    )}
                  >
                    <p>{message.content}</p>

                    {message.cta ? (
                      message.cta.external ? (
                        <a
                          href={message.cta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            ctaBaseClassName,
                            "mt-3 bg-accent/10 text-accent hover:bg-accent/20",
                          )}
                        >
                          {message.cta.label}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <Link
                          href={message.cta.href}
                          className={cn(
                            ctaBaseClassName,
                            "mt-3 bg-accent/10 text-accent hover:bg-accent/20",
                          )}
                        >
                          {message.cta.label}
                        </Link>
                      )
                    ) : null}
                  </div>
                </div>
              ))}

              {activeLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[88%] rounded-3xl border border-border bg-background px-4 py-3 text-sm shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <motion.span
                        key={loadingIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {useWebSocket
                          ? "Llama is thinking..."
                          : loadingMessages[loadingIndex]}
                      </motion.span>
                      {!useWebSocket && (
                        <ShieldAlert className="h-3 w-3 text-amber-500 animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border bg-background px-4 py-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Ask anything
              </p>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  appendConversation(prompt);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Ask about skills, services, projects, contact..."
                  disabled={activeLoading}
                  className="h-11 flex-1 rounded-full border border-border bg-card px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent/50 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={activeLoading || !prompt.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full gradient-bg text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                  aria-label="Send assistant message"
                >
                  {activeLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>

              <div className="mt-4 flex flex-wrap gap-2">
                {visibleChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleQuickPrompt(chip.prompt, chip.id)}
                    disabled={activeLoading}
                    className="rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-50"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dev-only: mode toggle */}
            {isDev && (
              <button
                type="button"
                onClick={toggleChatMode}
                className="absolute bottom-0 left-4 flex items-center gap-1 rounded-t-md bg-muted px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                title={`Switch to ${chatMode === "copilot" ? "WebSocket (Llama)" : "Copilot"}`}
              >
                <Zap
                  className={cn("h-3 w-3", useWebSocket && "text-green-500")}
                />
                {chatMode === "copilot" ? "Copilot" : "Llama"}
              </button>
            )}
          </motion.section>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="group relative ml-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-background/90 shadow-[0_20px_60px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-transform"
        aria-expanded={isOpen}
        aria-controls="copilot-assistant-panel"
        aria-label={isOpen ? "Hide AI assistant" : "Show AI assistant"}
      >
        <span className="gradient-bg absolute inset-0 rounded-full opacity-20 blur-md transition-opacity group-hover:opacity-30" />
        <span className="absolute inset-0 rounded-full border border-white/10" />
        <Image
          src="/omoi-mascot-v2.png"
          alt="AI assistant"
          width={80}
          height={80}
          className="relative h-20 w-20 object-contain"
          priority
        />
        {!isOpen ? (
          <span className="absolute -right-0.5 top-0 inline-flex h-3.5 w-3.5 rounded-full border-2 border-background bg-primary" />
        ) : null}
      </motion.button>
    </div>
  );
};
