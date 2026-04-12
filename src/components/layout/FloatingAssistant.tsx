"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, RotateCcw, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type AssistantAction = {
  id: string;
  label: string;
  prompt: string;
  reply: string;
  href: string;
  ctaLabel: string;
  external?: boolean;
};

type AssistantMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  cta?: {
    href: string;
    label: string;
    external?: boolean;
  };
};

const assistantActions: AssistantAction[] = [
  {
    id: "projects",
    label: "Show projects",
    prompt: "Show me the featured projects.",
    reply:
      "Absolutely — the projects page highlights the latest builds, categories, and live work samples.",
    href: "/projects",
    ctaLabel: "Open projects",
  },
  {
    id: "contact",
    label: "Contact info",
    prompt: "How can I get in touch?",
    reply:
      "The contact page has the direct form plus email, phone, and location details if you want to start a conversation.",
    href: "/contact",
    ctaLabel: "Open contact page",
  },
  {
    id: "newsletter",
    label: "Join newsletter",
    prompt: "Take me to the newsletter section.",
    reply:
      "Sure — I can jump you straight to the newsletter signup on the home page.",
    href: "/#newsletter",
    ctaLabel: "Go to newsletter",
  },
  {
    id: "links",
    label: "Links hub",
    prompt: "Open the full links hub.",
    reply:
      "Here you go — the links hub collects the broader NJMTECH presence in one place.",
    href: "https://bio.njmtech.co.za/",
    ctaLabel: "Open links hub",
    external: true,
  },
];

const initialMessages: AssistantMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hey, I'm Copilot — your floating guide for NJMTECH. I can help visitors jump to projects, contact details, the newsletter, or the full links hub.",
  },
];

const ctaBaseClassName =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all";

export const FloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);
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

  const handleAction = (action: AssistantAction) => {
    messageSequenceRef.current += 1;
    const messageId = `${action.id}-${messageSequenceRef.current}`;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `${messageId}-user`,
        role: "user",
        content: action.prompt,
      },
      {
        id: `${messageId}-assistant`,
        role: "assistant",
        content: action.reply,
        cta: {
          href: action.href,
          label: action.ctaLabel,
          external: action.external,
        },
      },
    ]);

    setIsOpen(true);
  };

  const resetConversation = () => {
    setMessages(initialMessages);
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
            className="mb-4 flex w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.75rem] border border-border bg-background/95 shadow-2xl backdrop-blur-xl"
            aria-label="Copilot virtual assistant"
          >
            <div className="gradient-bg relative overflow-hidden px-4 py-4 text-primary-foreground">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_45%)]" />
              <div className="relative flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-background/15 ring-1 ring-white/20">
                  <Image
                    src="/copilot-mascot.png"
                    alt="GitHub Copilot mascot"
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Copilot Assistant</p>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-primary-foreground/80">
                    Quick site guidance from the bottom-right corner.
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
                      "max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm",
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
            </div>

            <div className="border-t border-border bg-background px-4 py-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Quick prompts
              </p>
              <div className="flex flex-wrap gap-2">
                {assistantActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleAction(action)}
                    className="rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    {action.label}
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
        aria-label={isOpen ? "Hide Copilot assistant" : "Show Copilot assistant"}
      >
        <span className="gradient-bg absolute inset-0 rounded-full opacity-20 blur-md transition-opacity group-hover:opacity-30" />
        <span className="absolute inset-0 rounded-full border border-white/10" />
        <Image
          src="/copilot-mascot.png"
          alt="GitHub Copilot mascot"
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
