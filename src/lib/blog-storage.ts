import { config } from "@/lib/config";
import { loadLocalBlogIndex, loadLocalBlogPost } from "@/lib/blog-local-seed";
import { logger } from "@/utils/logger";
import {
  parseBlogMarkdown,
  type BlogPost,
  type BlogPostMeta,
} from "@/lib/blog-parse";

export {
  parseBlogMarkdown,
  type BlogPost,
  type BlogPostMeta,
} from "@/lib/blog-parse";

interface BlogIndexFile {
  posts: BlogPostMeta[];
}

/** Public base URL for blog blobs, e.g. https://s3.njmtech.co.za/njmtech-portfolio/blog */
export const DEFAULT_BLOG_STORAGE_BASE_URL =
  "https://s3.njmtech.co.za/njmtech-portfolio/blog";

function getBlogStorageBaseUrl(): string {
  return config.get("BLOG_STORAGE_BASE_URL") ?? DEFAULT_BLOG_STORAGE_BASE_URL;
}

function isPublished(post: BlogPostMeta): boolean {
  if (config.isProduction() && post.draft) {
    return false;
  }
  return true;
}

function sortByDateDesc(a: BlogPostMeta, b: BlogPostMeta): number {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

async function fetchText(url: string): Promise<string | null> {
  const attempts: RequestInit[] = [
    { next: { revalidate: 300 } },
    { cache: "no-store" },
  ];

  for (const init of attempts) {
    try {
      const response = await fetch(url, init);
      if (!response.ok) {
        logger.warn(`Blog storage fetch failed: ${url} (${response.status})`);
        continue;
      }
      return await response.text();
    } catch (error) {
      logger.warn(
        `Blog storage fetch error: ${url}`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  return null;
}

export async function fetchBlogIndex(): Promise<BlogPostMeta[]> {
  const base = getBlogStorageBaseUrl();
  const raw = await fetchText(`${base}/index.json`);

  if (raw) {
    try {
      const index = JSON.parse(raw) as BlogIndexFile;
      if (Array.isArray(index.posts) && index.posts.length > 0) {
        return index.posts.filter(isPublished).sort(sortByDateDesc);
      }
    } catch (error) {
      logger.warn(
        "Failed to parse blog index.json",
        error instanceof Error ? error.message : error,
      );
    }
  }

  const local = loadLocalBlogIndex();
  if (local.length > 0) {
    logger.warn(
      "Blog index unavailable on R2 — serving posts from scripts/blog-seed (run pnpm blog:upload for production)",
    );
    return local;
  }

  return [];
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  const base = getBlogStorageBaseUrl();
  const raw = await fetchText(`${base}/posts/${slug}.md`);

  if (raw) {
    const post = parseBlogMarkdown(raw, slug);
    if (post && isPublished(post)) {
      return post;
    }
  }

  const local = loadLocalBlogPost(slug);
  if (local) {
    return local;
  }

  return null;
}

export async function fetchAllBlogPosts(): Promise<BlogPost[]> {
  const index = await fetchBlogIndex();
  const posts = await Promise.all(
    index.map(async (meta) => {
      const post = await fetchBlogPost(meta.slug);
      return post ?? { ...meta, content: "" };
    }),
  );

  return posts.filter((post) => post.content.length > 0);
}
