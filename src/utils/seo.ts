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
    "Professional portfolio of Nhlanhla Junior Malaza — Software Developer, DevOps Engineer, and UI/UX Designer based in South Africa",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://njmtech.co.za",
  email: "njmalaza@outlook.com",
  social: {
    linkedin: "https://www.linkedin.com/in/njmalaza",
    github: "https://github.com/njmalaza",
    twitter: "@njmalaza",
  },
  logo: "/logo.png",
  locales: ["en_ZA", "en_US"],
  locale: "en_ZA",
};

export const pageConfig: Record<string, SEOProps> = {
  home: {
    title: "Nhlanhla Junior Malaza | Software Developer, DevOps Engineer & UI/UX Designer",
    description:
      "Portfolio of Nhlanhla Junior Malaza (Nhlanhla Junior) — Software Developer, DevOps Engineer, and UI/UX Designer from South Africa. Expert in Next.js, React, TypeScript, Node.js, and cloud infrastructure.",
    canonical: `${siteConfig.url}/`,
    keywords: [
      "Nhlanhla",
      "Nhlanhla Junior",
      "Nhlanhla Junior Malaza",
      "Nhlanhla Malaza",
      "NJMTech",
      "NJM",
      "njmalaza",
      "software developer South Africa",
      "devops engineer South Africa",
      "ui ux designer",
      "next.js developer",
      "react developer",
      "typescript developer",
      "full stack developer",
      "portfolio",
      "web developer portfolio",
      "South Africa developer",
      "freelance developer",
    ],
    ogType: "profile",
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  },

  projects: {
    title: "Projects",
    description:
      "Explore the portfolio projects of Nhlanhla Junior Malaza — built with Next.js, React, TypeScript, Node.js, Docker, and more. Real-world solutions by a South African full-stack developer.",
    canonical: `${siteConfig.url}/projects`,
    keywords: [
      "Nhlanhla Junior Malaza projects",
      "NJMTech projects",
      "web development projects",
      "full stack projects",
      "react projects",
      "next.js projects",
      "typescript projects",
      "portfolio projects",
      "software developer portfolio South Africa",
      "devops projects",
    ],
    ogType: "website",
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  },

  contact: {
    title: "Contact",
    description:
      "Get in touch with Nhlanhla Junior Malaza for project inquiries, collaborations, or professional opportunities. South Africa-based software developer available for freelance and full-time work.",
    canonical: `${siteConfig.url}/contact`,
    keywords: [
      "contact Nhlanhla Junior Malaza",
      "hire software developer South Africa",
      "Nhlanhla Junior contact",
      "NJMTech contact",
      "freelance developer South Africa",
      "hire full stack developer",
      "collaboration",
      "project inquiry",
    ],
    ogType: "website",
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  },

  services: {
    title: "Services",
    description:
      "Professional services by Nhlanhla Junior Malaza — web development, DevOps engineering, and UI/UX design tailored for modern businesses.",
    canonical: `${siteConfig.url}/services`,
    keywords: [
      "services Nhlanhla Junior Malaza",
      "web development services",
      "devops services",
      "ui ux design services",
      "consulting South Africa",
      "NJMTech services",
    ],
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
    "@id": `${siteConfig.url}/#person`,
    name: "Nhlanhla Junior Malaza",
    givenName: "Nhlanhla",
    additionalName: "Junior",
    familyName: "Malaza",
    alternateName: ["Nhlanhla Junior", "Nhlanhla Malaza", "NJM", "NJMTech"],
    url: siteConfig.url,
    email: siteConfig.email,
    image: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.logo}`,
      caption: "Nhlanhla Junior Malaza — Software Developer",
    },
    description:
      "Nhlanhla Junior Malaza is a Software Developer, DevOps Engineer, and UI/UX Designer based in South Africa, specialising in modern web technologies and cloud infrastructure.",
    knowsLanguage: ["en"],
    nationality: {
      "@type": "Country",
      name: "South Africa",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "ZA",
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      `https://twitter.com/njmalaza`,
      siteConfig.url,
    ],
    jobTitle: [
      "Software Developer",
      "DevOps Engineer",
      "UI/UX Designer",
      "Full Stack Developer",
    ],
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Kubernetes",
      "DevOps",
      "Web Design",
      "UI/UX Design",
      "Full Stack Development",
      "Cloud Infrastructure",
      "CI/CD",
      "Software Architecture",
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
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.logo}`,
    },
    description: siteConfig.description,
    founder: { "@id": `${siteConfig.url}/#person` },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      `https://twitter.com/njmalaza`,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: siteConfig.email,
      availableLanguage: "English",
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
    "@id": `${siteConfig.url}/#website`,
    name: "Nhlanhla Junior Malaza | NJMTECH Portfolio",
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en-ZA",
    author: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: "Nhlanhla Junior Malaza",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate ProfilePage schema for the home/about page
 */
export function generateProfilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteConfig.url}/#profilepage`,
    name: "Nhlanhla Junior Malaza — Software Developer Portfolio",
    url: siteConfig.url,
    description:
      "Professional portfolio and profile of Nhlanhla Junior Malaza, a Software Developer, DevOps Engineer, and UI/UX Designer based in South Africa.",
    inLanguage: "en-ZA",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    mainEntity: { "@id": `${siteConfig.url}/#person` },
  };
}

/**
 * Generate ContactPage schema
 */
export function generateContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteConfig.url}/contact#contactpage`,
    name: "Contact Nhlanhla Junior Malaza",
    url: `${siteConfig.url}/contact`,
    description:
      "Contact page for Nhlanhla Junior Malaza — available for project inquiries, collaborations, and professional opportunities.",
    inLanguage: "en-ZA",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    mainEntity: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: "Nhlanhla Junior Malaza",
      email: siteConfig.email,
    },
  };
}

/**
 * Generate CollectionPage schema for the projects listing
 */
export function generatePortfolioPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteConfig.url}/projects#collectionpage`,
    name: "Projects by Nhlanhla Junior Malaza",
    url: `${siteConfig.url}/projects`,
    description:
      "A collection of web development and software projects by Nhlanhla Junior Malaza, showcasing expertise in Next.js, React, TypeScript, and DevOps.",
    inLanguage: "en-ZA",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    author: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: "Nhlanhla Junior Malaza",
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
  generateProfilePageSchema,
  generateContactPageSchema,
  generatePortfolioPageSchema,
  generateBreadcrumbSchema,
  generateMetaTags,
  getPageSEO,
};
