"use client";

import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { TESTIMONIALS } from "@/lib/business-content";

export function Testimonials() {
  const t = useTranslations("business.testimonials");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-accent font-semibold text-sm tracking-wider uppercase">
            {t("label")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">{t("heading")}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, index) => (
            <motion.blockquote
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card/50 flex flex-col"
            >
              <Quote className="w-8 h-8 text-accent/40 mb-4 shrink-0" aria-hidden />
              <p className="text-muted-foreground flex-1 mb-4 leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.role}, {item.company}
                </p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
