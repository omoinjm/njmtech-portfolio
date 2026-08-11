import { CaseStudies } from "@/components/work/CaseStudies";
import { getProjects } from "@/services/sql.service";
import {
  generateBreadcrumbSchema,
  generatePortfolioPageSchema,
  pageConfig,
  siteConfig,
} from "@/utils/seo";
import type { Metadata } from "next";
import { TabProjectModel } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: pageConfig.work.title,
  description: pageConfig.work.description,
  keywords: pageConfig.work.keywords,
  robots: pageConfig.work.robots,
  openGraph: {
    title: `${pageConfig.work.title} | ${siteConfig.name}`,
    description: pageConfig.work.description,
    url: `${siteConfig.url}/work`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_ZA",
  },
  alternates: {
    canonical: `${siteConfig.url}/work`,
  },
};

const breadcrumbs = [
  { name: "Home", url: siteConfig.url },
  { name: "Work", url: `${siteConfig.url}/work` },
];

export default async function WorkPage() {
  let projects: TabProjectModel[] = [];

  try {
    const result = await getProjects();
    projects = result.all_project_groups?.project_groups ?? [];
  } catch {
    projects = [];
  }

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
          __html: JSON.stringify(generatePortfolioPageSchema()),
        }}
      />
      <div className="min-h-screen bg-background">
        <main className="pt-20">
          <CaseStudies data={projects} />
        </main>
      </div>
    </>
  );
}
