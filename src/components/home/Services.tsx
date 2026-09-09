"use client";

import { motion, useInView } from "framer-motion";
import {
  Bot,
  Cloud,
  Code2,
  Database,
  Rocket,
  Smartphone
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

const SERVICE_ICONS = [Code2, Smartphone, Cloud, Bot, Database, Rocket];

export const Services = () => {
  const t = useTranslations("services");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = SERVICE_ICONS.map((Icon, i) => ({
    icon: Icon,
    title: t(`item_${i}_title` as Parameters<typeof t>[0]),
    description: t(`item_${i}_desc` as Parameters<typeof t>[0]),
  }));

  return (
    <section
      id="services"
      data-keyboard-section="services"
      className="relative min-h-screen flex items-center py-20"
      ref={ref}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">
        {/* Two-column split: left open for keyboard, right holds content */}
        <div className="flex flex-col lg:flex-row">
          <div className="hidden lg:block lg:w-[48%] shrink-0" />

          <div className="w-full lg:w-[52%]">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8 text-center lg:text-left"
            >
              <span className="text-accent font-semibold text-sm tracking-wider uppercase">
                {t("label")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-3">
                {t("heading")} <span className="gradient-text">{t("heading_gradient")}</span>
              </h2>
              <p className="text-muted-foreground text-sm max-w-md">
                {t("subheading")}
              </p>
            </motion.div>

            {/* Services Grid — compact horizontal cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="group flex items-start gap-4 p-5 rounded-xl bg-card/70 border border-border hover:border-accent/50 backdrop-blur-sm transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <service.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1 group-hover:gradient-text transition-all">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-4"
            >
              <a
                href="/contact"
                className="inline-flex px-6 py-3 rounded-full gradient-bg text-foreground text-sm font-semibold hover:opacity-90 transition-all hover:scale-105"
              >
                {t("cta")}
              </a>
              <p className="text-muted-foreground text-sm self-center">
                {t("cta_sub")}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
