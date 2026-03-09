import { Projects as ProjectsSection } from '@/components/projects/Index';
import {
  generateBreadcrumbSchema,
  pageConfig,
  siteConfig,
} from '@/utils/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: pageConfig.projects.title,
  description: pageConfig.projects.description,
  keywords: pageConfig.projects.keywords,
  robots: pageConfig.projects.robots,
  authors: [{ name: 'Nhlanhla Junior Malaza' }],
  openGraph: {
    title: pageConfig.projects.title,
    description: pageConfig.projects.description,
    url: `${siteConfig.url}/projects`,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageConfig.projects.title,
    description: pageConfig.projects.description,
    creator: siteConfig.social.twitter,
  },
  alternates: {
    canonical: `${siteConfig.url}/projects`,
  },
};

export default function Projects() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
  ];

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
          <ProjectsSection />
        </main>
      </div>
    </>
  );
}
