import { client } from "@/sanity/lib/client";
import {
  aboutContentQuery,
  ecosystemDivisionsQuery,
  founderQuery,
  heroContentQuery,
} from "@/sanity/lib/queries";
import { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

type LocaleString = Partial<Record<Locale, string>> | null | undefined;
type LocaleStringList = Partial<Record<Locale, string[]>> | null | undefined;

function pickLocale(value: LocaleString, locale: Locale, fallback: string): string {
  return value?.[locale] || value?.en || fallback;
}

function pickLocaleList(
  value: LocaleStringList,
  locale: Locale,
  fallback: string[],
): string[] {
  const resolved = value?.[locale] || value?.en;
  return resolved && resolved.length > 0 ? resolved : fallback;
}

/** Sane defaults so pages still render correctly before Sanity documents are created/published. */
const HERO_FALLBACK = {
  welcomeBadge: "Johannesburg · Taking new clients",
  headline: "Engineered Solutions for the Digital & Physical Frontier.",
  subtitle:
    "I'm Nhlanhla Junior Malaza, Founder & Lead Engineer at Open Akha Studio (an Open Akha Labs company). I build high-performance web applications, custom digital tools, and scalable software systems.",
};

const FOUNDER_FALLBACK = {
  bio: "Founded by Nhlanhla Junior Malaza — full-stack developer and DevOps engineer based in Johannesburg. NJMTECH is the studio behind production-ready sites for SMEs, professionals, and growing brands across South Africa.",
  extendedRole:
    "Beyond njmtech, Nhlanhla Junior Malaza is Founder & Lead Engineer at Open Akha Studio, an Open Akha Labs company.",
};

const ABOUT_FALLBACK = {
  companyParagraphs: [
    "NJMTECH helps South African businesses get online with websites, hosting, and digital tools that actually drive enquiries — not just look pretty.",
    "We combine modern web development (Next.js, Cloudflare, AI integrations) with practical business focus: fast delivery, transparent pricing, and support you can reach on WhatsApp.",
  ],
  values: [
    "Clear pricing before we start — no surprise invoices",
    "Mobile-first builds that load fast on South African networks",
    "Direct communication — you talk to the person building your site",
    "Launch support included so you're not left figuring it out alone",
  ],
  clientIndustries: [
    "Retail",
    "Real Estate",
    "Professional Services",
    "Hospitality",
    "Education",
    "Non-profit",
  ],
};

const ECOSYSTEM_DIVISIONS_FALLBACK = [
  {
    key: "open-studio",
    name: "Open Akha Studio",
    tagline: "Enterprise Web Architecture, Custom Web Apps & Mobile Platforms.",
    statusLabel: null as string | null,
    url: "#",
  },
  {
    key: "open-intelligence",
    name: "Open Akha Intelligence",
    tagline: "AI Workflows, Autonomous Agents & Custom Tooling.",
    statusLabel: "In Development" as string | null,
    url: null,
  },
  {
    key: "open-dynamics",
    name: "Open Akha Dynamics",
    tagline: "Physical Automation, IoT & Robotics R&D.",
    statusLabel: "Future Division" as string | null,
    url: null,
  },
];

export interface HeroContent {
  welcomeBadge: string;
  headline: string;
  subtitle: string;
}

export async function getHeroContent(locale: Locale): Promise<HeroContent> {
  const doc = await client.fetch<{
    welcomeBadge?: LocaleString;
    headline?: LocaleString;
    subtitle?: LocaleString;
  } | null>(heroContentQuery).catch(() => null);

  return {
    welcomeBadge: pickLocale(doc?.welcomeBadge, locale, HERO_FALLBACK.welcomeBadge),
    headline: pickLocale(doc?.headline, locale, HERO_FALLBACK.headline),
    subtitle: pickLocale(doc?.subtitle, locale, HERO_FALLBACK.subtitle),
  };
}

export interface FounderContent {
  bio: string;
  extendedRole: string;
}

export async function getFounderContent(locale: Locale): Promise<FounderContent> {
  const doc = await client
    .fetch<{ bio?: LocaleString; extendedRole?: LocaleString } | null>(founderQuery)
    .catch(() => null);

  return {
    bio: pickLocale(doc?.bio, locale, FOUNDER_FALLBACK.bio),
    extendedRole: pickLocale(doc?.extendedRole, locale, FOUNDER_FALLBACK.extendedRole),
  };
}

export interface AboutContent {
  companyParagraphs: string[];
  values: string[];
  clientIndustries: string[];
}

export async function getAboutContent(locale: Locale): Promise<AboutContent> {
  const doc = await client
    .fetch<{
      companyParagraphs?: LocaleStringList;
      values?: LocaleStringList;
      clientIndustries?: LocaleStringList;
    } | null>(aboutContentQuery)
    .catch(() => null);

  return {
    companyParagraphs: pickLocaleList(
      doc?.companyParagraphs,
      locale,
      ABOUT_FALLBACK.companyParagraphs,
    ),
    values: pickLocaleList(doc?.values, locale, ABOUT_FALLBACK.values),
    clientIndustries: pickLocaleList(
      doc?.clientIndustries,
      locale,
      ABOUT_FALLBACK.clientIndustries,
    ),
  };
}

export interface EcosystemDivisionContent {
  key: string;
  name: string;
  tagline: string;
  statusLabel: string | null;
  url: string | null;
}

export async function getEcosystemDivisions(
  locale: Locale,
): Promise<EcosystemDivisionContent[]> {
  const docs = await client
    .fetch<
      Array<{
        key: string;
        name: string;
        tagline?: LocaleString;
        statusLabel?: LocaleString;
        url?: string | null;
      }>
    >(ecosystemDivisionsQuery)
    .catch(() => []);

  if (!docs || docs.length === 0) {
    return ECOSYSTEM_DIVISIONS_FALLBACK;
  }

  return docs.map((doc) => ({
    key: doc.key,
    name: doc.name,
    tagline: pickLocale(doc.tagline, locale, ""),
    statusLabel: doc.statusLabel ? pickLocale(doc.statusLabel, locale, "") || null : null,
    url: doc.url || null,
  }));
}
