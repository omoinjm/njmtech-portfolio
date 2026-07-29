/**
 * Upload blog Markdown from scripts/blog-seed/ to Cloudflare R2.
 *
 * Bucket layout:
 *   blog/index.json
 *   blog/posts/{slug}.md
 *
 * Usage:
 *   pnpm blog:upload    # Infisical secrets (R2_BUCKET_NAME, wrangler auth)
 *
 * Requires: wrangler CLI + R2 bucket configured in wrangler.toml or env.
 * Env: R2_BUCKET_NAME (default: njmtech-blob), BLOG_STORAGE_PREFIX (default: njmtech-portfolio/blog)
 */
import { execFileSync } from "node:child_process";
import fs from "fs";
import os from "node:os";
import path from "path";
import { parseBlogMarkdown, type BlogPostMeta } from "../src/lib/blog-parse";

const SEED_DIR = path.join(process.cwd(), "scripts", "blog-seed");
/** R2 bucket (not the public hostname — see BLOG_STORAGE_PREFIX for object keys) */
const BUCKET = process.env.R2_BUCKET_NAME ?? "njmtech-blob";
/** Object key prefix matching public URL path, e.g. njmtech-portfolio/blog */
const PREFIX = (process.env.BLOG_STORAGE_PREFIX ?? "njmtech-portfolio/blog").replace(
  /^\/|\/$/g,
  "",
);

function loadSeedPosts(): { slug: string; raw: string; meta: BlogPostMeta }[] {
  if (!fs.existsSync(SEED_DIR)) {
    throw new Error(`Seed directory not found: ${SEED_DIR}`);
  }

  const files = fs.readdirSync(SEED_DIR).filter((file) => file.endsWith(".md"));
  const posts: { slug: string; raw: string; meta: BlogPostMeta }[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(SEED_DIR, file), "utf8");
    const fallbackSlug = path.basename(file, ".md");
    const parsed = parseBlogMarkdown(raw, fallbackSlug);

    if (!parsed) {
      console.warn(`  ⚠ Skipping invalid post: ${file}`);
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

function putObject(key: string, body: string, contentType: string) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "blog-upload-"));
  const tmpFile = path.join(tmpDir, path.basename(key));

  try {
    fs.writeFileSync(tmpFile, body, "utf8");
    execFileSync(
      "npx",
      [
        "wrangler",
        "r2",
        "object",
        "put",
        `${BUCKET}/${key}`,
        `--file=${tmpFile}`,
        `--content-type=${contentType}`,
        "--remote",
      ],
      { stdio: "inherit" },
    );
    console.log(`  ↑ ${key}`);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

async function main() {
  console.log(`Uploading blog posts to R2 bucket "${BUCKET}"...\n`);

  const posts = loadSeedPosts();
  if (posts.length === 0) {
    console.log("No markdown files in scripts/blog-seed/");
    return;
  }

  for (const post of posts) {
    putObject(`${PREFIX}/posts/${post.slug}.md`, post.raw, "text/markdown; charset=utf-8");
  }

  const index = { posts: posts.map((post) => post.meta) };
  putObject(`${PREFIX}/index.json`, JSON.stringify(index, null, 2), "application/json");

  console.log(`\nDone. ${posts.length} post(s) uploaded.`);
  console.log(
    `Ensure public access at: ${process.env.BLOG_STORAGE_BASE_URL ?? "https://s3.njmtech.co.za/njmtech-portfolio/blog"}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
