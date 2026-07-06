import { MailServicePolicy } from "@/components/legal/MailServicePolicy";
import {
  generateBreadcrumbSchema,
  pageConfig,
  siteConfig,
} from "@/utils/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: pageConfig["mail-service-policy"].title,
  description: pageConfig["mail-service-policy"].description,
  keywords: pageConfig["mail-service-policy"].keywords,
  robots: pageConfig["mail-service-policy"].robots,
  authors: [{ name: "Nhlanhla Junior Malaza", url: siteConfig.url }],
  openGraph: {
    title: `${pageConfig["mail-service-policy"].title} | Nhlanhla Junior Malaza`,
    description: pageConfig["mail-service-policy"].description,
    url: `${siteConfig.url}/mail-service-policy`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_ZA",
    images: [
      {
        url: siteConfig.logo,
        width: 1200,
        height: 630,
        alt: "NJMTECH Mail Service Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageConfig["mail-service-policy"].title} | Nhlanhla Junior Malaza`,
    description: pageConfig["mail-service-policy"].description,
    images: [siteConfig.logo],
    creator: siteConfig.social.twitterHandle,
  },
  alternates: {
    canonical: `${siteConfig.url}/mail-service-policy`,
  },
};

const breadcrumbs = [
  { name: "Home", url: siteConfig.url },
  { name: "Mail Service Policy", url: `${siteConfig.url}/mail-service-policy` },
];

export default function MailServicePolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />
      <div className="min-h-screen bg-background">
        <main className="pt-20">
          <MailServicePolicy />
        </main>
      </div>
    </>
  );
}
