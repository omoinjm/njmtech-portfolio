import { NextResponse } from "next/server";
import { isR2Configured } from "@/lib/r2-client";
import { invoicePdfFilename, renderInvoicePdf } from "@/lib/invoice-pdf";
import { getInvoice } from "@/services/invoice-storage.service";
import { logger } from "@/utils/logger";

export const runtime = "nodejs";

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

    if (!id) {
      return NextResponse.json(
        {
          message: "Invoice id is required. Save the invoice first, then download the PDF.",
          code: "ID_REQUIRED",
        },
        { status: 400 },
      );
    }

    const invoice = await getInvoice(id);
    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const pdf = await renderInvoicePdf(invoice);
    const filename = invoicePdfFilename(invoice);

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVOICE_STORAGE_NOT_CONFIGURED"
    ) {
      return storageUnavailableResponse();
    }
    logger.error("Invoice PDF generation failed", error);
    return NextResponse.json(
      { message: "Failed to generate invoice PDF" },
      { status: 500 },
    );
  }
}
