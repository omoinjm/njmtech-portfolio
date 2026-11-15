export const INVOICE_CURRENCIES = ["ZAR", "USD"] as const;

export type InvoiceCurrency = (typeof INVOICE_CURRENCIES)[number];

export type InvoiceParty = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};

export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceCustomField = {
  id: string;
  label: string;
  amount: number;
};

export type Invoice = {
  id: string;
  number: string;
  issuedAt: string;
  dueAt?: string;
  currency: InvoiceCurrency;
  from: InvoiceParty;
  to: InvoiceParty;
  lineItems: InvoiceLineItem[];
  customFields: InvoiceCustomField[];
  notes?: string;
  taxPercent?: number;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceTotals = {
  lineItemsSubtotal: number;
  customFieldsSubtotal: number;
  subtotal: number;
  tax: number;
  total: number;
};

export type InvoiceListItem = {
  id: string;
  number: string;
  toName: string;
  total: number;
  currency: InvoiceCurrency;
  issuedAt: string;
  updatedAt: string;
};
