"use client";

import { motion } from "framer-motion";
import { Receipt } from "lucide-react";
import { useTranslations } from "next-intl";
import { InvoiceBuilder } from "@/components/invoice/InvoiceBuilder";

interface InvoicePageProps {
  invoiceId?: string;
}

export function InvoicePage({ invoiceId }: InvoicePageProps) {
  const t = useTranslations("invoice");

  return (
    <section className="relative min-h-screen overflow-hidden pt-24 pb-16 print:min-h-0 print:overflow-visible print:pt-0 print:pb-0">
      <div className="pointer-events-none absolute inset-0 overflow-hidden print:hidden">
        <div className="absolute -left-32 top-1/4 h-96 w-96 animate-pulse-slow rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 animate-pulse-slow rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-accent/5 to-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 px-4 print:px-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto mb-8 max-w-7xl print:hidden"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <Receipt className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">{t("badge")}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold md:text-5xl">
            <span className="gradient-text">{t("title")}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{t("subtitle")}</p>
        </motion.div>

        <InvoiceBuilder initialId={invoiceId} />
      </div>
    </section>
  );
}
