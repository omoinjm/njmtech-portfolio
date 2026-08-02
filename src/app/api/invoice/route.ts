import { NextResponse } from "next/server";
import { z } from "zod";
import { config } from "@/lib/config";
import { isR2Configured } from "@/lib/r2-client";
import {
  getInvoice,
  isValidInvoice,
  listInvoices,
  saveInvoice,
} from "@/services/invoice-storage.service";
import { logger } from "@/utils/logger";

const partySchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(80).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
});

const lineItemSchema = z.object({
  id: z.string().min(1).max(80),
  description: z.string().trim().max(500),
  quantity: z.number().finite().min(0).max(1_000_000),
  unitPrice: z.number().finite().min(0).max(1_000_000_000),
});

const customFieldSchema = z.object({
  id: z.string().min(1).max(80),
  label: z.string().trim().max(200),
  amount: z.number().finite().min(-1_000_000_000).max(1_000_000_000),
});

const invoiceSchema = z.object({
  id: z.string().min(1).max(80),
  number: z.string().trim().min(1).max(80),
  issuedAt: z.string().trim().min(1).max(40),
  dueAt: z.string().trim().max(40).optional().or(z.literal("")),
  currency: z.literal("ZAR"),
  from: partySchema,
  to: partySchema,
  lineItems: z.array(lineItemSchema).max(100),
  customFields: z.array(customFieldSchema).max(100),
  notes: z.string().trim().max(4000).optional().or(z.literal("")),
  taxPercent: z.number().finite().min(0).max(100).optional(),
  createdAt: z.string().trim().min(1).max(40),
  updatedAt: z.string().trim().min(1).max(40),
});

function getBearerOrHeaderToken(request: Request): string {
  const headerToken = request.headers.get("x-invoice-token")?.trim() ?? "";
  if (headerToken) return headerToken;

  const auth = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(auth);
  return match?.[1]?.trim() ?? "";
}

function requireAccessToken(request: Request): NextResponse | null {
  const expected = config.get("INVOICE_ACCESS_TOKEN");
  if (!expected) {
    return NextResponse.json(
      {
        message:
          "Invoice access token is not configured. Set INVOICE_ACCESS_TOKEN in Infisical/Vercel.",
        code: "TOKEN_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  const provided = getBearerOrHeaderToken(request);
  if (!provided || provided !== expected) {
    return NextResponse.json(
      { message: "Invalid or missing invoice access token", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  return null;
}

function storageUnavailableResponse(): NextResponse {
  return NextResponse.json(
    {
      message:
        "Invoice storage is not configured. Set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_ACCOUNT_ID (or D1_ACCOUNT_ID).",
      code: "STORAGE_NOT_CONFIGURED",
    },
    { status: 503 },
  );
}

export async function GET(request: Request) {
  try {
    if (!isR2Configured()) {
      return storageUnavailableResponse();
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim();

    if (id) {
      const invoice = await getInvoice(id);
      if (!invoice) {
        return NextResponse.json(
          { message: "Invoice not found", code: "NOT_FOUND" },
          { status: 404 },
        );
      }
      return NextResponse.json({ invoice });
    }

    const authError = requireAccessToken(request);
    if (authError) return authError;

    const limitParam = Number(searchParams.get("limit") ?? "50");
    const limit = Number.isFinite(limitParam) ? limitParam : 50;
    const invoices = await listInvoices(limit);
    return NextResponse.json({ invoices });
  } catch (error) {
    if (error instanceof Error && error.message === "INVOICE_STORAGE_NOT_CONFIGURED") {
      return storageUnavailableResponse();
    }
    logger.error("Invoice GET failed", error);
    return NextResponse.json(
      { message: "Failed to load invoice(s)" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isR2Configured()) {
      return storageUnavailableResponse();
    }

    const authError = requireAccessToken(request);
    if (authError) return authError;

    const body = await request.json();
    const parsed = invoiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid invoice payload",
          code: "VALIDATION_ERROR",
          issues: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    if (!parsed.data.to.name.trim()) {
      return NextResponse.json(
        { message: "Client name is required", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const invoicePayload = {
      ...parsed.data,
      from: {
        name: parsed.data.from.name,
        email: parsed.data.from.email || undefined,
        phone: parsed.data.from.phone || undefined,
        address: parsed.data.from.address || undefined,
      },
      to: {
        name: parsed.data.to.name,
        email: parsed.data.to.email || undefined,
        phone: parsed.data.to.phone || undefined,
        address: parsed.data.to.address || undefined,
      },
      dueAt: parsed.data.dueAt || undefined,
      notes: parsed.data.notes || undefined,
    };

    if (!isValidInvoice(invoicePayload)) {
      return NextResponse.json(
        { message: "Invalid invoice payload", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const saved = await saveInvoice(invoicePayload);
    return NextResponse.json({ invoice: saved });
  } catch (error) {
    if (error instanceof Error && error.message === "INVOICE_STORAGE_NOT_CONFIGURED") {
      return storageUnavailableResponse();
    }
    if (error instanceof Error && error.message === "INVALID_INVOICE") {
      return NextResponse.json(
        { message: "Invalid invoice payload", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }
    logger.error("Invoice POST failed", error);
    return NextResponse.json(
      { message: "Failed to save invoice" },
      { status: 500 },
    );
  }
}
