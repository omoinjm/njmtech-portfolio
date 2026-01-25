import { Contact as ContactSection } from '@/components/contact/Index';
import SEOHead from '@/components/SEOHead';
import { pageConfig } from '@/utils/seo';
import type { NextPage } from 'next';

export const dynamic = 'force-dynamic';

const Contact: NextPage = () => {
  return (
    <>
      <SEOHead {...pageConfig.contact} />

      <div className="min-h-screen bg-background">
        <main className="pt-20">
          <ContactSection />
        </main>
      </div>
    </>
  );
};

export default Contact;
