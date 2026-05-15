import { Projects as ProjectsSection } from "@/components/projects/Index";
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
  title: pageConfig.projects.title,
  description: pageConfig.projects.description,
  keywords: pageConfig.projects.keywords,
  robots: pageConfig.projects.robots,
  authors: [{ name: "Nhlanhla Junior Malaza", url: siteConfig.url }],
  openGraph: {
    title: `${pageConfig.projects.title} | Nhlanhla Junior Malaza`,
    description: pageConfig.projects.description,
    url: `${siteConfig.url}/projects`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_ZA",
    images: [
      {
        url: siteConfig.logo,
        width: 1200,
        height: 630,
        alt: "Projects by Nhlanhla Junior Malaza",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageConfig.projects.title} | Nhlanhla Junior Malaza`,
    description: pageConfig.projects.description,
    images: [siteConfig.logo],
    creator: siteConfig.social.twitter,
  },
  alternates: {
    canonical: `${siteConfig.url}/projects`,
  },
};

const fetchProjects = async (): Promise<TabProjectModel[]> => {
  const result: { all_project_groups?: { project_groups?: TabProjectModel[] } } =
    await DataService.get_call("projects", null);
  return result?.all_project_groups?.project_groups || [];
};

const breadcrumbs = [
  { name: "Home", url: siteConfig.url },
  { name: "Projects", url: `${siteConfig.url}/projects` },
];

export default async function Projects() {
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
          <ProjectsSection data={projects} />
        </main>
      </div>
    </>
  );
}
