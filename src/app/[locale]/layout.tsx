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
import { getMenuLinks } from "@/services/sql.service";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: "NJMTECH Official Site | Nhlanhla Malaza",
    template: "%s | Nhlanhla Malaza",
  },
  description: siteConfig.description,
  keywords: pageConfig.home.keywords,
  authors: [{ name: "Nhlanhla Junior Malaza", url: siteConfig.url }],
  creator: "Nhlanhla Junior Malaza",
  publisher: "Nhlanhla Junior Malaza",
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#229c9a" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  appleWebApp: {
    capable: true,
    title: siteConfig.shortName,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon.png",
      },
      {
        rel: "mask-icon",
        url: "/icon-512.png",
        color: "#229c9a",
      },
    ],
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
    siteName: "NJMTECH",
    title: "NJMTECH Official Site | Nhlanhla Malaza — Software Developer",
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Nhlanhla Malaza — NJMTech Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.social.twitterHandle,
    creator: siteConfig.social.twitterHandle,
    title: "Nhlanhla Malaza | Software Developer — NJMTech",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  verification: { google: "uhCz2o1FOPTi4BlD_3yZ1Nw_ER4VAybFWURc5vBaIVo" },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      en: siteConfig.url,
      zu: `${siteConfig.url}/zu`,
    },
  },
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
  const menuLinks = await getMenuLinks();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <TooltipProvider>
          <Analytics />
          <Toaster />
          <Sonner />
          <Layout menuLinks={menuLinks}>{children}</Layout>
          <SpeedInsights />
        </TooltipProvider>
      </Providers>
    </NextIntlClientProvider>
  );
}
