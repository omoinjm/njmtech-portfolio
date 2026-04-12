"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, RotateCcw, Send, Sparkles, X } from "lucide-react";
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

type KnowledgeEntry = {
  id: string;
  patterns: string[];
  response: string;
  cta?: AssistantCta;
};

type AssistantReply = {
  content: string;
  cta?: AssistantCta;
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

const knowledgeBase: KnowledgeEntry[] = [
  {
    id: "about",
    patterns: [
      "who is nhlanhla",
      "who are you",
      "about nhlanhla",
      "about you",
      "tell me about",
      "bio",
      "background",
      "introduce",
    ],
    response:
      "Nhlanhla Junior Malaza is a Johannesburg-based software developer, DevOps engineer, and AI integrations specialist. This portfolio highlights his full-stack work, technical skills, services, and ways to get in touch for freelance or full-time opportunities.",
    cta: {
      href: "/#home",
      label: "Go to home section",
    },
  },
  {
    id: "services",
    patterns: [
      "services",
      "what do you offer",
      "what can you do",
      "expertise",
      "help with",
      "build for me",
      "offerings",
    ],
    response:
      "Nhlanhla offers web development, mobile development, cloud solutions, AI integrations, backend engineering, and DevOps with CI/CD. The site’s services section gives a quick overview of how he helps bring products to life with modern tooling.",
    cta: {
      href: "/#services",
      label: "View services",
    },
  },
  {
    id: "skills",
    patterns: [
      "skills",
      "tech stack",
      "technologies",
      "tools",
      "frameworks",
      "languages",
      "stack",
      "what do you use",
    ],
    response:
      "His stack includes React, Next.js, Angular, TypeScript, C#/.NET, Python, PostgreSQL, MongoDB, Azure, Docker, Kubernetes, GraphQL, REST APIs, Git, and CI/CD. The skills section also highlights frontend, backend, database, and DevOps strengths.",
    cta: {
      href: "/#skills",
      label: "View skills",
    },
  },
  {
    id: "projects",
    patterns: [
      "projects",
      "portfolio",
      "work examples",
      "featured work",
      "case studies",
      "show me projects",
    ],
    response:
      "The projects page is the best place to explore featured work. It groups real portfolio pieces by category so visitors can quickly browse recent builds and live examples.",
    cta: {
      href: "/projects",
      label: "Open projects",
    },
  },
  {
    id: "contact",
    patterns: [
      "contact",
      "reach",
      "email",
      "phone",
      "message",
      "hire",
      "book",
      "talk",
      "speak",
      "work together",
    ],
    response:
      "Visitors can contact Nhlanhla through the contact page or directly via email at njmalaza@outlook.com and phone at +27 (72) 432-6766. The site also notes that he typically responds within 24 hours.",
    cta: {
      href: "/contact",
      label: "Open contact page",
    },
  },
  {
    id: "location",
    patterns: [
      "where are you based",
      "location",
      "where are you",
      "based in",
      "johannesburg",
      "south africa",
    ],
    response:
      "Nhlanhla is based in Johannesburg, South Africa. The portfolio is positioned around local and remote collaboration for software, DevOps, and AI integration work.",
    cta: {
      href: "/contact",
      label: "Contact Nhlanhla",
    },
  },
  {
    id: "resume",
    patterns: [
      "resume",
      "cv",
      "curriculum vitae",
      "download resume",
      "view resume",
    ],
    response:
      "Yes — the resume is available directly from the site. You can open it from the hero section or use the link below.",
    cta: {
      href: publicConfig.RESUME_URL,
      label: "Open resume",
      external: true,
    },
  },
  {
    id: "newsletter",
    patterns: [
      "newsletter",
      "subscribe",
      "updates",
      "join newsletter",
      "email updates",
    ],
    response:
      "The newsletter signup is on the home page. Visitors can subscribe there to receive web development updates, tech insights, and exclusive content.",
    cta: {
      href: "/#newsletter",
      label: "Go to newsletter",
    },
  },
  {
    id: "socials",
    patterns: [
      "github",
      "linkedin",
      "twitter",
      "socials",
      "social links",
      "profiles",
      "links hub",
    ],
    response:
      "The portfolio links out to Nhlanhla's social profiles and broader presence through the site navigation, contact page, and links hub.",
    cta: {
      href: "https://bio.njmtech.co.za/",
      label: "Open links hub",
      external: true,
    },
  },
  {
    id: "site-help",
    patterns: [
      "site",
      "website",
      "navigate",
      "find",
      "where can i",
      "where is",
      "pages",
      "sections",
      "what is on this site",
    ],
    response:
      "This site is organized around the home page, skills, services, newsletter, projects, and contact. If you want, ask me about Nhlanhla, his tech stack, services, projects, resume, or how to get in touch and I’ll point you to the right place.",
    cta: {
      href: "/#home",
      label: "Browse the site",
    },
  },
];

const initialMessages: AssistantMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi — I’m your NJMTECH site assistant. Ask me anything about Nhlanhla Junior Malaza, his services, skills, projects, resume, contact details, or where to find things on this site.",
  },
];

const ctaBaseClassName =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all";

const normalizePrompt = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

const getAssistantReply = (prompt: string): AssistantReply => {
  const normalizedPrompt = normalizePrompt(prompt);

  if (!normalizedPrompt) {
    return {
      content:
        "Ask me about Nhlanhla, his services, projects, skills, resume, contact details, or how to use the site.",
    };
  }

  if (
    normalizedPrompt.startsWith("hi") ||
    normalizedPrompt.startsWith("hello") ||
    normalizedPrompt.startsWith("hey")
  ) {
    return {
      content:
        "Hi there — I can help with questions about Nhlanhla, his portfolio, services, skills, projects, resume, contact details, and site navigation.",
    };
  }

  if (
    normalizedPrompt.includes("thank you") ||
    normalizedPrompt.includes("thanks")
  ) {
    return {
      content:
        "You’re welcome. If you want, you can ask about Nhlanhla’s background, services, projects, resume, or contact options.",
    };
  }

  let bestMatch: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    const score = entry.patterns.reduce((total, pattern) => {
      return normalizedPrompt.includes(pattern)
        ? total + pattern.split(" ").length + 1
        : total;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch) {
    return {
      content: bestMatch.response,
      cta: bestMatch.cta,
    };
  }

  return {
    content:
      "I can help with Nhlanhla’s background, skills, services, projects, resume, newsletter, contact details, socials, or general site navigation. Try asking something like “What services do you offer?” or “How can I get in touch?”",
  };
};

export const FloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);
  const [prompt, setPrompt] = useState("");
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

  const appendConversation = (userPrompt: string) => {
    const trimmedPrompt = userPrompt.trim();
    if (!trimmedPrompt) {
      return;
    }

    messageSequenceRef.current += 1;
    const messageId = `message-${messageSequenceRef.current}`;
    const reply = getAssistantReply(trimmedPrompt);

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `${messageId}-user`,
        role: "user",
        content: trimmedPrompt,
      },
      {
        id: `${messageId}-assistant`,
        role: "assistant",
        content: reply.content,
        cta: reply.cta,
      },
    ]);
    setPrompt("");
    setIsOpen(true);
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
                    Ask about Nhlanhla or anything on this site.
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
                  className="h-11 flex-1 rounded-full border border-border bg-card px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent/50"
                />
                <button
                  type="submit"
                  className="flex h-11 w-11 items-center justify-center rounded-full gradient-bg text-primary-foreground transition-opacity hover:opacity-90"
                  aria-label="Send assistant message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-4 flex flex-wrap gap-2">
                {promptChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleQuickPrompt(chip.prompt)}
                    className="rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:border-accent/50 hover:text-accent"
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
