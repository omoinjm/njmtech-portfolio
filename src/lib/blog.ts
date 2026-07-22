import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { config } from "@/lib/config";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPostMeta {
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  tags: string[];
  draft?: boolean;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

function parsePostFile(filePath: string): BlogPost | null {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const title = typeof data.title === "string" ? data.title : "";
  const slug =
    typeof data.slug === "string"
      ? data.slug
      : path.basename(filePath, path.extname(filePath));
  const publishedAt =
    typeof data.publishedAt === "string" ? data.publishedAt : "";
  const excerpt = typeof data.excerpt === "string" ? data.excerpt : "";
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((tag): tag is string => typeof tag === "string")
    : [];
  const draft = data.draft === true;

  if (!title || !publishedAt) {
    return null;
  }

  return {
    title,
    slug,
    publishedAt,
    excerpt,
    tags,
    draft,
    content: content.trim(),
  };
}

function isPublished(post: BlogPost): boolean {
  if (config.isProduction() && post.draft) {
    return false;
  }
  return true;
}

function sortByDateDesc(a: BlogPostMeta, b: BlogPostMeta): number {
  return (
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"));

  return files
    .map((file) => parsePostFile(path.join(BLOG_DIR, file)))
    .filter((post): post is BlogPost => post !== null)
    .filter(isPublished)
    .sort(sortByDateDesc);
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}
