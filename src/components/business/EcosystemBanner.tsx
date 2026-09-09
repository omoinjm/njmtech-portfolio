"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import type { EcosystemDivisionContent } from "@/sanity/lib/content";

interface EcosystemBannerProps {
  variant?: "full" | "compact";
  divisions: EcosystemDivisionContent[];
}

export function EcosystemBanner({ variant = "full", divisions }: EcosystemBannerProps) {
  const t = useTranslations("ecosystem");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isCompact = variant === "compact";

  return (
    <section
      className={isCompact ? "" : "py-16 md:py-20 bg-background/40 border-y border-border/60"}
      ref={ref}
    >
      <div className={isCompact ? "" : "container mx-auto px-4"}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className={
            isCompact
              ? "rounded-2xl border border-border bg-card/40 p-6 md:p-8"
              : "rounded-3xl border border-border bg-card/60 p-8 md:p-12 max-w-4xl mx-auto"
          }
        >
          <span className="text-accent font-semibold text-xs tracking-wider uppercase">
            {t("eyebrow")}
          </span>
          <h2
            className={
              isCompact
                ? "text-xl md:text-2xl font-bold mt-2 mb-3"
                : "text-2xl md:text-3xl font-bold mt-2 mb-4"
            }
          >
            {t("heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">{t("intro")}</p>

          <div className={isCompact ? "flex flex-wrap gap-3" : "grid sm:grid-cols-3 gap-4"}>
            {divisions.map((division) =>
              isCompact ? (
                <span
                  key={division.key}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border bg-background/60 text-muted-foreground"
                >
                  {division.name}
                  {division.statusLabel ? ` — ${division.statusLabel}` : ""}
                </span>
              ) : (
                <div
                  key={division.key}
                  className="rounded-xl border border-border/70 bg-background/50 p-4"
                >
                  <p className="font-semibold text-foreground mb-1">{division.name}</p>
                  <p className="text-sm text-muted-foreground">{division.tagline}</p>
                  {division.statusLabel && (
                    <p className="text-xs uppercase tracking-wide text-accent/80 mt-2">
                      {division.statusLabel}
                    </p>
                  )}
                </div>
              ),
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
