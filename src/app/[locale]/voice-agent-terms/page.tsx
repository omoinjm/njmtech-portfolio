import { VoiceAgentTerms } from "@/components/legal/VoiceAgentTerms";
import {
  generateBreadcrumbSchema,
  pageConfig,
  siteConfig,
} from "@/utils/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: pageConfig["voice-agent-terms"].title,
  description: pageConfig["voice-agent-terms"].description,
  keywords: pageConfig["voice-agent-terms"].keywords,
  robots: pageConfig["voice-agent-terms"].robots,
  authors: [{ name: "Nhlanhla Junior Malaza", url: siteConfig.url }],
  openGraph: {
    title: `${pageConfig["voice-agent-terms"].title} | Nhlanhla Junior Malaza`,
    description: pageConfig["voice-agent-terms"].description,
    url: `${siteConfig.url}/voice-agent-terms`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_ZA",
    images: [
      {
        url: siteConfig.logo,
        width: 1200,
        height: 630,
        alt: "NJMTECH Voice Agent Terms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageConfig["voice-agent-terms"].title} | Nhlanhla Junior Malaza`,
    description: pageConfig["voice-agent-terms"].description,
    images: [siteConfig.logo],
    creator: siteConfig.social.twitterHandle,
  },
  alternates: {
    canonical: `${siteConfig.url}/voice-agent-terms`,
  },
};

const breadcrumbs = [
  { name: "Home", url: siteConfig.url },
  { name: "Voice Agent Terms", url: `${siteConfig.url}/voice-agent-terms` },
];

export default function VoiceAgentTermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />
      <div className="min-h-screen bg-background">
        <main className="pt-20">
          <VoiceAgentTerms />
        </main>
      </div>
    </>
  );
}
