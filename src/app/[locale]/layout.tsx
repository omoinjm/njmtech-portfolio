import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout/Layout";
import { Providers } from "../providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig, pageConfig } from "@/utils/seo";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: "Nhlanhla Junior Malaza | Software Developer",
    template: "%s | Nhlanhla Junior Malaza",
  },
  description: siteConfig.description,
  keywords: pageConfig.home.keywords,
  authors: [{ name: "Nhlanhla Junior Malaza", url: siteConfig.url }],
  creator: "Nhlanhla Junior Malaza",
  publisher: "Nhlanhla Junior Malaza",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteConfig.url,
    siteName: "NJMTECH Portfolio",
    title: "Nhlanhla Junior Malaza | Software Developer",
    description: siteConfig.description,
    images: [{ url: siteConfig.logo, width: 1200, height: 630, alt: "NJMTECH Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.social.twitterHandle,
    creator: siteConfig.social.twitterHandle,
    title: "Nhlanhla Junior Malaza | Software Developer",
    description: siteConfig.description,
    images: [siteConfig.logo],
  },
  verification: { google: "uhCz2o1FOPTi4BlD_3yZ1Nw_ER4VAybFWURc5vBaIVo" },
  alternates: { canonical: siteConfig.url },
  category: "technology",
};

export const dynamic = "force-dynamic";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "zu")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <TooltipProvider>
          <Analytics />
          <Toaster />
          <Sonner />
          <Layout>{children}</Layout>
          <SpeedInsights />
        </TooltipProvider>
      </Providers>
    </NextIntlClientProvider>
  );
}
