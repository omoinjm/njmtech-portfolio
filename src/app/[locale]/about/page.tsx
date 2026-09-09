import { AboutPageContent } from "@/components/about/Index";
import {
  generateAboutPageSchema,
  generateBreadcrumbSchema,
  pageConfig,
  siteConfig,
} from "@/utils/seo";
import {
  getAboutContent,
  getEcosystemDivisions,
  getFounderContent,
  type Locale,
} from "@/sanity/lib/content";
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

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const [founder, aboutContent, ecosystemDivisions] = await Promise.all([
    getFounderContent(locale as Locale),
    getAboutContent(locale as Locale),
    getEcosystemDivisions(locale as Locale),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateAboutPageSchema()),
        }}
      />
      <div className="min-h-screen bg-background">
        <main className="pt-20">
          <AboutPageContent
            founder={founder}
            aboutContent={aboutContent}
            ecosystemDivisions={ecosystemDivisions}
          />
        </main>
      </div>
    </>
  );
}
