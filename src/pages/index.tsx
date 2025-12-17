import { SkillModel } from '@/framework/models/skill_models';
import DataService from '@/framework/services/data.service';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Hero, Skills } from '@/framework/components';
import SEOHead from '@/framework/components/SEOHead';
import { pageConfig, generateWebsiteSchema } from '@/framework/utils/seo';

const fetchSkills = async (): Promise<SkillModel[]> => {
  return await DataService.get_call('skills', null);
};

const Home: NextPage = () => {
  const [skills, setSkillData] = useState<SkillModel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setSkillData(await fetchSkills());
    };
    fetchData();
  }, []);

  const seoConfig = pageConfig.home;

  return (
    <>
      <SEOHead
        {...seoConfig}
        ogImage="https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064193/public/favicon_zqeo1n.ico"
        structuredData={generateWebsiteSchema()}
      />
      <Hero />
      <Skills data={skills} />
    </>
  );
};

export default Home;
