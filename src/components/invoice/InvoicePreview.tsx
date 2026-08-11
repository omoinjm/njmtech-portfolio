"use client";

import { computeInvoiceTotals, formatZar } from "@/lib/invoice";
import type { Invoice } from "@/types/invoice_model";
import { siteConfig } from "@/utils/seo";

interface InvoicePreviewProps {
  invoice: Invoice;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const totals = computeInvoiceTotals(invoice);
  const taxPercent = invoice.taxPercent ?? 0;

  return (
    <article
      id="invoice-print-area"
      className="invoice-preview rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm md:p-8"
    >
      <header className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-3xl font-extrabold tracking-tight">
            <span className="gradient-text">NJM</span>
            <span className="text-foreground">TECH</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Invoice
          </p>
          <p className="mt-1 text-xl font-bold">{invoice.number || "—"}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Issued{" "}
            <span className="text-foreground">{invoice.issuedAt || "—"}</span>
          </p>
          {invoice.dueAt ? (
            <p className="text-sm text-muted-foreground">
              Due <span className="text-foreground">{invoice.dueAt}</span>
            </p>
          ) : null}
        </div>
      </header>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            From
          </h3>
          <p className="mt-2 font-semibold">{invoice.from.name || "—"}</p>
          {invoice.from.email ? (
            <p className="text-sm text-muted-foreground">{invoice.from.email}</p>
          ) : null}
          {invoice.from.phone ? (
            <p className="text-sm text-muted-foreground">{invoice.from.phone}</p>
          ) : null}
          {invoice.from.address ? (
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              {invoice.from.address}
            </p>
          ) : null}
        </section>
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Bill to
          </h3>
          <p className="mt-2 font-semibold">{invoice.to.name || "—"}</p>
          {invoice.to.email ? (
            <p className="text-sm text-muted-foreground">{invoice.to.email}</p>
          ) : null}
          {invoice.to.phone ? (
            <p className="text-sm text-muted-foreground">{invoice.to.phone}</p>
          ) : null}
          {invoice.to.address ? (
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              {invoice.to.address}
            </p>
          ) : null}
        </section>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <th className="py-2 pr-3 font-semibold">Description</th>
              <th className="py-2 pr-3 font-semibold">Qty</th>
              <th className="py-2 pr-3 font-semibold">Unit</th>
              <th className="py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item) => (
              <tr key={item.id} className="border-b border-border/70">
                <td className="py-3 pr-3 align-top">
                  {item.description || "—"}
                </td>
                <td className="py-3 pr-3 align-top tabular-nums">
                  {item.quantity}
                </td>
                <td className="py-3 pr-3 align-top tabular-nums">
                  {formatZar(item.unitPrice)}
                </td>
                <td className="py-3 text-right align-top tabular-nums">
                  {formatZar(item.quantity * item.unitPrice)}
                </td>
              </tr>
            ))}
            {invoice.customFields.map((field) => (
              <tr key={field.id} className="border-b border-border/70">
                <td className="py-3 pr-3 align-top" colSpan={3}>
                  {field.label || "Additional amount"}
                </td>
                <td className="py-3 text-right align-top tabular-nums">
                  {formatZar(field.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <dl className="w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between gap-6">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="tabular-nums font-medium">
              {formatZar(totals.subtotal)}
            </dd>
          </div>
          {taxPercent > 0 ? (
            <div className="flex justify-between gap-6">
              <dt className="text-muted-foreground">Tax ({taxPercent}%)</dt>
              <dd className="tabular-nums font-medium">
                {formatZar(totals.tax)}
              </dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-6 border-t border-border pt-2 text-base">
            <dt className="font-semibold">Total</dt>
            <dd className="tabular-nums font-bold gradient-text">
              {formatZar(totals.total)}
            </dd>
          </div>
        </dl>
      </div>

      {invoice.notes ? (
        <section className="mt-8 border-t border-border pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Notes
          </h3>
          <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
            {invoice.notes}
          </p>
        </section>
      ) : null}
    </article>
  );
}
