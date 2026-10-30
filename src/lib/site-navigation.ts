import { siteConfig } from "@/utils/seo";

/** Primary pages Google should surface as sitelinks (Projects, Contact, Blog). */
export const PRIMARY_SITE_NAV = [
  {
    name: "Projects",
    path: "/projects",
    description:
      "Explore portfolio projects by Nhlanhla Junior Malaza — Next.js, React, TypeScript, and DevOps work.",
  },
  {
    name: "Contact",
    path: "/contact",
    description:
      "Get in touch with Nhlanhla Junior Malaza for project inquiries, collaborations, and opportunities.",
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
