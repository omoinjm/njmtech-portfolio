"use client";

import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { BUSINESS_SERVICES, getServiceQuoteUrl } from "@/lib/business-content";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function ServicesPageContent() {
  const t = useTranslations("servicesPage");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-accent font-semibold text-sm tracking-wider uppercase">
            {t("label")}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            {t("heading")}{" "}
            <span className="gradient-text">{t("heading_gradient")}</span>
          </h1>
          <p className="text-muted-foreground">{t("subheading")}</p>
        </motion.div>

        <div className="space-y-12">
          {BUSINESS_SERVICES.map((service, index) => {
            const Icon =
              (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[service.icon] ??
              LucideIcons.Globe;

            return (
              <motion.article
                key={service.slug}
                id={service.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="scroll-mt-28 rounded-2xl border border-border bg-card/50 p-6 md:p-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                    <Icon className="w-7 h-7 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <h2 className="text-2xl font-bold">{service.name}</h2>
                      <p className="text-lg font-semibold text-accent shrink-0">
                        {service.priceRange
                          ? service.priceRange
                          : t("from_price", { price: service.fromPrice })}
                      </p>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {service.includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="rounded-full">
                      <a
                        href={getServiceQuoteUrl(service)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("quote_cta")}
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">{t("not_sure")}</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/contact">{t("contact_link")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
