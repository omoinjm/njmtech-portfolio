"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Candy,
  ExternalLink,
  Keyboard,
  Loader2,
  RotateCcw,
  Send,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/hooks/use-speech";
import { useChat } from "@/hooks/use-chat";
import { ChatResponse } from "@/services/ai/types";
import { OmoiSprite } from "@/components/layout/OmoiSprite";
import {
  dispatchGuideDialog,
  GUIDE_DIALOG_EVENTS,
  resolveOmoiState,
  type GuideDialogEvent,
} from "@/lib/omoi-states";

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

type GuideChip = {
  id: string;
  label: string;
  event: GuideDialogEvent;
};

type ChatMode = "copilot" | "websocket";

const OMOI_GUIDE_TIP_KEY = "omoi-guide-tip-seen";

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
  const t = useTranslations("assistant");

  const promptChips: PromptChip[] = [
    { id: "about", label: t("chip_about"), prompt: "Who is Nhlanhla Junior Malaza?" },
    { id: "services", label: t("chip_services"), prompt: "What services do you offer?" },
    { id: "skills", label: t("chip_skills"), prompt: "What technologies do you work with?" },
    { id: "projects", label: t("chip_projects"), prompt: "Can I see the projects?" },
    { id: "contact", label: t("chip_contact"), prompt: "How can I get in touch?" },
    { id: "resume", label: t("chip_resume"), prompt: "Can I view the resume?" },
  ];

  const guideChips: GuideChip[] = useMemo(
    () => [
      { id: "guide-shortcuts", label: t("chip_site_shortcuts"), event: "open-shortcuts" },
      { id: "guide-seo", label: t("chip_seo_guide"), event: "open-seo-guide" },
      { id: "guide-keyboard", label: t("chip_keyboard_guide"), event: "open-keyboard-guide" },
    ],
    [t],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);
  const [prompt, setPrompt] = useState("");
  const [isWsTyping, setIsWsTyping] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [guideHighlight, setGuideHighlight] = useState(false);
  const [showGuideTip, setShowGuideTip] = useState(false);
  const [visibleGuideChips, setVisibleGuideChips] = useState<GuideChip[]>(guideChips);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("chat-muted") === "true";
  });

  const [visibleChips, setVisibleChips] = useState<PromptChip[]>(promptChips);
  const messagesRef = useRef<HTMLDivElement>(null);
  const messageSequenceRef = useRef(0);
  const guideHighlightTimeoutRef = useRef<number | null>(null);

  const [chatMode, setChatMode] = useState<ChatMode>(() => {
    if (!isDev) return "copilot";
    return (typeof window !== "undefined" && (sessionStorage.getItem("chat-mode") as ChatMode)) || "copilot";
  });

  const { isSpeaking, speak, stop } = useSpeech({ isMuted });

  const markGuideTipSeen = useCallback(() => {
    sessionStorage.setItem(OMOI_GUIDE_TIP_KEY, "1");
    setShowGuideTip(false);
  }, []);

  const pulseGuideState = useCallback(() => {
    if (guideHighlightTimeoutRef.current) {
      window.clearTimeout(guideHighlightTimeoutRef.current);
    }
    setGuideHighlight(true);
    guideHighlightTimeoutRef.current = window.setTimeout(() => {
      setGuideHighlight(false);
    }, 2400);
  }, []);

  const openGuide = useCallback(
    (event: GuideDialogEvent, chipId?: string) => {
      markGuideTipSeen();
      pulseGuideState();
      dispatchGuideDialog(event);
      if (chipId) {
        setVisibleGuideChips((prev) => prev.filter((chip) => chip.id !== chipId));
      }
    },
    [markGuideTipSeen, pulseGuideState],
  );

  const handleAssistantResponse = useCallback(
    (response: ChatResponse) => {
      messageSequenceRef.current += 1;
      const content = response.content;

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${messageSequenceRef.current}`,
          role: "assistant",
          content,
          cta: response.cta,
        },
      ]);

      speak(content);
    },
    [speak],
  );

  const handleChatError = useCallback((err: string) => {
    console.error("Chat Error:", err);
    setMessages((prev) => [
      ...prev,
      {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again or contact Nhlanhla directly.",
        cta: { href: "/contact", label: "Contact Nhlanhla" },
      },
    ]);
  }, []);

  const { sendMessage, isLoading } = useChat({
    mode: chatMode,
    wsUrl: process.env.NEXT_PUBLIC_WS_CHAT_URL,
    onMessage: handleAssistantResponse,
    onTyping: setIsWsTyping,
    onError: handleChatError,
  });

  const appendConversation = async (userPrompt: string) => {
    const trimmed = userPrompt.trim();
    if (!trimmed) return;

    messageSequenceRef.current += 1;
    setMessages((prev) => [...prev, { id: `user-${messageSequenceRef.current}`, role: "user", content: trimmed }]);
    setPrompt("");
    setIsOpen(true);

    sendMessage([...messages, { role: "user", content: trimmed }]);
  };

  const handleQuickPrompt = (nextPrompt: string, chipId: string) => {
    setVisibleChips((prev) => prev.filter((c) => c.id !== chipId));
    appendConversation(nextPrompt);
  };

  const resetConversation = () => {
    setMessages(initialMessages);
    setPrompt("");
    setVisibleChips(promptChips);
    setVisibleGuideChips(guideChips);
    stop();
  };

  const toggleChatMode = () => {
    if (!isDev) return;
    const nextMode = chatMode === "copilot" ? "websocket" : "copilot";
    setChatMode(nextMode);
    sessionStorage.setItem("chat-mode", nextMode);
    resetConversation();
  };

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem("chat-muted", String(next));
      if (next) stop();
      return next;
    });
  }, [stop]);

  useEffect(() => {
    setVisibleGuideChips(guideChips);
  }, [guideChips]);

  useEffect(() => {
    if (sessionStorage.getItem(OMOI_GUIDE_TIP_KEY) !== "1") {
      setShowGuideTip(true);
    }
  }, []);

  useEffect(() => {
    const handleGuideOpened = () => markGuideTipSeen();
    GUIDE_DIALOG_EVENTS.forEach((event) => window.addEventListener(event, handleGuideOpened));
    return () => {
      GUIDE_DIALOG_EVENTS.forEach((event) => window.removeEventListener(event, handleGuideOpened));
    };
  }, [markGuideTipSeen]);

  useEffect(() => {
    return () => {
      if (guideHighlightTimeoutRef.current) {
        window.clearTimeout(guideHighlightTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const interval = window.setInterval(() => setStatusIndex((p) => (p + 1) % omoiStatuses.length), 5000);
    return () => window.clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (!isLoading && !isWsTyping) return;
    const interval = window.setInterval(() => setLoadingIndex((p) => (p + 1) % loadingMessages.length), 2500);
    return () => window.clearInterval(interval);
  }, [isLoading, isWsTyping]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (event.key === "Escape" && isOpen) setIsOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key === "l" && isOpen) {
        event.preventDefault();
        resetConversation();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen, isWsTyping]);

  const activeLoading = isLoading || isWsTyping;
  const omoiState = resolveOmoiState({
    isOpen,
    isLoading: activeLoading,
    isSpeaking,
    guideHighlight,
  });

  const statusLabel =
    chatMode === "websocket"
      ? `Llama 3.2 — ${activeLoading ? "thinking" : "ready"}`
      : isSpeaking
        ? t("status_speaking")
        : guideHighlight
          ? t("status_guide")
          : omoiStatuses[statusIndex];

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
                  <OmoiSprite state={omoiState} size="sm" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Omoi</p>
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                    <Candy className="h-3 w-3 text-pink-300/80" />
                  </div>
                  <motion.p
                    key={statusLabel}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-primary-foreground/80"
                  >
                    {statusLabel}
                  </motion.p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openGuide("open-shortcuts")}
                    className="hidden md:flex rounded-full p-2 text-primary-foreground/80 transition-colors hover:bg-background/15 hover:text-primary-foreground"
                    aria-label={t("open_site_shortcuts")}
                    title={t("open_site_shortcuts")}
                  >
                    <Keyboard className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openGuide("open-seo-guide")}
                    className="hidden md:flex rounded-full p-2 text-primary-foreground/80 transition-colors hover:bg-background/15 hover:text-primary-foreground"
                    aria-label={t("open_seo_guide")}
                    title={t("open_seo_guide")}
                  >
                    <TrendingUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openGuide("open-keyboard-guide")}
                    className="hidden md:flex rounded-full p-2 text-primary-foreground/80 transition-colors hover:bg-background/15 hover:text-primary-foreground"
                    aria-label={t("open_keyboard_guide")}
                    title={t("open_keyboard_guide")}
                  >
                    <BookOpen className="h-4 w-4" />
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
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
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

            <div ref={messagesRef} className="max-h-[22rem] space-y-3 overflow-y-auto bg-card/30 px-4 py-4">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                      message.role === "user"
                        ? "gradient-bg text-primary-foreground"
                        : "border border-border bg-background text-foreground",
                    )}
                  >
                    <p>{message.content}</p>
                    {message.cta && (
                      <Link
                        href={message.cta.href}
                        target={message.cta.external ? "_blank" : undefined}
                        className={cn(ctaBaseClassName, "mt-3 bg-accent/10 text-accent hover:bg-accent/20")}
                      >
                        {message.cta.label}
                        {message.cta.external && <ExternalLink className="h-4 w-4" />}
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {activeLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[88%] rounded-3xl border border-border bg-background px-4 py-3 text-sm shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <motion.span key={loadingIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {chatMode === "websocket" ? "Llama is thinking..." : loadingMessages[loadingIndex]}
                      </motion.span>
                      {chatMode !== "websocket" && <ShieldAlert className="h-3 w-3 text-amber-500 animate-pulse" />}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border bg-background px-4 py-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{t("ask_anything")}</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  appendConversation(prompt);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t("placeholder")}
                  disabled={activeLoading}
                  className="h-11 flex-1 rounded-full border border-border bg-card px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent/50 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={activeLoading || !prompt.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full gradient-bg text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                  aria-label="Send assistant message"
                >
                  {activeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </form>

              {!activeLoading && visibleGuideChips.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {t("guide_section")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {visibleGuideChips.map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => openGuide(chip.event, chip.id)}
                        className="rounded-full border border-accent/20 bg-accent/5 px-3 py-2 text-sm text-foreground transition-colors hover:border-accent/50 hover:text-accent"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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

            {isDev && (
              <button
                type="button"
                onClick={toggleChatMode}
                className="absolute bottom-0 left-4 flex items-center gap-1 rounded-t-md bg-muted px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                title={`Switch to ${chatMode === "copilot" ? "WebSocket (Llama)" : "Copilot"}`}
              >
                <Zap className={cn("h-3 w-3", chatMode === "websocket" && "text-green-500")} />
                {chatMode === "copilot" ? "Copilot" : "Llama"}
              </button>
            )}
          </motion.section>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && showGuideTip && (
          <motion.div
            initial={{ opacity: 0, y: 8, x: 8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="pointer-events-auto absolute bottom-[6.75rem] right-0 z-10 hidden max-w-[14rem] rounded-2xl border border-border bg-background/95 px-3 py-2 text-left text-xs text-muted-foreground shadow-lg backdrop-blur md:block"
          >
            <p>{t("guide_tip")}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => openGuide("open-shortcuts")}
                className="rounded-full bg-accent/10 px-2 py-1 text-[11px] font-medium text-accent hover:bg-accent/20"
              >
                {t("chip_site_shortcuts")}
              </button>
              <button
                type="button"
                onClick={markGuideTipSeen}
                className="rounded-full px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                {t("guide_tip_dismiss")}
              </button>
            </div>
          </motion.div>
        )}
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
        <OmoiSprite state={omoiState} size="lg" float className="relative" />
        {!isOpen && showGuideTip && (
          <span className="absolute -right-0.5 top-0 inline-flex h-3.5 w-3.5 rounded-full border-2 border-background bg-primary" />
        )}
      </motion.button>
    </div>
  );
};
