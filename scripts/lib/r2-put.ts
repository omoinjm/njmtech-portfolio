import { execFileSync } from "node:child_process";
import fs from "node:fs";

const BUCKET = process.env.R2_BUCKET_NAME ?? "njmtech-blob";

export function putR2Object(key: string, filePath: string, contentType: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Upload file not found: ${filePath}`);
  }

  execFileSync(
    "npx",
    [
      "wrangler",
      "r2",
      "object",
      "put",
      `${BUCKET}/${key}`,
      `--file=${filePath}`,
      `--content-type=${contentType}`,
      "--remote",
    ],
    { stdio: "inherit" },
  );

  console.log(`  ↑ r2://${BUCKET}/${key}`);
}

export function getProjectScreenshotPrefix() {
  return (process.env.PROJECT_SCREENSHOT_PREFIX ?? "njmtech-portfolio/projects").replace(
    /^\/|\/$/g,
    "",
  );
}

export function getProjectScreenshotBaseUrl() {
  const configured = process.env.PROJECT_SCREENSHOT_BASE_URL;
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const blogBase = (
    process.env.BLOG_STORAGE_BASE_URL ?? "https://s3.njmtech.co.za/njmtech-portfolio/blog"
  ).replace(/\/$/, "");

  return blogBase.replace(/\/blog$/, "/projects");
}

export function buildProjectScreenshotKey(projectId: number) {
  return `${getProjectScreenshotPrefix()}/${projectId}.webp`;
}

export function buildProjectScreenshotUrl(projectId: number) {
  return `${getProjectScreenshotBaseUrl()}/${projectId}.webp`;
}
