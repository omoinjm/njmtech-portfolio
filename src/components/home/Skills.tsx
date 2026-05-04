"use client";

import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef } from "react";

const SkillsGraphScene = dynamic(
  () => import("./SkillsGraphScene").then((m) => m.SkillsGraphScene),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full rounded-2xl bg-card/30 animate-pulse" />
    ),
  },
);

export const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm tracking-wider uppercase">
            My Expertise
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I&apos;ve worked with a wide range of technologies in the web
            development world, from front-end frameworks to back-end systems and
            cloud infrastructure.
          </p>
        </motion.div>

        {/* 3D Skill Graph — full width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative w-full h-[380px] md:h-[440px] rounded-2xl overflow-hidden border border-border/50 mb-12"
        >
          <div className="absolute inset-0">
            <SkillsGraphScene />
          </div>
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            {[
              { label: "Frontend", color: "bg-blue-500" },
              { label: "Backend", color: "bg-purple-500" },
              { label: "DevOps", color: "bg-amber-500" },
              { label: "Database", color: "bg-emerald-500" },
            ].map(({ label, color }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 text-xs font-medium"
              >
                <span className={`w-2 h-2 rounded-full ${color}`} />
                {label}
              </span>
            ))}
          </div>
          <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/60">
            Drag to explore · Hover a node
          </div>
        </motion.div>


      </div>
    </section>
  );
};
