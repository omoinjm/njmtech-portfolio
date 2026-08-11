import { ServicesPageContent } from "@/components/services/Index";
import {
  generateBreadcrumbSchema,
  pageConfig,
  siteConfig,
} from "@/utils/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: pageConfig.services.title,
  description: pageConfig.services.description,
  keywords: pageConfig.services.keywords,
  robots: pageConfig.services.robots,
  openGraph: {
    title: `${pageConfig.services.title} | ${siteConfig.name}`,
    description: pageConfig.services.description,
    url: `${siteConfig.url}/services`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_ZA",
  },
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
};

const breadcrumbs = [
  { name: "Home", url: siteConfig.url },
  { name: "Services", url: `${siteConfig.url}/services` },
];

export default function ServicesPage() {
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
          <ServicesPageContent />
        </main>
      </div>
    </>
  );
}
