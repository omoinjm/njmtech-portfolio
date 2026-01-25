import HomePage from '@/components/home/Index';
import SEOHead from '@/components/SEOHead';
import { generateWebsiteSchema, pageConfig } from '@/utils/seo';

import type { NextPage } from 'next';

const Home: NextPage = () => {
  const seoConfig = pageConfig.home;

  return (
    <>
      <SEOHead
        {...seoConfig}
        ogImage="https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064193/public/favicon_zqeo1n.ico"
        structuredData={generateWebsiteSchema()}
      />
      <HomePage />
    </>
  );
};

export default Home;
