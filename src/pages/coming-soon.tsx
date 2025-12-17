import type { NextPage } from 'next';
import SEOHead from '@/framework/components/SEOHead';
import { pageConfig } from '@/framework/utils/seo';

const ComingSoonPage: NextPage = () => {
  return (
    <>
      <SEOHead {...pageConfig['coming-soon']} />
      <div className="coming-soon-section">
        <h1>Coming Soon</h1>
        <p>Exciting new content and features coming to NJMTECH!</p>
      </div>
    </>
  );
};

export default ComingSoonPage;
