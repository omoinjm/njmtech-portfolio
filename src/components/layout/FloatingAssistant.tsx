"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Loader2, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { publicConfig } from "@/lib/config.client";
import { cn } from "@/lib/utils";

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

const initialMessages: AssistantMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi — I'm your NJMTECH AI assistant. Ask me anything about Nhlanhla Junior Malaza, his services, skills, projects, resume, contact details, or where to find things on this site.",
  },
];

const ctaBaseClassName =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all";

export const FloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const messageSequenceRef = useRef(0);

  useEffect(() => {
    if (!messagesRef.current) {
      return;
    }

    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isOpen]);

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

    try {
      // Build messages array for API (include conversation history)
      const apiMessages = [...messages, { role: "user" as const, content: trimmedPrompt }];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add assistant response
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `${messageId}-assistant`,
          role: "assistant",
          content: data.fallback
            ? `${data.content}\n\n_(AI is temporarily unavailable — using quick answers)_`
            : data.content,
          cta: data.cta,
        },
      ]);
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `${messageId}-assistant`,
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again or contact Nhlanhla directly.",
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

  const handleQuickPrompt = (nextPrompt: string) => {
    appendConversation(nextPrompt);
  };

  const resetConversation = () => {
    setMessages(initialMessages);
    setPrompt("");
  };

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
                  <Image
                    src="/copilot-mascot.png"
                    alt="AI assistant"
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">AI Assistant</p>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-primary-foreground/80">
                    Powered by Gemini — ask about anything on this site.
                  </p>
                </div>

                <div className="flex items-center gap-1">
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

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[88%] rounded-3xl border border-border bg-background px-4 py-3 text-sm shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
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
                  disabled={isLoading}
                  className="h-11 flex-1 rounded-full border border-border bg-card px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent/50 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full gradient-bg text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                  aria-label="Send assistant message"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>

              <div className="mt-4 flex flex-wrap gap-2">
                {promptChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleQuickPrompt(chip.prompt)}
                    disabled={isLoading}
                    className="rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-50"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="group relative ml-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-background/90 shadow-[0_20px_60px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-transform"
        aria-expanded={isOpen}
        aria-controls="copilot-assistant-panel"
        aria-label={isOpen ? "Hide AI assistant" : "Show AI assistant"}
      >
        <span className="gradient-bg absolute inset-0 rounded-full opacity-20 blur-md transition-opacity group-hover:opacity-30" />
        <span className="absolute inset-0 rounded-full border border-white/10" />
        <Image
          src="/copilot-mascot.png"
          alt="AI assistant"
          width={52}
          height={52}
          className="relative h-12 w-12 object-contain"
          priority
        />
        {!isOpen ? (
          <span className="absolute -right-0.5 top-0 inline-flex h-3.5 w-3.5 rounded-full border-2 border-background bg-primary" />
        ) : null}
      </motion.button>
    </div>
  );
};
