import { AboutPageContent } from "@/components/about/Index";
import {
  generateBreadcrumbSchema,
  pageConfig,
  siteConfig,
} from "@/utils/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: pageConfig.about.title,
  description: pageConfig.about.description,
  keywords: pageConfig.about.keywords,
  robots: pageConfig.about.robots,
  openGraph: {
    title: `${pageConfig.about.title} | ${siteConfig.name}`,
    description: pageConfig.about.description,
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_ZA",
  },
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
};

const breadcrumbs = [
  { name: "Home", url: siteConfig.url },
  { name: "About", url: `${siteConfig.url}/about` },
];

export default function AboutPage() {
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
          <AboutPageContent />
        </main>
      </div>
    </>
  );
}
