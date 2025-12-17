import type { NextPage } from 'next';
import SEOHead from '@/framework/components/SEOHead';
import { pageConfig } from '@/framework/utils/seo';

const NotFoundPage: NextPage = () => {
  return (
    <>
      <SEOHead {...pageConfig['404']} />
      <div className="not-found-section">
        <h1>404 - Page Not Found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist.</p>
        <a href="/">Go Back Home</a>
      </div>
    </>
  );
};

export default NotFoundPage;
