import type { NextPage } from 'next';
import SEOHead from '@/framework/components/SEOHead';
import { pageConfig } from '@/framework/utils/seo';
import { Projects } from '@/framework/components';

const services = [
  { title: 'HTML Email Templates', description: 'Responsive, cross-client HTML email templates.' },
  { title: 'E-commerce Site', description: 'Scalable e-commerce sites with modern UX.' },
  {
    title: 'WhatsApp Business Automation',
    description: 'Automated WhatsApp workflows and chatbots.',
  },
  {
    title: 'Website + WhatsApp Conversion System',
    description: 'Integrations to convert website visitors via WhatsApp.',
  },
  {
    title: 'Online Payments & Order Systems',
    description: 'Secure payment and order management solutions.',
  },
];

const servicesData = [
  {
    project_group_name: 'Services',
    project_group_key: 'first',
    project_group_icon: 'bx bxs-briefcase',
    projects: services.map((s, i) => ({
      live_url: '#',
      project_title: s.title,
      stack_json: [],
      img_url:
        'https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064195/public/assets/color-sharp_u65iaw.png',
      code_url: '',
      project_description: s.description,
      is_code: false,
      is_current_domian: false,
    })),
  },
];

const ServicesPage: NextPage = () => {
  return (
    <>
      <SEOHead {...pageConfig.services} />
      <Projects
        data={servicesData}
        title={'Services'}
        showTabs={false}
        subtitle={'Professional services to help your business grow. Explore the offerings below.'}
        showLinks={false}
        compact={true}
        sectionId={'services'}
      />
    </>
  );
};

export default ServicesPage;
