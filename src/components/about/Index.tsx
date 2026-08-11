"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  ABOUT_COMPANY_PARAGRAPHS,
  ABOUT_VALUES,
  CLIENT_INDUSTRIES,
  FOUNDER_BIO,
} from "@/lib/business-content";
import { ContactCTA } from "@/components/business/ContactCTA";
import { Button } from "@/components/ui/button";

export function AboutPageContent() {
  const t = useTranslations("aboutPage");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24" ref={ref}>
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-12"
        >
          <span className="text-accent font-semibold text-sm tracking-wider uppercase">
            {t("label")}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">{t("heading")}</h1>
          {ABOUT_COMPANY_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-muted-foreground leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mb-12 p-6 rounded-2xl border border-border bg-card/40"
        >
          <h2 className="text-xl font-bold mb-3">{t("founder_heading")}</h2>
          <p className="text-muted-foreground leading-relaxed">{FOUNDER_BIO}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold mb-4">{t("values_heading")}</h2>
          <ul className="space-y-3">
            {ABOUT_VALUES.map((value) => (
              <li key={value} className="flex items-start gap-2 text-muted-foreground">
                <Check className="w-4 h-4 text-accent shrink-0 mt-1" />
                {value}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold mb-3">{t("industries_heading")}</h2>
          <div className="flex flex-wrap gap-2">
            {CLIENT_INDUSTRIES.map((industry) => (
              <span
                key={industry}
                className="text-sm px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground"
              >
                {industry}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <Button asChild className="rounded-full">
            <Link href="/services">{t("cta_services")}</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/contact">{t("cta_contact")}</Link>
          </Button>
        </motion.div>

        <ContactCTA variant="section" showFormLink={false} />
      </div>
    </section>
  );
}
