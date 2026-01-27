/**
 * SEO Configuration and utilities for NJMTECH Portfolio
 * Handles meta tags, Open Graph, structured data, and more
 */

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterHandle?: string;
  keywords?: string[];
  author?: string;
  robots?: string;
  viewport?: string;
}

export const siteConfig = {
  name: "NJMTECH Portfolio",
  shortName: "NJMTECH",
  description:
    "Professional portfolio of Nhlanhla Junior Malaza - Software Developer, DevOps Engineer, and UI/UX Designer",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://njmtech.vercel.app",
  email: "njmcloud@gmail.com",
  social: {
    linkedin: "https://www.linkedin.com/in/njmalaza",
    github: "https://github.com/njmalaza",
    twitter: "@njmalaza",
  },
  logo: "https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064193/public/favicon_zqeo1n.ico",
  locales: ["en_US"],
  locale: "en_US",
};

export const pageConfig: Record<string, SEOProps> = {
  home: {
    title: "Nhlanhla Junior Malaza",
    description:
      "Portfolio of Nhlanhla Junior Malaza - Software Developer, DevOps Engineer, and UI/UX Designer with expertise in modern web technologies",
    canonical: `${siteConfig.url}/`,
    keywords: [
      "software developer",
      "devops engineer",
      "ui ux designer",
      "next.js",
      "react",
      "typescript",
      "portfolio",
      "njmtech",
    ],
    ogType: "website",
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  },

  projects: {
    title: "Projects | Nhlanhla Junior Malaza",
    description:
      "View my portfolio of projects built with modern technologies including Next.js, React, TypeScript, and more",
    canonical: `${siteConfig.url}/projects`,
    keywords: [
      "projects",
      "portfolio",
      "web development",
      "react projects",
      "next.js projects",
      "fullstack projects",
    ],
    ogType: "website",
    robots: "index, follow",
  },

  contact: {
    title: "Contact | Nhlanhla Junior Malaza",
    description:
      "Get in touch with me for project inquiries, collaborations, or professional opportunities",
    canonical: `${siteConfig.url}/contact`,
    keywords: ["contact", "email", "hire", "collaboration", "inquiries"],
    ogType: "website",
    robots: "index, follow",
  },

  services: {
    title: "Services | Nhlanhla Junior Malaza",
    description:
      "Professional services including web development, DevOps engineering, and UI/UX design",
    canonical: `${siteConfig.url}/services`,
    keywords: ["services", "web development", "devops", "design", "consulting"],
    ogType: "website",
    robots: "index, follow",
  },

  "coming-soon": {
    title: "Coming Soon | Nhlanhla Junior Malaza",
    description: "Exciting new content and features coming soon to NJMTECH",
    canonical: `${siteConfig.url}/coming-soon`,
    keywords: ["coming soon"],
    ogType: "website",
    robots: "noindex, nofollow",
  },

  "404": {
    title: "Page Not Found | Nhlanhla Junior Malaza",
    description: "The page you're looking for doesn't exist",
    keywords: ["404", "not found"],
    ogType: "website",
    robots: "noindex, follow",
  },
};

/**
 * Generate structured data (JSON-LD) for better search engine understanding
 */
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nhlanhla Junior Malaza",
    url: siteConfig.url,
    email: siteConfig.email,
    image: siteConfig.logo,
    description: siteConfig.description,
    knowsLanguage: ["en"],
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.twitter,
    ],
    jobTitle: ["Software Developer", "DevOps Engineer", "UI/UX Designer"],
    skills: [
      "Next.js",
      "React",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "AWS",
      "DevOps",
      "Web Design",
      "UI/UX",
      "Full Stack Development",
    ],
  };
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    logo: siteConfig.logo,
    description: siteConfig.description,
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.twitter,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: siteConfig.email,
    },
  };
}

/**
 * Generate WebSite schema for search engines
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    searchAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      query_input: "required name=search_term_string",
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate default meta tags based on page config
 */
export function generateMetaTags(config: SEOProps) {
  const tags: Array<{
    name?: string;
    property?: string;
    content: string;
    key?: string;
  }> = [
    {
      name: "viewport",
      content:
        config.viewport ||
        "width=device-width, initial-scale=1, maximum-scale=5",
      key: "viewport",
    },
    {
      name: "description",
      content: config.description,
      key: "description",
    },
    {
      name: "robots",
      content: config.robots || "index, follow",
      key: "robots",
    },
    {
      name: "author",
      content: config.author || "Nhlanhla Junior Malaza",
      key: "author",
    },
    {
      property: "og:title",
      content: config.title,
      key: "og:title",
    },
    {
      property: "og:description",
      content: config.description,
      key: "og:description",
    },
    {
      property: "og:type",
      content: config.ogType || "website",
      key: "og:type",
    },
    {
      property: "og:url",
      content: config.canonical || siteConfig.url,
      key: "og:url",
    },
    {
      property: "og:image",
      content: config.ogImage || siteConfig.logo,
      key: "og:image",
    },
    {
      property: "og:site_name",
      content: siteConfig.name,
      key: "og:site_name",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
      key: "twitter:card",
    },
    {
      name: "twitter:title",
      content: config.title,
      key: "twitter:title",
    },
    {
      name: "twitter:description",
      content: config.description,
      key: "twitter:description",
    },
    {
      name: "twitter:image",
      content: config.ogImage || siteConfig.logo,
      key: "twitter:image",
    },
    {
      name: "twitter:creator",
      content: siteConfig.social.twitter,
      key: "twitter:creator",
    },
  ];

  // Add keywords if provided
  if (config.keywords && config.keywords.length > 0) {
    tags.push({
      name: "keywords",
      content: config.keywords.join(", "),
      key: "keywords",
    });
  }

  return tags;
}

/**
 * Get page-specific SEO config
 */
export function getPageSEO(page: string): SEOProps {
  return pageConfig[page] || pageConfig.home;
}

export default {
  siteConfig,
  pageConfig,
  generatePersonSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateMetaTags,
  getPageSEO,
};
