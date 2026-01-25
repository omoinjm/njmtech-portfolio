import SEOHead from '@/components/SEOHead';
import { pageConfig } from '@/utils/seo';
import type { NextPage } from 'next';

const NotFound: NextPage = () => {
  return (
    <>
      <SEOHead {...pageConfig['404']} />

      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">Page not found</p>
          <a
            href="/"
            className="px-6 py-3 rounded-full gradient-bg text-foreground font-semibold hover:opacity-90 transition-opacity inline-block"
          >
            Go Home
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
