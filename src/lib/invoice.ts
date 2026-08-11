import type {
  Invoice,
  InvoiceCustomField,
  InvoiceLineItem,
  InvoiceTotals,
} from "@/types/invoice_model";
import { siteConfig } from "@/utils/seo";

const TOKEN_STORAGE_KEY = "njmtech-invoice-access-token";

export function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `inv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createLineItem(
  partial?: Partial<InvoiceLineItem>,
): InvoiceLineItem {
  return {
    id: createId(),
    description: "",
    quantity: 1,
    unitPrice: 0,
    ...partial,
  };
}

export function createCustomField(
  partial?: Partial<InvoiceCustomField>,
): InvoiceCustomField {
  return {
    id: createId(),
    label: "",
    amount: 0,
    ...partial,
  };
}

export function createEmptyInvoice(partial?: Partial<Invoice>): Invoice {
  const now = new Date();
  const isoDate = now.toISOString().slice(0, 10);
  const year = now.getFullYear();
  const stamp = now.getTime().toString().slice(-4);

  return {
    id: createId(),
    number: `INV-${year}-${stamp}`,
    issuedAt: isoDate,
    dueAt: "",
    currency: "ZAR",
    from: {
      name: siteConfig.name,
      email: siteConfig.email,
      phone: siteConfig.telephone,
      address: `${siteConfig.location.city}, ${siteConfig.location.region}, ${siteConfig.location.country}`,
    },
    to: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    lineItems: [createLineItem()],
    customFields: [],
    notes: "",
    taxPercent: 0,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    ...partial,
  };
}

export function computeInvoiceTotals(invoice: Invoice): InvoiceTotals {
  const lineItemsSubtotal = invoice.lineItems.reduce((sum, item) => {
    const qty = Number.isFinite(item.quantity) ? item.quantity : 0;
    const price = Number.isFinite(item.unitPrice) ? item.unitPrice : 0;
    return sum + qty * price;
  }, 0);

  const customFieldsSubtotal = invoice.customFields.reduce((sum, field) => {
    const amount = Number.isFinite(field.amount) ? field.amount : 0;
    return sum + amount;
  }, 0);

  const subtotal = lineItemsSubtotal + customFieldsSubtotal;
  const taxPercent = Number.isFinite(invoice.taxPercent)
    ? Math.max(0, invoice.taxPercent ?? 0)
    : 0;
  const tax = subtotal * (taxPercent / 100);
  const total = subtotal + tax;

  return {
    lineItemsSubtotal,
    customFieldsSubtotal,
    subtotal,
    tax,
    total,
  };
}

export function formatZar(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function getStoredAccessToken(): string {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setStoredAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    if (token.trim()) {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, token.trim());
    } else {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage failures (private mode, etc.)
  }
}
