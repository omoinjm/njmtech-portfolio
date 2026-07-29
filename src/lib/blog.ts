import type { BlogPost, BlogPostMeta } from "@/lib/blog-storage";
import {
  fetchAllBlogPosts,
  fetchBlogIndex,
  fetchBlogPost,
} from "@/lib/blog-storage";

export type { BlogPost, BlogPostMeta } from "@/lib/blog-storage";
export { parseBlogMarkdown } from "@/lib/blog-storage";

/** R2 fetch uses `next: { revalidate: 300 }` in blog-storage — no unstable_cache (breaks under dynamic layout on Vercel). */

export async function getAllPosts(): Promise<BlogPost[]> {
  return fetchAllBlogPosts();
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return fetchBlogPost(slug);
}

export async function getAllSlugs(): Promise<string[]> {
  const index = await fetchBlogIndex();
  return index.map((post) => post.slug);
}

export async function getAllPostMeta(): Promise<BlogPostMeta[]> {
  return fetchBlogIndex();
}
