import { Projects } from '@/framework/components';
import { TabProjectModel } from '@/framework/models';
import DataService from '@/framework/services/data.service';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import SEOHead from '@/framework/components/SEOHead';
import { pageConfig, generateBreadcrumbSchema } from '@/framework/utils/seo';

const fetchProjects = async (): Promise<TabProjectModel> => {
  return await DataService.get_call('projects', null);
};

const ProjectsPage: NextPage = () => {
  const [projects, setProjectData] = useState<TabProjectModel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result: any = await fetchProjects();
      setProjectData(result?.all_project_groups?.project_groups);
    };
    fetchData();
  }, []);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
  ];

  return (
    <>
      <SEOHead {...pageConfig.projects} structuredData={generateBreadcrumbSchema(breadcrumbs)} />
      <Projects data={projects} />
    </>
  );
};

export default ProjectsPage;
