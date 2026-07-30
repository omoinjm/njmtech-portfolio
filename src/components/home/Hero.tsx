"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { publicConfig } from "@/lib/config.client";
import { PdfPreviewDialog } from "@/components/dialog/PdfPreviewDialog";

const FOCUS_KEYS = ["focus_web", "focus_ops", "focus_ai"] as const;

export const Hero = () => {
  const t = useTranslations("hero");
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [showInteractionPrompt, setShowInteractionPrompt] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowInteractionPrompt(false);
    }, 10000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section
      id="home"
      data-keyboard-section="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-[1]">
        <div className="absolute top-[18%] -left-24 h-80 w-80 rounded-full bg-accent/18 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-[16%] right-0 h-96 w-96 rounded-full bg-primary/16 blur-3xl animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-card/60 border border-border/80 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {t("welcome_badge")}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground/70 mb-3">
              NJMTech
            </p>
            <h1 className="text-[2.75rem] md:text-6xl lg:text-[4.25rem] font-bold leading-[1.05] tracking-tight">
              <span className="gradient-text block">{t("name")}</span>
              <span className="block mt-3 text-foreground/95 font-semibold text-[1.65rem] md:text-3xl lg:text-[2.35rem] leading-snug">
                {t("headline")}
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-base md:text-lg text-muted-foreground/90 max-w-xl mx-auto lg:mx-0 mb-7 leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52 }}
            className="flex flex-wrap gap-2 justify-center lg:justify-start mb-9"
          >
            {FOCUS_KEYS.map((key) => (
              <span
                key={key}
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-border/70 bg-background/40 text-muted-foreground"
              >
                {t(key)}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full border border-border bg-card/50 text-foreground font-semibold hover:bg-card transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              {t("cta_primary")}
            </Link>
            <button
              onClick={() => setIsResumeOpen(true)}
              className="px-8 py-4 rounded-full gradient-bg text-foreground font-semibold hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              {t("cta_resume")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-full max-w-md mx-auto">
            <AnimatePresence>
              {showInteractionPrompt ? (
                <motion.div
                  key="hero-interaction-card"
                  initial={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -28, scale: 0.92, filter: "blur(14px)" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="mx-auto max-w-sm text-center"
                >
                  <div className="relative flex justify-center">
                    <div className="absolute inset-x-12 top-3 h-20 rounded-full bg-accent/20 blur-3xl" />
                    <div className="relative text-6xl md:text-8xl font-bold gradient-text mb-4 drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                      {"⌨"}
                    </div>
                  </div>
                  <p className="text-balance text-sm uppercase tracking-[0.3em] text-foreground/45 mb-3">
                    {t("keyboard_label")}
                  </p>
                  <p className="text-balance text-base md:text-lg text-foreground/78">
                    {t("keyboard_desc")}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>

      <PdfPreviewDialog
        open={isResumeOpen}
        onOpenChange={setIsResumeOpen}
        pdfUrl={publicConfig.RESUME_URL}
      />
    </section>
  );
};
