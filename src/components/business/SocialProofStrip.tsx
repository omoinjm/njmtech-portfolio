"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { SOCIAL_PROOF_STATS } from "@/lib/business-content";

export function SocialProofStrip() {
  const t = useTranslations("business.socialProof");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-12 border-y border-border/60 bg-background/40" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
        >
          {SOCIAL_PROOF_STATS.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t(`stat_${index}` as "stat_0" | "stat_1" | "stat_2", {
                  default: stat.label,
                })}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
