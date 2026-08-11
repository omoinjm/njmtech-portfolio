import { CaseStudies } from "@/components/work/CaseStudies";
import {
  generateBreadcrumbSchema,
  generatePortfolioPageSchema,
  pageConfig,
  siteConfig,
} from "@/utils/seo";
import type { Metadata } from "next";
import { TabProjectModel } from "@/types";
import DataService from "@/services/data.service";

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

const fetchProjects = async (): Promise<TabProjectModel[]> => {
  const result: { all_project_groups?: { project_groups?: TabProjectModel[] } } =
    await DataService.get_call("projects", null);
  return result?.all_project_groups?.project_groups || [];
};

const breadcrumbs = [
  { name: "Home", url: siteConfig.url },
  { name: "Work", url: `${siteConfig.url}/work` },
];

export default async function WorkPage() {
  const projects = await fetchProjects();

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
