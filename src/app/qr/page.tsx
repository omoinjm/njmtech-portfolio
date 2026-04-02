import { QRCard } from "@/components/qr/QRCard";
import { pageConfig, siteConfig } from "@/utils/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code",
  description: `Scan to visit the portfolio of Nhlanhla Junior Malaza at ${siteConfig.url}`,
  robots: "noindex, follow",
  openGraph: {
    title: "Scan to visit Nhlanhla Junior Malaza's Portfolio",
    description: `Scan the QR code to visit ${siteConfig.url}`,
    url: `${siteConfig.url}/qr`,
    siteName: siteConfig.name,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/qr`,
  },
};

export default function QRPage() {
  return <QRCard />;
}
