import { Contact as ContactSection } from '@/components/contact/Index';
import {
  generateBreadcrumbSchema,
  generateContactPageSchema,
  pageConfig,
  siteConfig,
} from '@/utils/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: pageConfig.contact.title,
  description: pageConfig.contact.description,
  keywords: pageConfig.contact.keywords,
  robots: pageConfig.contact.robots,
  authors: [{ name: 'Nhlanhla Junior Malaza', url: siteConfig.url }],
  openGraph: {
    title: `${pageConfig.contact.title} | Nhlanhla Junior Malaza`,
    description: pageConfig.contact.description,
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_ZA',
    images: [
      {
        url: siteConfig.logo,
        width: 1200,
        height: 630,
        alt: 'Contact Nhlanhla Junior Malaza',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${pageConfig.contact.title} | Nhlanhla Junior Malaza`,
    description: pageConfig.contact.description,
    images: [siteConfig.logo],
    creator: siteConfig.social.twitter,
  },
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
};

const breadcrumbs = [
  { name: 'Home', url: siteConfig.url },
  { name: 'Contact', url: `${siteConfig.url}/contact` },
];

export default function Contact() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateContactPageSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />
      <div className="min-h-screen bg-background">
        <main className="pt-20">
          <ContactSection />
        </main>
      </div>
    </>
  );
}
