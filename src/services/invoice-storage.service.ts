import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import {
  getR2BucketName,
  getR2Client,
  getInvoiceStoragePrefix,
  invoiceObjectKey,
  isR2Configured,
} from "@/lib/r2-client";
import { computeInvoiceTotals } from "@/lib/invoice";
import type { Invoice, InvoiceListItem } from "@/types/invoice_model";
import { logger } from "@/utils/logger";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isParty(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return typeof value.name === "string";
}

function isLineItem(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.description === "string" &&
    typeof value.quantity === "number" &&
    typeof value.unitPrice === "number"
  );
}

function isCustomField(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.label === "string" &&
    typeof value.amount === "number"
  );
}

export function isValidInvoice(value: unknown): value is Invoice {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    typeof value.number === "string" &&
    typeof value.issuedAt === "string" &&
    value.currency === "ZAR" &&
    isParty(value.from) &&
    isParty(value.to) &&
    Array.isArray(value.lineItems) &&
    value.lineItems.every(isLineItem) &&
    Array.isArray(value.customFields) &&
    value.customFields.every(isCustomField) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

async function streamToString(
  body: ReadableStream | Blob | NodeJS.ReadableStream | undefined,
): Promise<string> {
  if (!body) return "";

  if (typeof (body as Blob).text === "function") {
    return (body as Blob).text();
  }

  const chunks: Buffer[] = [];
  for await (const chunk of body as AsyncIterable<Uint8Array | string>) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

export function assertInvoiceStorageReady(): void {
  if (!isR2Configured()) {
    throw new Error("INVOICE_STORAGE_NOT_CONFIGURED");
  }
}

export async function saveInvoice(invoice: Invoice): Promise<Invoice> {
  assertInvoiceStorageReady();

  const now = new Date().toISOString();
  const payload: Invoice = {
    ...invoice,
    currency: "ZAR",
    updatedAt: now,
    createdAt: invoice.createdAt || now,
  };

  if (!isValidInvoice(payload)) {
    throw new Error("INVALID_INVOICE");
  }

  const client = getR2Client();
  const key = invoiceObjectKey(payload.id);

  await client.send(
    new PutObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
      Body: JSON.stringify(payload, null, 2),
      ContentType: "application/json",
    }),
  );

  logger.info(`Invoice saved to R2: ${key}`);
  return payload;
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  assertInvoiceStorageReady();

  const client = getR2Client();
  const key = invoiceObjectKey(id);

  try {
    const result = await client.send(
      new GetObjectCommand({
        Bucket: getR2BucketName(),
        Key: key,
      }),
    );

    const raw = await streamToString(result.Body as never);
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidInvoice(parsed)) {
      logger.warn(`Invalid invoice JSON at ${key}`);
      return null;
    }
    return parsed;
  } catch (error) {
    const name =
      error && typeof error === "object" && "name" in error
        ? String((error as { name: unknown }).name)
        : "";
    if (name === "NoSuchKey" || name === "NotFound") {
      return null;
    }
    throw error;
  }
}

export async function listInvoices(limit = 50): Promise<InvoiceListItem[]> {
  assertInvoiceStorageReady();

  const client = getR2Client();
  const prefix = `${getInvoiceStoragePrefix()}/`;

  const listed = await client.send(
    new ListObjectsV2Command({
      Bucket: getR2BucketName(),
      Prefix: prefix,
      MaxKeys: Math.min(Math.max(limit, 1), 100),
    }),
  );

  const keys = (listed.Contents ?? [])
    .map((item) => item.Key)
    .filter((key): key is string => Boolean(key) && key.endsWith(".json"))
    .slice(0, limit);

  const invoices: InvoiceListItem[] = [];

  for (const key of keys) {
    try {
      const result = await client.send(
        new GetObjectCommand({
          Bucket: getR2BucketName(),
          Key: key,
        }),
      );
      const raw = await streamToString(result.Body as never);
      const parsed = JSON.parse(raw) as unknown;
      if (!isValidInvoice(parsed)) continue;

      const totals = computeInvoiceTotals(parsed);
      invoices.push({
        id: parsed.id,
        number: parsed.number,
        toName: parsed.to.name || "—",
        total: totals.total,
        currency: "ZAR",
        issuedAt: parsed.issuedAt,
        updatedAt: parsed.updatedAt,
      });
    } catch (error) {
      logger.warn(
        `Failed to read invoice list item ${key}`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  return invoices.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}
