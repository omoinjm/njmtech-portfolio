"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  SKILL_CATEGORY_LABELS,
  type KeyboardSkill,
} from "./skills-keyboard-data";
type SkillsProps = {
  activeSkill: KeyboardSkill | null;
};

export const Skills = ({ activeSkill }: SkillsProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="skills"
      data-keyboard-section="skills"
      className="relative min-h-[110vh] overflow-hidden py-24"
      ref={ref}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-accent font-semibold text-sm tracking-[0.28em] uppercase">
            Keyboard Skills
          </span>
          <h2 className="mt-4 text-4xl font-bold leading-none md:text-6xl lg:text-[5.5rem]">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="mt-4 text-sm text-accent/80 md:text-lg">
            (hint: hover over a key)
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto mt-10 min-h-[30rem] md:min-h-[40rem] lg:min-h-[48rem]"
        >
          <div className="absolute inset-x-0 top-0 z-10 flex justify-center">
            <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-border/35 bg-background/18 px-2.5 py-1.5 backdrop-blur-sm">
              {Object.entries(SKILL_CATEGORY_LABELS).map(([category, label]) => (
                <span
                  key={category}
                  className="flex items-center gap-1.5 rounded-full border border-border/40 bg-background/28 px-2.5 py-1 text-[11px] font-medium"
                >
                  <span className="h-2 w-2 rounded-full gradient-bg" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute left-0 top-[32%] z-10 hidden max-w-sm -rotate-[32deg] text-left lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSkill?.id ?? "default-desktop"}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                {activeSkill ? (
                  <>
                    <p className="mb-2 text-sm uppercase tracking-[0.3em] text-accent/85">
                      {SKILL_CATEGORY_LABELS[activeSkill.category]}
                    </p>
                    <h3 className="mb-3 text-5xl font-bold leading-none text-foreground/90">
                      {activeSkill.label}
                    </h3>
                    <p className="max-w-xs text-2xl leading-snug text-foreground/62">
                      {activeSkill.summary}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mb-2 text-sm uppercase tracking-[0.3em] text-accent/85">
                      Interaction
                    </p>
                    <h3 className="mb-3 text-5xl font-bold leading-none text-foreground/90">
                      Tech Stack
                    </h3>
                    <p className="max-w-xs text-2xl leading-snug text-foreground/62">
                      Move through this section, then hover a key to inspect the
                      part of my stack it represents.
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 px-4 lg:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSkill?.id ?? "default-mobile"}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.25 }}
                className="mx-auto max-w-xl text-center"
              >
                {activeSkill ? (
                  <>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-accent">
                      {SKILL_CATEGORY_LABELS[activeSkill.category]}
                    </p>
                    <h3 className="mb-3 text-2xl font-semibold">{activeSkill.label}</h3>
                    <p className="text-base text-muted-foreground">
                      {activeSkill.summary}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-accent">
                      Interaction
                    </p>
                    <h3 className="mb-3 text-2xl font-semibold">Tech Stack</h3>
                    <p className="text-base text-muted-foreground">
                      Scroll into the section and hover a key to inspect the part
                      of my stack it represents.
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
