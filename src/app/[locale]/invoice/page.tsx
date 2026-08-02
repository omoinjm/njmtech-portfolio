import { InvoicePage } from "@/components/invoice/Index";
import { siteConfig } from "@/utils/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice",
  description: `Create and save NJMTECH invoices at ${siteConfig.url}`,
  robots: "noindex, follow",
  openGraph: {
    title: "NJMTECH Invoice",
    description: "Compose branded invoices for NJMTECH clients",
    url: `${siteConfig.url}/invoice`,
    siteName: siteConfig.name,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/invoice`,
  },
};

export default function InvoiceRoutePage() {
  return <InvoicePage />;
}
