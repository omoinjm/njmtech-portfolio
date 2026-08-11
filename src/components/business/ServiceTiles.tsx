"use client";

import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  BUSINESS_SERVICES,
  HOME_SERVICE_TILE_SLUGS,
  STARTING_PRICE,
} from "@/lib/business-content";

export function ServiceTiles() {
  const t = useTranslations("business.serviceTiles");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const tiles = HOME_SERVICE_TILE_SLUGS.map((slug) =>
    BUSINESS_SERVICES.find((service) => service.slug === slug),
  ).filter(Boolean);

  return (
    <section id="services-overview" className="py-20 bg-card/20" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-semibold text-sm tracking-wider uppercase">
            {t("label")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-3">{t("heading")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("subheading")}</p>
          <p className="text-sm text-muted-foreground/80 mt-3">
            {t("starting_from", { price: STARTING_PRICE })}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiles.map((service, index) => {
            if (!service) return null;
            const Icon =
              (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[service.icon] ??
              LucideIcons.Globe;

            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Link
                  href={`/services#${service.slug}`}
                  className="block h-full p-6 rounded-2xl border border-border bg-card hover:border-accent/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {service.shortDescription}
                  </p>
                  <p className="text-sm font-semibold text-accent">
                    {t("from_price", { price: service.fromPrice })}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/services"
            className="text-sm font-semibold text-accent hover:underline underline-offset-4"
          >
            {t("view_all")}
          </Link>
        </div>
      </div>
    </section>
  );
}
