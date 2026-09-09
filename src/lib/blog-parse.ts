import matter from "gray-matter";

export interface BlogPostMeta {
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  tags: string[];
  draft?: boolean;
  description?: string;
  author?: string;
  coverImage?: string;
  coverImageAlt?: string;
  ogImage?: string;
  lastUpdated?: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
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
    description: optionalString(data.description),
    author: optionalString(data.author),
    coverImage: optionalString(data.coverImage),
    coverImageAlt: optionalString(data.coverImageAlt),
    ogImage: optionalString(data.ogImage),
    lastUpdated: optionalString(data.lastUpdated),
    content: content.trim(),
  };
}
