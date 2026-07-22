import { BlogList } from "@/components/blog/BlogList";
import { getAllPosts } from "@/lib/blog";
import {
  generateBreadcrumbSchema,
  pageConfig,
  siteConfig,
} from "@/utils/seo";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: pageConfig.blog.title,
  description: pageConfig.blog.description,
  keywords: pageConfig.blog.keywords,
  robots: pageConfig.blog.robots,
  authors: [{ name: "Nhlanhla Junior Malaza", url: siteConfig.url }],
  openGraph: {
    title: `${pageConfig.blog.title} | Nhlanhla Junior Malaza`,
    description: pageConfig.blog.description,
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_ZA",
    images: [
      {
        url: siteConfig.logo,
        width: 1200,
        height: 630,
        alt: "Blog by Nhlanhla Junior Malaza",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageConfig.blog.title} | Nhlanhla Junior Malaza`,
    description: pageConfig.blog.description,
    images: [siteConfig.logo],
    creator: siteConfig.social.twitterHandle,
  },
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
};

const breadcrumbs = [
  { name: "Home", url: siteConfig.url },
  { name: "Blog", url: `${siteConfig.url}/blog` },
];

export default function BlogPage() {
  const posts = getAllPosts();

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
          <BlogList posts={posts} />
        </main>
      </div>
    </>
  );
}
