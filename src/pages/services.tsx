import type { NextPage } from 'next';
import SEOHead from '@/framework/components/SEOHead';
import { pageConfig } from '@/framework/utils/seo';

const ServicesPage: NextPage = () => {
  return (
    <>
      <SEOHead {...pageConfig.services} />
      <div className="coming-soon-section">
        <h1>Services</h1>
        <p>
          Professional services including web development, DevOps engineering, and UI/UX design.
        </p>
      </div>
    </>
  );
};

export default ServicesPage;
