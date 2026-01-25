import { Projects as ProjectsSection } from '@/components/projects/Index';
import SEOHead from '@/components/SEOHead';
import { generateBreadcrumbSchema, pageConfig } from '@/utils/seo';
import type { NextPage } from 'next';

export const dynamic = 'force-dynamic';

const Projects: NextPage = () => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
  ];

  return (
    <>
      <SEOHead
        {...pageConfig.projects}
        structuredData={generateBreadcrumbSchema(breadcrumbs)}
      />

      <div className="min-h-screen bg-background">
        <main className="pt-20">
          <ProjectsSection />
        </main>
      </div>
    </>
  );
};

export default Projects;
