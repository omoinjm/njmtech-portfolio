import { siteConfig } from "@/utils/seo";

/** Primary pages for nav, footer, and SEO sitelinks. */
export const PRIMARY_SITE_NAV = [
  {
    name: "Services",
    path: "/services",
    description:
      "Website design, hosting, SEO, social media, AI automation, and training for South African businesses.",
  },
  {
    name: "Projects",
    path: "/work",
    description:
      "Case studies and portfolio work — real projects with challenges, solutions, and results.",
  },
  {
    name: "About",
    path: "/about",
    description:
      "About NJMTECH — a Johannesburg-based web studio helping businesses get online and grow.",
  },
  {
    name: "Contact",
    path: "/contact",
    description:
      "Get a quote via WhatsApp or email. NJMTECH replies within 4 business hours.",
  },
  {
    name: "Blog",
    path: "/blog",
    description:
      "Tech notes and experiments — Cloudflare, Next.js, AI integrations, and software development.",
  },
] as const;

export type PrimarySiteNavItem = (typeof PRIMARY_SITE_NAV)[number];

export function getPrimarySiteNavUrl(path: string): string {
  return `${siteConfig.url.replace(/\/$/, "")}${path}`;
}

/** Primary nav items shown in the header (includes Blog and Projects). */
export const MAIN_SITE_NAV = PRIMARY_SITE_NAV;
