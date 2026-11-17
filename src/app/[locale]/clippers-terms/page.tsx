import { ClippersTerms } from "@/components/legal/ClippersTerms";
import {
  generateBreadcrumbSchema,
  pageConfig,
  siteConfig,
} from "@/utils/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: pageConfig["clippers-terms"].title,
  description: pageConfig["clippers-terms"].description,
  keywords: pageConfig["clippers-terms"].keywords,
  robots: pageConfig["clippers-terms"].robots,
  authors: [{ name: "Nhlanhla Junior Malaza", url: siteConfig.url }],
  openGraph: {
    title: `${pageConfig["clippers-terms"].title} | Nhlanhla Junior Malaza`,
    description: pageConfig["clippers-terms"].description,
    url: `${siteConfig.url}/clippers-terms`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_ZA",
    images: [
      {
        url: siteConfig.logo,
        width: 1200,
        height: 630,
        alt: "Clipper Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageConfig["clippers-terms"].title} | Nhlanhla Junior Malaza`,
    description: pageConfig["clippers-terms"].description,
    images: [siteConfig.logo],
    creator: siteConfig.social.twitterHandle,
  },
  alternates: {
    canonical: `${siteConfig.url}/clippers-terms`,
  },
};

const breadcrumbs = [
  { name: "Home", url: siteConfig.url },
  { name: "Clipper Terms of Service", url: `${siteConfig.url}/clippers-terms` },
];

export default function ClippersTermsPage() {
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
          <ClippersTerms />
        </main>
      </div>
    </>
  );
}
