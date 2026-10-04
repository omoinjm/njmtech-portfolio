import { VoiceAgentPrivacy } from "@/components/legal/VoiceAgentPrivacy";
import {
  generateBreadcrumbSchema,
  pageConfig,
  siteConfig,
} from "@/utils/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: pageConfig["voice-agent-privacy"].title,
  description: pageConfig["voice-agent-privacy"].description,
  keywords: pageConfig["voice-agent-privacy"].keywords,
  robots: pageConfig["voice-agent-privacy"].robots,
  authors: [{ name: "Nhlanhla Junior Malaza", url: siteConfig.url }],
  openGraph: {
    title: `${pageConfig["voice-agent-privacy"].title} | Nhlanhla Junior Malaza`,
    description: pageConfig["voice-agent-privacy"].description,
    url: `${siteConfig.url}/voice-agent-privacy`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_ZA",
    images: [
      {
        url: siteConfig.logo,
        width: 1200,
        height: 630,
        alt: "NJMTECH Voice Agent Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageConfig["voice-agent-privacy"].title} | Nhlanhla Junior Malaza`,
    description: pageConfig["voice-agent-privacy"].description,
    images: [siteConfig.logo],
    creator: siteConfig.social.twitterHandle,
  },
  alternates: {
    canonical: `${siteConfig.url}/voice-agent-privacy`,
  },
};

const breadcrumbs = [
  { name: "Home", url: siteConfig.url },
  { name: "Voice Agent Privacy Policy", url: `${siteConfig.url}/voice-agent-privacy` },
];

export default function VoiceAgentPrivacyPage() {
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
          <VoiceAgentPrivacy />
        </main>
      </div>
    </>
  );
}
