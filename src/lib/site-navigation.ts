import { siteConfig } from "@/utils/seo";

/** Primary pages for nav, footer, and SEO sitelinks. */
export const PRIMARY_SITE_NAV = [
  {
    name: "Projects",
    path: "/projects",
    description:
      "Explore portfolio projects by Nhlanhla Junior Malaza — Next.js, React, TypeScript, and DevOps work.",
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
      "Get in touch via WhatsApp or email. NJMTECH replies within 4 business hours.",
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

/** Main nav excludes Blog (footer-only per restructure). */
export const MAIN_SITE_NAV = PRIMARY_SITE_NAV.filter(
  (item) => item.path !== "/blog",
);
