"use client";

import { useEffect, useState, useEffectEvent } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, Receipt } from "lucide-react";
import { useTranslations } from "next-intl";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { downloadInvoicePdf } from "@/lib/invoice-download";
import type { Invoice } from "@/types/invoice_model";

interface InvoicePublicViewProps {
  invoiceId: string;
}

export function InvoicePublicView({ invoiceId }: InvoicePublicViewProps) {
  const t = useTranslations("invoice");
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const onLoad = useEffectEvent(async (id: string) => {
    setLoading(true);
    setNotFound(false);
    try {
      const response = await fetch(`/api/invoice?id=${encodeURIComponent(id)}`);
      const data = (await response.json()) as {
        invoice?: Invoice;
        message?: string;
      };

      if (!response.ok || !data.invoice) {
        setNotFound(true);
        setInvoice(null);
        return;
      }

      setInvoice(data.invoice);
    } catch {
      setNotFound(true);
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    void onLoad(invoiceId);
  }, [invoiceId]);

  const handleDownload = async () => {
    if (!invoice) return;
    setDownloading(true);
    try {
      const result = await downloadInvoicePdf(invoice.id, invoice.number);
      if (result.ok === false) {
        toast({
          title: t("pdf_failed"),
          description:
            result.code === "STORAGE_NOT_CONFIGURED"
              ? t("storage_not_configured")
              : result.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: t("pdf_success_title"),
        description: t("pdf_success_body", { number: invoice.number }),
      });
    } catch {
      toast({
        title: t("pdf_failed"),
        description: t("network_error"),
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-24 pb-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-1/4 h-96 w-96 animate-pulse-slow rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 animate-pulse-slow rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-accent/5 to-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <Receipt className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">
              {t("public_badge")}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            <span className="gradient-text">{t("public_title")}</span>
          </h1>
          <p className="mt-2 text-muted-foreground">{t("public_subtitle")}</p>
        </motion.div>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t("loading")}
          </div>
        ) : notFound || !invoice ? (
          <div className="rounded-xl border border-border bg-card/60 p-8 text-center">
            <p className="text-lg font-semibold">{t("not_found")}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("public_not_found_body")}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {t("download_pdf")}
              </Button>
              <p className="text-sm text-muted-foreground">
                {t("public_readonly_hint")}
              </p>
            </div>
            <InvoicePreview invoice={invoice} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
