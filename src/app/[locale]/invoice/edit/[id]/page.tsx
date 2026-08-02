import { InvoicePage } from "@/components/invoice/Index";
import { siteConfig } from "@/utils/seo";
import type { Metadata } from "next";

type InvoiceEditPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit Invoice",
  description: `Edit a saved NJMTECH invoice at ${siteConfig.url}`,
  robots: "noindex, follow",
};

export default async function InvoiceEditPage({ params }: InvoiceEditPageProps) {
  const { id } = await params;
  return <InvoicePage invoiceId={id} />;
}
