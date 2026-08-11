import {
  WHATSAPP_DISPLAY,
  WHATSAPP_E164,
  buildWhatsAppUrl,
} from "@/lib/social-links";
import { siteConfig } from "@/utils/seo";

export const BUSINESS_CONTACT = {
  email: siteConfig.email,
  phoneE164: WHATSAPP_E164,
  phoneDisplay: WHATSAPP_DISPLAY,
  location: `${siteConfig.location.city}, ${siteConfig.location.country}`,
} as const;

/** Lowest advertised starting price — update when packages change. */
export const STARTING_PRICE = "R4 999";

export const RESPONSE_TIME = "4 business hours";

export const SOCIAL_PROOF_STATS = [
  { value: "20+", label: "Projects delivered" },
  { value: "15+", label: "Happy clients" },
  { value: "5+", label: "Years experience" },
] as const;

export const CLIENT_INDUSTRIES = [
  "Retail",
  "Real Estate",
  "Professional Services",
  "Hospitality",
  "Education",
  "Non-profit",
] as const;

export type ServiceSlug =
  | "website-design"
  | "hosting-maintenance"
  | "seo-marketing"
  | "social-media"
  | "ai-automation"
  | "training-support";

export interface BusinessService {
  slug: ServiceSlug;
  icon: string;
  name: string;
  shortDescription: string;
  description: string;
  includes: string[];
  fromPrice: string;
  priceRange?: string;
  whatsappMessage: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export const BUSINESS_SERVICES: BusinessService[] = [
  {
    slug: "website-design",
    icon: "Globe",
    name: "Website Design & Development",
    shortDescription: "Fast, mobile-first sites that turn visitors into enquiries.",
    description:
      "We design and build professional websites tailored to your brand — from landing pages to full business sites with contact forms, analytics, and SEO foundations.",
    includes: [
      "Mobile-responsive design",
      "Contact form & WhatsApp integration",
      "Basic SEO setup",
      "Performance-optimised hosting ready",
    ],
    fromPrice: "R4 999",
    whatsappMessage:
      "Hi NJMTECH, I'd like a quote for Website Design & Development.",
  },
  {
    slug: "hosting-maintenance",
    icon: "Server",
    name: "Hosting & Maintenance",
    shortDescription: "Keep your site secure, updated, and online.",
    description:
      "Reliable hosting on modern infrastructure with ongoing updates, backups, and monitoring so you can focus on your business.",
    includes: [
      "Managed hosting setup",
      "Security patches & updates",
      "Backup monitoring",
      "Uptime checks",
    ],
    fromPrice: "R499",
    priceRange: "R499 – R1 499 / month",
    whatsappMessage:
      "Hi NJMTECH, I'd like a quote for Hosting & Maintenance.",
  },
  {
    slug: "seo-marketing",
    icon: "TrendingUp",
    name: "SEO & Digital Marketing",
    shortDescription: "Get found on Google by the customers searching for you.",
    description:
      "Technical SEO, local search optimisation, and content guidance to improve visibility and drive qualified traffic to your site.",
    includes: [
      "Site audit & keyword research",
      "On-page SEO improvements",
      "Google Business Profile guidance",
      "Monthly performance report",
    ],
    fromPrice: "R2 499",
    whatsappMessage: "Hi NJMTECH, I'd like a quote for SEO & Digital Marketing.",
  },
  {
    slug: "social-media",
    icon: "Share2",
    name: "Social Media Management",
    shortDescription: "Consistent presence without the daily grind.",
    description:
      "Content planning, posting schedules, and brand-aligned visuals so your business stays active and professional on social channels.",
    includes: [
      "Content calendar",
      "Post design & scheduling",
      "Brand voice guidelines",
      "Engagement monitoring",
    ],
    fromPrice: "R1 999",
    priceRange: "R1 999 – R4 999 / month",
    whatsappMessage:
      "Hi NJMTECH, I'd like a quote for Social Media Management.",
  },
  {
    slug: "ai-automation",
    icon: "Bot",
    name: "AI Integration & Automation",
    shortDescription: "Automate repetitive work and add smart assistants.",
    description:
      "Custom AI chatbots, workflow automation, and integrations that save time — from customer support to internal tooling.",
    includes: [
      "Requirements & workflow mapping",
      "AI assistant or chatbot setup",
      "API & tool integrations",
      "Documentation & handover",
    ],
    fromPrice: "R5 999",
    whatsappMessage:
      "Hi NJMTECH, I'd like a quote for AI Integration & Automation.",
  },
  {
    slug: "training-support",
    icon: "GraduationCap",
    name: "Training & Support",
    shortDescription: "Learn to manage your site with confidence.",
    description:
      "Hands-on training sessions and ongoing support so you and your team can update content, handle enquiries, and run day-to-day operations.",
    includes: [
      "1-on-1 or team training sessions",
      "CMS & admin walkthrough",
      "Written how-to guides",
      "Email support window",
    ],
    fromPrice: "R799",
    whatsappMessage: "Hi NJMTECH, I'd like a quote for Training & Support.",
  },
];

export const HOME_SERVICE_TILE_SLUGS: ServiceSlug[] = [
  "website-design",
  "hosting-maintenance",
  "seo-marketing",
  "ai-automation",
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "NJMTECH delivered our site on time and handled everything from design to launch. Enquiries picked up within the first month.",
    name: "Client A",
    role: "Owner",
    company: "Local retail business",
  },
  {
    quote:
      "Professional, responsive, and clear on pricing. The WhatsApp integration alone saved us hours every week.",
    name: "Client B",
    role: "Marketing lead",
    company: "Professional services firm",
  },
  {
    quote:
      "We needed a fast turnaround before a product launch — they scoped it properly and shipped exactly what we asked for.",
    name: "Client C",
    role: "Founder",
    company: "Startup",
  },
];

export const ABOUT_VALUES = [
  "Clear pricing before we start — no surprise invoices",
  "Mobile-first builds that load fast on South African networks",
  "Direct communication — you talk to the person building your site",
  "Launch support included so you're not left figuring it out alone",
] as const;

export const ABOUT_COMPANY_PARAGRAPHS = [
  "NJMTECH helps South African businesses get online with websites, hosting, and digital tools that actually drive enquiries — not just look pretty.",
  "We combine modern web development (Next.js, Cloudflare, AI integrations) with practical business focus: fast delivery, transparent pricing, and support you can reach on WhatsApp.",
] as const;

export const FOUNDER_BIO =
  "Founded by Nhlanhla Junior Malaza — full-stack developer and DevOps engineer based in Johannesburg. NJMTECH is the studio behind production-ready sites for SMEs, professionals, and growing brands across South Africa.";

export function getServiceQuoteUrl(service: BusinessService): string {
  return buildWhatsAppUrl(service.whatsappMessage);
}

export function getGeneralQuoteUrl(): string {
  return buildWhatsAppUrl(
    "Hi NJMTECH, I'd like to get a quote for a new project.",
  );
}

export function getServiceBySlug(slug: ServiceSlug): BusinessService | undefined {
  return BUSINESS_SERVICES.find((service) => service.slug === slug);
}
