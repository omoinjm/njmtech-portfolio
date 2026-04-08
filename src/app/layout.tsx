import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/index.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";
import { Providers } from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteConfig } from "@/utils/seo";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: "NJMTECH Portfolio",
  title: {
    default: "Nhlanhla Junior Malaza | Software Developer",
    template: "%s | Nhlanhla Junior Malaza",
  },
  description: siteConfig.description,
  keywords: [
    "Nhlanhla",
    "Nhlanhla Junior",
    "Nhlanhla Junior Malaza",
    "NJMTech",
    "software developer",
    "devops engineer",
    "South Africa developer",
  ],
  authors: [{ name: "Nhlanhla Junior Malaza", url: siteConfig.url }],
  creator: "Nhlanhla Junior Malaza",
  publisher: "Nhlanhla Junior Malaza",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    alternateLocale: "en_US",
    url: siteConfig.url,
    siteName: "NJMTECH Portfolio",
    title: "Nhlanhla Junior Malaza | Software Developer",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.logo,
        width: 1200,
        height: 630,
        alt: "Nhlanhla Junior Malaza — NJMTECH Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@njmalaza",
    creator: "@njmalaza",
    title: "Nhlanhla Junior Malaza | Software Developer",
    description: siteConfig.description,
    images: [siteConfig.logo],
  },
  verification: {
    google: "uhCz2o1FOPTi4BlD_3yZ1Nw_ER4VAybFWURc5vBaIVo",
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "technology",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <TooltipProvider>
            <Analytics />
            <Toaster />
            <Sonner />
            <Layout>{children}</Layout>
            <SpeedInsights />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
