"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Code, Sparkles, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { publicConfig } from "@/lib/config.client";
import { PdfPreviewDialog } from "@/components/dialog/PdfPreviewDialog";

const Hero3DScene = dynamic(
  () => import("./Hero3DScene").then((module) => module.Hero3DScene),
  {
    ssr: false,
    loading: () => <HeroVisualFallback />,
  },
);

const HeroVisualFallback = () => {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-background/70" />
      <div className="absolute inset-y-0 left-[8%] w-72 rounded-full bg-accent/10 blur-3xl animate-pulse-slow" />
      <div className="absolute inset-y-0 right-[10%] w-80 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />

      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[18%] right-[14%] p-4 rounded-xl bg-card/80 border border-border shadow-xl"
      >
        <Code className="w-8 h-8 text-accent" />
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[18%] left-[10%] p-4 rounded-xl bg-card/80 border border-border shadow-xl"
      >
        <Zap className="w-8 h-8 text-primary" />
      </motion.div>

      <motion.div
        animate={{ y: [-5, 15, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[44%] right-[30%] p-4 rounded-xl bg-card/80 border border-border shadow-xl"
      >
        <Sparkles className="w-8 h-8 text-accent" />
      </motion.div>
    </div>
  );
};

export const Hero = () => {
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
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      <div className="absolute inset-0 z-0">
        <Hero3DScene />
      </div>

      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-[1]">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-accent/5 to-primary/5 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/45 to-background/70" />
      </div>

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text Content */}
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">
              Welcome to my Portfolio
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="gradient-text">Nhlanhla Malaza</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-4"
          >
            Full Stack Developer & Tech Enthusiast
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8"
          >
            A passionate software developer, willing to learn and adapt to any software environment. I am always striving to improve myself and my skills. I enjoy working with others and within a team.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link href="/contact" className="px-8 py-4 rounded-full border border-border bg-card/50 text-foreground font-semibold hover:bg-card transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Get In Touch
            </Link>
            <button
              onClick={() => setIsResumeOpen(true)}
              className="px-8 py-4 rounded-full gradient-bg text-foreground font-semibold hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Resume
              <ArrowRight className="w-4 h-4" />
            </button>

          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-8 mt-12 justify-center lg:justify-start"
          >
            {[
              { value: "5+", label: "Years Experience" },
              { value: "10+", label: "Projects Completed" },
              { value: "3+", label: "Happy Clients" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Animated Visual */}
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
                  className="px-8 py-10 rounded-[2rem] border border-border/60 bg-background/35 shadow-[0_24px_80px_rgba(16,24,40,0.28)] backdrop-blur-md"
                >
                  <div className="text-center">
                    <div className="text-6xl md:text-8xl font-bold gradient-text mb-3 drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                      {"</>"}
                    </div>
                    <p className="text-muted-foreground text-base md:text-lg">
                      Drag or tap the tech dice anywhere in the hero
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
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

      {/* PDF Preview Dialog */}
      <PdfPreviewDialog
        open={isResumeOpen}
        onOpenChange={setIsResumeOpen}
        pdfUrl={publicConfig.RESUME_URL}
      />
    </section>
  );
};
