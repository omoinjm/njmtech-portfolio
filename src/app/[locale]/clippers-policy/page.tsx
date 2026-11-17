import { ClippersPolicy } from "@/components/legal/ClippersPolicy";
import {
  generateBreadcrumbSchema,
  pageConfig,
  siteConfig,
} from "@/utils/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: pageConfig["clippers-policy"].title,
  description: pageConfig["clippers-policy"].description,
  keywords: pageConfig["clippers-policy"].keywords,
  robots: pageConfig["clippers-policy"].robots,
  authors: [{ name: "Nhlanhla Junior Malaza", url: siteConfig.url }],
  openGraph: {
    title: `${pageConfig["clippers-policy"].title} | Nhlanhla Junior Malaza`,
    description: pageConfig["clippers-policy"].description,
    url: `${siteConfig.url}/clippers-policy`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_ZA",
    images: [
      {
        url: siteConfig.logo,
        width: 1200,
        height: 630,
        alt: "Clipper Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageConfig["clippers-policy"].title} | Nhlanhla Junior Malaza`,
    description: pageConfig["clippers-policy"].description,
    images: [siteConfig.logo],
    creator: siteConfig.social.twitterHandle,
  },
  alternates: {
    canonical: `${siteConfig.url}/clippers-policy`,
  },
};

const breadcrumbs = [
  { name: "Home", url: siteConfig.url },
  { name: "Clipper Privacy Policy", url: `${siteConfig.url}/clippers-policy` },
];

export default function ClippersPolicyPage() {
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
          <ClippersPolicy />
        </main>
      </div>
    </>
  );
}
