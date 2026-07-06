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
  name: "NJMTECH",
  shortName: "NJMTECH",
  description:
    "Professional portfolio of Nhlanhla Junior Malaza — Software Developer, DevOps Engineer, and AI Integrations Specialist based in South Africa",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://njmtech.co.za",
  email: "njmalaza@outlook.com",
  telephone: "+27 72 432 6766",
  social: {
    linkedin: "https://www.linkedin.com/in/njmalaza",
    github: "https://github.com/omoinjm",
    twitterUrl: "https://twitter.com/nhlanhlamalaza_",
    twitterHandle: "@nhlanhlamalaza_",
  },
  location: {
    city: "Johannesburg",
    region: "Gauteng",
    country: "South Africa",
    countryCode: "ZA",
  },
  services: [
    "Web Development",
    "DevOps Engineering",
    "AI Integrations",
    "Cloud Infrastructure",
    "Technical Consulting",
  ],
  logo: "/logo.png",
  locales: ["en_ZA", "en_US"],
  locale: "en_ZA",
};

function getSameAsLinks() {
  return [
    siteConfig.social.linkedin,
    siteConfig.social.github,
    siteConfig.social.twitterUrl,
    siteConfig.url,
  ];
}

export const pageConfig: Record<string, SEOProps> = {
  home: {
    title: "Nhlanhla Junior Malaza | Software Developer, DevOps Engineer & AI Integrations Specialist",
    description:
      "Portfolio of Nhlanhla Junior Malaza (NJMTech) — Software Developer, DevOps Engineer, and AI Integrations Specialist from South Africa. Expert in Next.js, React, TypeScript, Node.js, cloud infrastructure, and AI integrations.",
    canonical: `${siteConfig.url}/`,
    keywords: [
      "Nhlanhla",
      "Nhlanhla Junior",
      "Nhlanhla Junior Malaza",
      "Nhlanhla Malaza",
      "Junior Malaza",
      "NJMTech",
      "njmtech",
      "NJM",
      "njmalaza",
      "software developer South Africa",
      "devops engineer South Africa",
      "AI integrations specialist",
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

  "mail-service-policy": {
    title: "Mail Service Policy",
    description:
      "How NJMTECH uses Google Gmail to send and receive email for contact form messages, transactional notifications, and newsletter communications on njmtech.co.za.",
    canonical: `${siteConfig.url}/mail-service-policy`,
    keywords: [
      "mail service policy",
      "email policy",
      "NJMTECH email",
      "Gmail app policy",
      "transactional email policy",
    ],
    ogType: "website",
    robots: "index, follow",
  },

  "mail-service-terms": {
    title: "Mail Service Terms",
    description:
      "Terms of use for email services on NJMTECH, including contact form messaging, transactional notifications, and newsletter subscriptions sent via Google Gmail.",
    canonical: `${siteConfig.url}/mail-service-terms`,
    keywords: [
      "mail service terms",
      "email terms of service",
      "NJMTECH email terms",
      "Gmail app terms",
    ],
    ogType: "website",
    robots: "index, follow",
  },

  services: {
    title: "Services",
    description:
      "Professional services by Nhlanhla Junior Malaza — web development, DevOps engineering, and AI integrations tailored for modern businesses.",
    canonical: `${siteConfig.url}/services`,
    keywords: [
      "services Nhlanhla Junior Malaza",
      "web development services",
      "devops services",
      "AI integration services",
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
    alternateName: ["Nhlanhla Junior", "Nhlanhla Malaza", "Junior Malaza", "NJM", "NJMTech", "njmtech", "njmalaza"],
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.telephone,
    image: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.logo}`,
      caption: "Nhlanhla Junior Malaza — Software Developer",
    },
    description:
      "Nhlanhla Junior Malaza is a Software Developer, DevOps Engineer, and AI Integrations Specialist based in South Africa, specialising in modern web technologies, cloud infrastructure, and AI integrations.",
    knowsLanguage: ["en"],
    nationality: {
      "@type": "Country",
      name: "South Africa",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.countryCode,
    },
    sameAs: getSameAsLinks(),
    jobTitle: [
      "Software Developer",
      "DevOps Engineer",
      "AI Integrations Specialist",
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
      "AI Integrations",
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
    sameAs: getSameAsLinks(),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: siteConfig.telephone,
      email: siteConfig.email,
      availableLanguage: "English",
    },
  };
}

/**
 * Generate ProfessionalService schema for branded search and local entity signals
 */
export function generateProfessionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#professional-service`,
    name: siteConfig.name,
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.logo}`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.telephone,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.countryCode,
    },
    areaServed: {
      "@type": "Country",
      name: siteConfig.location.country,
    },
    founder: { "@id": `${siteConfig.url}/#person` },
    sameAs: getSameAsLinks(),
    serviceType: siteConfig.services,
    availableLanguage: ["en"],
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
    name: siteConfig.name,
    alternateName: "Nhlanhla Junior Malaza Portfolio",
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en-ZA",
    author: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: "Nhlanhla Junior Malaza",
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
      "Professional portfolio and profile of Nhlanhla Junior Malaza, a Software Developer, DevOps Engineer, and AI Integrations Specialist based in South Africa.",
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
      content: siteConfig.social.twitterHandle,
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
  generateProfessionalServiceSchema,
  generateWebsiteSchema,
  generateProfilePageSchema,
  generateContactPageSchema,
  generatePortfolioPageSchema,
  generateBreadcrumbSchema,
  generateMetaTags,
  getPageSEO,
};
