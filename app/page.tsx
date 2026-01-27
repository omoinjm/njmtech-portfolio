import HomePage from '@/components/home/Index';
import { generateWebsiteSchema, pageConfig, siteConfig } from '@/utils/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: pageConfig.home.title,
  description: pageConfig.home.description,
  keywords: pageConfig.home.keywords,
  robots: pageConfig.home.robots,
  authors: [{ name: 'Nhlanhla Junior Malaza' }],
  openGraph: {
    title: pageConfig.home.title,
    description: pageConfig.home.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
    images: [
      {
        url: siteConfig.logo,
        width: 1200,
        height: 630,
        alt: pageConfig.home.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageConfig.home.title,
    description: pageConfig.home.description,
    images: [siteConfig.logo],
    creator: siteConfig.social.twitter,
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateWebsiteSchema()),
        }}
      />
      <HomePage />
    </>
  );
}
