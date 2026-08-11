import fs from "node:fs";
import path from "node:path";
import { config } from "@/lib/config";
import { parseBlogMarkdown, type BlogPost, type BlogPostMeta } from "@/lib/blog-parse";

const SEED_DIR = path.join(process.cwd(), "scripts", "blog-seed");

function isPublished(post: BlogPostMeta): boolean {
  if (config.isProduction() && post.draft) {
    return false;
  }
  return true;
}

function sortByDateDesc(a: BlogPostMeta, b: BlogPostMeta): number {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

function readSeedFiles(): { slug: string; raw: string; meta: BlogPostMeta }[] {
  if (!fs.existsSync(SEED_DIR)) {
    return [];
  }

  const posts: { slug: string; raw: string; meta: BlogPostMeta }[] = [];

  for (const file of fs.readdirSync(SEED_DIR).filter((name) => name.endsWith(".md"))) {
    const raw = fs.readFileSync(path.join(SEED_DIR, file), "utf8");
    const fallbackSlug = path.basename(file, ".md");
    const parsed = parseBlogMarkdown(raw, fallbackSlug);

    if (!parsed) {
      continue;
    }

    posts.push({
      slug: parsed.slug,
      raw,
      meta: {
        title: parsed.title,
        slug: parsed.slug,
        publishedAt: parsed.publishedAt,
        excerpt: parsed.excerpt,
        tags: parsed.tags,
        draft: parsed.draft,
      },
    });
  }

  return posts.sort(
    (a, b) =>
      new Date(b.meta.publishedAt).getTime() - new Date(a.meta.publishedAt).getTime(),
  );
}

export function loadLocalBlogIndex(): BlogPostMeta[] {
  return readSeedFiles()
    .map((post) => post.meta)
    .filter(isPublished)
    .sort(sortByDateDesc);
}

export function loadLocalBlogPost(slug: string): BlogPost | null {
  const match = readSeedFiles().find((post) => post.slug === slug);
  if (!match) {
    return null;
  }

  const parsed = parseBlogMarkdown(match.raw, slug);
  if (!parsed || !isPublished(parsed)) {
    return null;
  }

  return parsed;
}
