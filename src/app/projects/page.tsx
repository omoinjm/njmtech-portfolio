import { Projects as ProjectsSection } from "@/components/projects/Index";
import { generateBreadcrumbSchema, pageConfig, siteConfig } from "@/utils/seo";
import type { Metadata } from "next";
import { TabProjectModel } from "@/types";
import DataService from "@/services/data.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: pageConfig.projects.title,
  description: pageConfig.projects.description,
  keywords: pageConfig.projects.keywords,
  robots: pageConfig.projects.robots,
  authors: [{ name: "Nhlanhla Junior Malaza" }],
  openGraph: {
    title: pageConfig.projects.title,
    description: pageConfig.projects.description,
    url: `${siteConfig.url}/projects`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: pageConfig.projects.title,
    description: pageConfig.projects.description,
    creator: siteConfig.social.twitter,
  },
  alternates: {
    canonical: `${siteConfig.url}/projects`,
  },
};

const fetchProjects = async (): Promise<TabProjectModel[]> => {
  const result: any = await DataService.get_call("projects", null);
  return result?.all_project_groups?.project_groups || [];
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Projects", url: "/projects" },
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

      <div className="min-h-screen bg-background">
        <main className="pt-20">
          <ProjectsSection data={projects} />
        </main>
      </div>
    </>
  );
}
