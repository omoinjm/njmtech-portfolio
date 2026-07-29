import matter from "gray-matter";

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

export function parseBlogMarkdown(raw: string, fallbackSlug?: string): BlogPost | null {
  const { data, content } = matter(raw);

  const title = typeof data.title === "string" ? data.title : "";
  const slug =
    typeof data.slug === "string" ? data.slug : (fallbackSlug ?? "");
  const publishedAt =
    typeof data.publishedAt === "string" ? data.publishedAt : "";
  const excerpt = typeof data.excerpt === "string" ? data.excerpt : "";
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((tag): tag is string => typeof tag === "string")
    : [];
  const draft = data.draft === true;

  if (!title || !publishedAt || !slug) {
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
