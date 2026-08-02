"use client";

import { useEffect, useState, useEffectEvent } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Copy,
  Download,
  ExternalLink,
  FilePlus2,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Link, useRouter } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { useToast } from "@/hooks/use-toast";
import {
  createCustomField,
  createEmptyInvoice,
  createLineItem,
  formatZar,
  getStoredAccessToken,
  setStoredAccessToken,
  computeInvoiceTotals,
} from "@/lib/invoice";
import {
  downloadInvoicePdf,
  getPublicInvoicePath,
  getPublicInvoiceUrl,
} from "@/lib/invoice-download";
import { siteConfig } from "@/utils/seo";
import type { Invoice, InvoiceListItem } from "@/types/invoice_model";

interface InvoiceBuilderProps {
  initialId?: string;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function InvoiceBuilder({ initialId }: InvoiceBuilderProps) {
  const t = useTranslations("invoice");
  const { toast } = useToast();
  const router = useRouter();

  const [invoice, setInvoice] = useState<Invoice>(() => createEmptyInvoice());
  const [accessToken, setAccessToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(Boolean(initialId));
  const [listing, setListing] = useState(false);
  const [recent, setRecent] = useState<InvoiceListItem[]>([]);
  const [persistedId, setPersistedId] = useState<string | undefined>(initialId);

  const onLoadInvoice = useEffectEvent(async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/invoice?id=${encodeURIComponent(id)}`);
      const data = (await response.json()) as {
        invoice?: Invoice;
        message?: string;
        code?: string;
      };

      if (!response.ok || !data.invoice) {
        toast({
          title: t("load_failed"),
          description: data.message ?? t("not_found"),
          variant: "destructive",
        });
        return;
      }

      setInvoice(data.invoice);
      setPersistedId(data.invoice.id);
    } catch {
      toast({
        title: t("load_failed"),
        description: t("network_error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    setAccessToken(getStoredAccessToken());
  }, []);

  useEffect(() => {
    setPersistedId(initialId);
    if (initialId) {
      void onLoadInvoice(initialId);
    }
  }, [initialId]);

  const totals = computeInvoiceTotals(invoice);

  const updateInvoice = (patch: Partial<Invoice>) => {
    setInvoice((prev) => ({ ...prev, ...patch }));
  };

  const updateFrom = (key: keyof Invoice["from"], value: string) => {
    setInvoice((prev) => ({
      ...prev,
      from: { ...prev.from, [key]: value },
    }));
  };

  const updateTo = (key: keyof Invoice["to"], value: string) => {
    setInvoice((prev) => ({
      ...prev,
      to: { ...prev.to, [key]: value },
    }));
  };

  const handleSave = async () => {
    const token = accessToken.trim();
    if (!token) {
      toast({
        title: t("token_required_title"),
        description: t("token_required_body"),
        variant: "destructive",
      });
      return;
    }
    if (!invoice.to.name.trim()) {
      toast({
        title: t("client_required_title"),
        description: t("client_required_body"),
        variant: "destructive",
      });
      return;
    }

    setStoredAccessToken(token);
    setSaving(true);

    try {
      const payload: Invoice = {
        ...invoice,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-invoice-token": token,
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        invoice?: Invoice;
        message?: string;
        code?: string;
      };

      if (!response.ok || !data.invoice) {
        const description =
          data.code === "STORAGE_NOT_CONFIGURED" ||
          data.code === "TOKEN_NOT_CONFIGURED"
            ? t("storage_not_configured")
            : (data.message ?? t("save_failed"));
        toast({
          title: t("save_failed"),
          description,
          variant: "destructive",
        });
        return;
      }

      setInvoice(data.invoice);
      setPersistedId(data.invoice.id);
      toast({
        title: t("save_success_title"),
        description: t("save_success_body", { number: data.invoice.number }),
      });
      router.replace(`/invoice/edit/${data.invoice.id}`);
    } catch {
      toast({
        title: t("save_failed"),
        description: t("network_error"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleList = async () => {
    const token = accessToken.trim();
    if (!token) {
      toast({
        title: t("token_required_title"),
        description: t("token_required_body"),
        variant: "destructive",
      });
      return;
    }

    setStoredAccessToken(token);
    setListing(true);

    try {
      const response = await fetch("/api/invoice?limit=20", {
        headers: { "x-invoice-token": token },
      });
      const data = (await response.json()) as {
        invoices?: InvoiceListItem[];
        message?: string;
        code?: string;
      };

      if (!response.ok) {
        toast({
          title: t("list_failed"),
          description:
            data.code === "STORAGE_NOT_CONFIGURED" ||
            data.code === "TOKEN_NOT_CONFIGURED"
              ? t("storage_not_configured")
              : (data.message ?? t("list_failed")),
          variant: "destructive",
        });
        return;
      }

      setRecent(data.invoices ?? []);
      if (!(data.invoices ?? []).length) {
        toast({ title: t("list_empty") });
      }
    } catch {
      toast({
        title: t("list_failed"),
        description: t("network_error"),
        variant: "destructive",
      });
    } finally {
      setListing(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!persistedId) {
      toast({
        title: t("pdf_save_first_title"),
        description: t("pdf_save_first_body"),
        variant: "destructive",
      });
      return;
    }

    setDownloading(true);
    try {
      const result = await downloadInvoicePdf(persistedId, invoice.number);
      if (result.ok === false) {
        const description =
          result.code === "STORAGE_NOT_CONFIGURED" ||
          result.code === "TOKEN_NOT_CONFIGURED"
            ? t("storage_not_configured")
            : result.message;
        toast({
          title: t("pdf_failed"),
          description,
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

  const handleCopyClientLink = async () => {
    if (!persistedId) {
      toast({
        title: t("pdf_save_first_title"),
        description: t("pdf_save_first_body"),
        variant: "destructive",
      });
      return;
    }

    const url = getPublicInvoiceUrl(persistedId, siteConfig.url);
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: t("link_copied_title"),
        description: t("link_copied_body"),
      });
    } catch {
      toast({
        title: t("copy_link_failed"),
        description: url,
        variant: "destructive",
      });
    }
  };

  const handleNew = () => {
    setInvoice(createEmptyInvoice());
    setPersistedId(undefined);
    setRecent([]);
    router.push("/invoice");
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        {t("loading")}
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="invoice-editor space-y-6"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {t("save")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={downloading}
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {t("download_pdf")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyClientLink}
            disabled={!persistedId}
          >
            <Copy className="h-4 w-4" />
            {t("copy_link")}
          </Button>
          {persistedId ? (
            <Button type="button" variant="ghost" asChild>
              <Link href={getPublicInvoicePath(persistedId)} target="_blank">
                <ExternalLink className="h-4 w-4" />
                {t("public_title")}
              </Link>
            </Button>
          ) : null}
          <Button type="button" variant="secondary" onClick={handleNew}>
            <FilePlus2 className="h-4 w-4" />
            {t("new")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleList}
            disabled={listing}
          >
            {listing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            {t("list_recent")}
          </Button>
        </div>

        <Field label={t("access_token")}>
          <Input
            type="password"
            autoComplete="off"
            value={accessToken}
            onChange={(event) => setAccessToken(event.target.value)}
            placeholder={t("access_token_placeholder")}
            className="glass-input"
          />
        </Field>

        {recent.length > 0 ? (
          <div className="rounded-lg border border-border bg-card/60 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("recent_heading")}
            </p>
            <ul className="space-y-1">
              {recent.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-secondary"
                    onClick={() => router.push(`/invoice/edit/${item.id}`)}
                  >
                    <span>
                      {item.number} · {item.toName}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatZar(item.total)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("invoice_number")}>
            <Input
              value={invoice.number}
              onChange={(event) => updateInvoice({ number: event.target.value })}
              className="glass-input"
            />
          </Field>
          <Field label={t("currency")}>
            <Input value="ZAR" disabled className="glass-input opacity-70" />
          </Field>
          <Field label={t("issued_at")}>
            <Input
              type="date"
              value={invoice.issuedAt}
              onChange={(event) =>
                updateInvoice({ issuedAt: event.target.value })
              }
              className="glass-input"
            />
          </Field>
          <Field label={t("due_at")}>
            <Input
              type="date"
              value={invoice.dueAt ?? ""}
              onChange={(event) => updateInvoice({ dueAt: event.target.value })}
              className="glass-input"
            />
          </Field>
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("from_heading")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("name")}>
              <Input
                value={invoice.from.name}
                onChange={(event) => updateFrom("name", event.target.value)}
                className="glass-input"
              />
            </Field>
            <Field label={t("email")}>
              <Input
                value={invoice.from.email ?? ""}
                onChange={(event) => updateFrom("email", event.target.value)}
                className="glass-input"
              />
            </Field>
            <Field label={t("phone")}>
              <Input
                value={invoice.from.phone ?? ""}
                onChange={(event) => updateFrom("phone", event.target.value)}
                className="glass-input"
              />
            </Field>
            <Field label={t("address")}>
              <Input
                value={invoice.from.address ?? ""}
                onChange={(event) => updateFrom("address", event.target.value)}
                className="glass-input"
              />
            </Field>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("to_heading")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("name")}>
              <Input
                value={invoice.to.name}
                onChange={(event) => updateTo("name", event.target.value)}
                className="glass-input"
              />
            </Field>
            <Field label={t("email")}>
              <Input
                value={invoice.to.email ?? ""}
                onChange={(event) => updateTo("email", event.target.value)}
                className="glass-input"
              />
            </Field>
            <Field label={t("phone")}>
              <Input
                value={invoice.to.phone ?? ""}
                onChange={(event) => updateTo("phone", event.target.value)}
                className="glass-input"
              />
            </Field>
            <Field label={t("address")}>
              <Input
                value={invoice.to.address ?? ""}
                onChange={(event) => updateTo("address", event.target.value)}
                className="glass-input"
              />
            </Field>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("line_items_heading")}
            </h2>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setInvoice((prev) => ({
                  ...prev,
                  lineItems: [...prev.lineItems, createLineItem()],
                }))
              }
            >
              <Plus className="h-4 w-4" />
              {t("add_line")}
            </Button>
          </div>

          <div className="space-y-3">
            {invoice.lineItems.map((item, index) => (
              <div
                key={item.id}
                className="grid gap-2 rounded-lg border border-border/80 bg-card/40 p-3 sm:grid-cols-[minmax(0,1fr)_5rem_7rem_auto]"
              >
                <Field label={t("description")}>
                  <Input
                    value={item.description}
                    onChange={(event) => {
                      const description = event.target.value;
                      setInvoice((prev) => ({
                        ...prev,
                        lineItems: prev.lineItems.map((row, i) =>
                          i === index ? { ...row, description } : row,
                        ),
                      }));
                    }}
                    className="glass-input"
                  />
                </Field>
                <Field label={t("quantity")}>
                  <Input
                    type="number"
                    min={0}
                    step="1"
                    value={item.quantity}
                    onChange={(event) => {
                      const quantity = Number(event.target.value);
                      setInvoice((prev) => ({
                        ...prev,
                        lineItems: prev.lineItems.map((row, i) =>
                          i === index
                            ? {
                                ...row,
                                quantity: Number.isFinite(quantity)
                                  ? quantity
                                  : 0,
                              }
                            : row,
                        ),
                      }));
                    }}
                    className="glass-input"
                  />
                </Field>
                <Field label={t("unit_price")}>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(event) => {
                      const unitPrice = Number(event.target.value);
                      setInvoice((prev) => ({
                        ...prev,
                        lineItems: prev.lineItems.map((row, i) =>
                          i === index
                            ? {
                                ...row,
                                unitPrice: Number.isFinite(unitPrice)
                                  ? unitPrice
                                  : 0,
                              }
                            : row,
                        ),
                      }));
                    }}
                    className="glass-input"
                  />
                </Field>
                <div className="flex items-end">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={t("remove_line")}
                    disabled={invoice.lineItems.length <= 1}
                    onClick={() =>
                      setInvoice((prev) => ({
                        ...prev,
                        lineItems: prev.lineItems.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("custom_fields_heading")}
            </h2>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setInvoice((prev) => ({
                  ...prev,
                  customFields: [...prev.customFields, createCustomField()],
                }))
              }
            >
              <Plus className="h-4 w-4" />
              {t("add_custom")}
            </Button>
          </div>

          {invoice.customFields.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("custom_empty")}</p>
          ) : (
            <div className="space-y-3">
              {invoice.customFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-2 rounded-lg border border-border/80 bg-card/40 p-3 sm:grid-cols-[minmax(0,1fr)_7rem_auto]"
                >
                  <Field label={t("label")}>
                    <Input
                      value={field.label}
                      onChange={(event) => {
                        const label = event.target.value;
                        setInvoice((prev) => ({
                          ...prev,
                          customFields: prev.customFields.map((row, i) =>
                            i === index ? { ...row, label } : row,
                          ),
                        }));
                      }}
                      className="glass-input"
                    />
                  </Field>
                  <Field label={t("amount")}>
                    <Input
                      type="number"
                      step="0.01"
                      value={field.amount}
                      onChange={(event) => {
                        const amount = Number(event.target.value);
                        setInvoice((prev) => ({
                          ...prev,
                          customFields: prev.customFields.map((row, i) =>
                            i === index
                              ? {
                                  ...row,
                                  amount: Number.isFinite(amount) ? amount : 0,
                                }
                              : row,
                          ),
                        }));
                      }}
                      className="glass-input"
                    />
                  </Field>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label={t("remove_custom")}
                      onClick={() =>
                        setInvoice((prev) => ({
                          ...prev,
                          customFields: prev.customFields.filter(
                            (_, i) => i !== index,
                          ),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("tax_percent")}>
            <Input
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={invoice.taxPercent ?? 0}
              onChange={(event) => {
                const taxPercent = Number(event.target.value);
                updateInvoice({
                  taxPercent: Number.isFinite(taxPercent) ? taxPercent : 0,
                });
              }}
              className="glass-input"
            />
          </Field>
          <div className="rounded-lg border border-border bg-card/50 p-3">
            <p className="text-xs text-muted-foreground">{t("running_total")}</p>
            <p className="mt-1 text-2xl font-bold gradient-text tabular-nums">
              {formatZar(totals.total)}
            </p>
          </div>
        </div>

        <Field label={t("notes")}>
          <textarea
            value={invoice.notes ?? ""}
            onChange={(event) => updateInvoice({ notes: event.target.value })}
            rows={4}
            className="glass-input flex w-full rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder={t("notes_placeholder")}
          />
        </Field>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="lg:sticky lg:top-24 lg:self-start"
      >
        <InvoicePreview invoice={invoice} />
      </motion.div>
    </div>
  );
}
