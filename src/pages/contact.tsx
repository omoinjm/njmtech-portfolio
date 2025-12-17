import type { NextPage } from 'next';
import { Contact } from '@/framework/components';
import SEOHead from '@/framework/components/SEOHead';
import { pageConfig } from '@/framework/utils/seo';

const ContactPage: NextPage = () => {
  return (
    <>
      <SEOHead {...pageConfig.contact} />
      <Contact />
    </>
  );
};

export default ContactPage;
