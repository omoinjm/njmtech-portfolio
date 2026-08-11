/**
 * SEO Configuration and utilities for NJMTECH Portfolio
 * Handles meta tags, Open Graph, structured data, and more
 */

import {
  PRIMARY_SITE_NAV,
  getPrimarySiteNavUrl,
} from "@/lib/site-navigation";

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
    "NJMTECH — professional web design, development, hosting, and digital services for South African businesses. Fast delivery, clear pricing, WhatsApp support.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://njmtech.co.za",
  email: "njmalaza@outlook.com",
  telephone: "+27 83 276 6443",
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
    "Website Design & Development",
    "Hosting & Maintenance",
    "SEO & Digital Marketing",
    "Social Media Management",
    "AI Integration & Automation",
    "Training & Support",
  ],
  logo: "/logo.png",
  ogImage: "/opengraph-image",
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
    title:
      "NJMTECH | Professional Web Design & Development in South Africa",
    description:
      "NJMTECH builds fast, mobile-first websites and digital services for South African businesses. Website design from R4 999, hosting, SEO, AI automation, and WhatsApp support.",
    canonical: `${siteConfig.url}/`,
    keywords: [
      "NJMTECH",
      "NJMTech",
      "web design South Africa",
      "website development Johannesburg",
      "professional web design",
      "small business website",
      "website design South Africa",
      "web developer Johannesburg",
      "WhatsApp website quote",
      "SEO South Africa",
      "hosting South Africa",
      "Nhlanhla Malaza",
      "Nhlanhla Junior Malaza",
    ],
    ogType: "website",
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  },

  about: {
    title: "About NJMTECH",
    description:
      "NJMTECH is a Johannesburg-based web studio helping South African businesses get online with websites, hosting, and digital tools. Founded by full-stack developer Nhlanhla Junior Malaza.",
    canonical: `${siteConfig.url}/about`,
    keywords: [
      "about NJMTECH",
      "web studio Johannesburg",
      "website design company South Africa",
      "Nhlanhla Malaza",
      "Nhlanhla Junior Malaza",
      "small business web design",
    ],
    ogType: "website",
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  },

  work: {
    title: "Our Work — Case Studies",
    description:
      "NJMTECH portfolio case studies — real websites and digital projects for South African clients, with challenges, solutions, and measurable results.",
    canonical: `${siteConfig.url}/work`,
    keywords: [
      "NJMTECH portfolio",
      "web design case studies",
      "website projects South Africa",
      "NJMTECH work",
      "client projects Johannesburg",
    ],
    ogType: "website",
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
    title: "Contact NJMTECH — Get a Quote",
    description:
      "Contact NJMTECH for a website or digital services quote. WhatsApp-first support with replies within 4 business hours. Based in Johannesburg, serving South Africa.",
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

  blog: {
    title: "Blog",
    description:
      "Tech notes, experiments, and things Nhlanhla Junior Malaza is currently building — Cloudflare, Next.js, AI integrations, and DevOps.",
    canonical: `${siteConfig.url}/blog`,
    keywords: [
      "Nhlanhla Junior Malaza blog",
      "NJMTech blog",
      "tech blog South Africa",
      "Next.js blog",
      "Cloudflare D1",
      "AI integrations",
      "software development notes",
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
    title: "Services & Pricing",
    description:
      "NJMTECH services and pricing — website design from R4 999, hosting, SEO, social media, AI automation, and training for South African businesses.",
    canonical: `${siteConfig.url}/services`,
    keywords: [
      "NJMTECH services",
      "website design pricing South Africa",
      "web development packages",
      "SEO services Johannesburg",
      "hosting South Africa",
      "AI automation services",
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
    alternateName: [
      "Nhlanhla Junior Malaza Portfolio",
      "Nhlanhla Malaza",
      "NJMTech Portfolio",
      "NJMTECH Official Site",
    ],
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en-ZA",
    author: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: "Nhlanhla Junior Malaza",
    },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    hasPart: PRIMARY_SITE_NAV.map((item) => ({
      "@type": "WebPage",
      "@id": `${getPrimarySiteNavUrl(item.path)}#webpage`,
      name: item.name,
      url: getPrimarySiteNavUrl(item.path),
      description: item.description,
      isPartOf: { "@id": `${siteConfig.url}/#website` },
    })),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/work?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * ItemList + SiteNavigationElement for Google sitelink signals.
 */
export function generateSiteNavigationSchema() {
  const navigationElements = PRIMARY_SITE_NAV.map((item, index) => ({
    "@type": "SiteNavigationElement",
    "@id": `${getPrimarySiteNavUrl(item.path)}#navigation`,
    position: index + 1,
    name: item.name,
    description: item.description,
    url: getPrimarySiteNavUrl(item.path),
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "@id": `${siteConfig.url}/#primary-navigation`,
        name: "Main site navigation",
        itemListElement: PRIMARY_SITE_NAV.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: getPrimarySiteNavUrl(item.path),
        })),
      },
      ...navigationElements,
    ],
  };
}

/**
 * Blog index / CollectionPage schema
 */
export function generateBlogPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteConfig.url}/blog#blog`,
    name: "NJMTECH Blog",
    url: `${siteConfig.url}/blog`,
    description: pageConfig.blog.description,
    inLanguage: "en-ZA",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    author: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: "Nhlanhla Junior Malaza",
    },
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

/**
 * Generate AboutPage schema
 */
export function generateAboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteConfig.url}/about#aboutpage`,
    name: "About Nhlanhla Malaza",
    url: `${siteConfig.url}/about`,
    description:
      "Professional background and profile of Nhlanhla Malaza (Nhlanhla Junior Malaza), a Software Developer, DevOps Engineer, and AI Integrations Specialist based in Johannesburg, South Africa.",
    inLanguage: "en-ZA",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    mainEntity: { "@id": `${siteConfig.url}/#person` },
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
 * Generate BlogPosting schema for article pages
 */
export function generateArticleSchema(post: {
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Nhlanhla Junior Malaza",
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logo}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
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
      content: config.ogImage || siteConfig.ogImage || siteConfig.logo,
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
      content: config.ogImage || siteConfig.ogImage || siteConfig.logo,
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
  generateSiteNavigationSchema,
  generateBlogPageSchema,
  generateProfilePageSchema,
  generateAboutPageSchema,
  generateContactPageSchema,
  generatePortfolioPageSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateMetaTags,
  getPageSEO,
};
