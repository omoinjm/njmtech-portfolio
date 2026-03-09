import { Contact as ContactSection } from '@/components/contact/Index';
import { pageConfig, siteConfig } from '@/utils/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: pageConfig.contact.title,
  description: pageConfig.contact.description,
  keywords: pageConfig.contact.keywords,
  robots: pageConfig.contact.robots,
  authors: [{ name: 'Nhlanhla Junior Malaza' }],
  openGraph: {
    title: pageConfig.contact.title,
    description: pageConfig.contact.description,
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageConfig.contact.title,
    description: pageConfig.contact.description,
    creator: siteConfig.social.twitter,
  },
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        <ContactSection />
      </main>
    </div>
  );
}
