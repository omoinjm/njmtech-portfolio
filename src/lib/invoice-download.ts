import type { Invoice } from "@/types/invoice_model";

export type InvoicePdfDownloadResult =
  | { ok: true; filename: string }
  | { ok: false; message: string; code?: string };

export async function downloadInvoicePdf(
  id: string,
  fallbackNumber?: string,
): Promise<InvoicePdfDownloadResult> {
  const response = await fetch(
    `/api/invoice/pdf?id=${encodeURIComponent(id)}`,
  );

  if (!response.ok) {
    let message = "Could not download PDF";
    let code: string | undefined;
    try {
      const data = (await response.json()) as {
        message?: string;
        code?: string;
      };
      message = data.message ?? message;
      code = data.code;
    } catch {
      // Non-JSON error body
    }
    return { ok: false, message, code };
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition") ?? "";
  const match = /filename="([^"]+)"/i.exec(disposition);
  const filename = match?.[1] || `${fallbackNumber || "invoice"}.pdf`;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  return { ok: true, filename };
}

export function getPublicInvoicePath(id: string): string {
  return `/invoice/${id}`;
}

export function getPublicInvoiceUrl(id: string, siteUrl: string): string {
  return `${siteUrl.replace(/\/$/, "")}${getPublicInvoicePath(id)}`;
}

export function invoiceNumberLabel(invoice: Pick<Invoice, "number" | "id">): string {
  return invoice.number || invoice.id;
}
