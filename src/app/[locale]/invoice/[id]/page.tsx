import { InvoicePage } from "@/components/invoice/Index";
import { siteConfig } from "@/utils/seo";
import type { Metadata } from "next";

type InvoiceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Invoice",
  description: `View a saved NJMTECH invoice at ${siteConfig.url}`,
  robots: "noindex, follow",
};

export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { id } = await params;
  return <InvoicePage invoiceId={id} />;
}
