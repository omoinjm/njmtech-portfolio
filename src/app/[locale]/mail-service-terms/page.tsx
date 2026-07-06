import { MailServiceTerms } from "@/components/legal/MailServiceTerms";
import {
  generateBreadcrumbSchema,
  pageConfig,
  siteConfig,
} from "@/utils/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: pageConfig["mail-service-terms"].title,
  description: pageConfig["mail-service-terms"].description,
  keywords: pageConfig["mail-service-terms"].keywords,
  robots: pageConfig["mail-service-terms"].robots,
  authors: [{ name: "Nhlanhla Junior Malaza", url: siteConfig.url }],
  openGraph: {
    title: `${pageConfig["mail-service-terms"].title} | Nhlanhla Junior Malaza`,
    description: pageConfig["mail-service-terms"].description,
    url: `${siteConfig.url}/mail-service-terms`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_ZA",
    images: [
      {
        url: siteConfig.logo,
        width: 1200,
        height: 630,
        alt: "NJMTECH Mail Service Terms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageConfig["mail-service-terms"].title} | Nhlanhla Junior Malaza`,
    description: pageConfig["mail-service-terms"].description,
    images: [siteConfig.logo],
    creator: siteConfig.social.twitterHandle,
  },
  alternates: {
    canonical: `${siteConfig.url}/mail-service-terms`,
  },
};

const breadcrumbs = [
  { name: "Home", url: siteConfig.url },
  { name: "Mail Service Terms", url: `${siteConfig.url}/mail-service-terms` },
];

export default function MailServiceTermsPage() {
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
          <MailServiceTerms />
        </main>
      </div>
    </>
  );
}
