/**
 * Capture hero-section screenshots for synced portfolio projects.
 *
 * Uses Playwright (Chromium) to screenshot the top viewport of each live_url,
 * uploads WebP to R2 (same bucket as blog assets), and sets project.img_url in D1.
 *
 * Usage:
 *   pnpm project:screenshots              # only rows with empty img_url
 *   pnpm project:screenshots -- --force   # refresh all active projects
 *   pnpm project:screenshots -- --id=12   # single project
 *   pnpm project:screenshots -- --dry-run
 *
 * Env: D1_*, R2_BUCKET_NAME, PROJECT_SCREENSHOT_PREFIX, PROJECT_SCREENSHOT_BASE_URL
 * CI also needs: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID (wrangler R2 upload)
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium, type Page } from "@playwright/test";
import sharp from "sharp";
import { executeD1, queryD1 } from "./lib/d1-script";
import {
  buildProjectScreenshotKey,
  buildProjectScreenshotUrl,
  putR2Object,
} from "./lib/r2-put";

const VIEWPORT = { width: 1280, height: 720 };
const HERO_HEIGHT = 720;
const NAVIGATION_TIMEOUT_MS = 60_000;
const SETTLE_MS = 2_500;

/** Selectors commonly used for hero / above-the-fold on Vercel sites. */
const HERO_SELECTORS = [
  '[data-keyboard-section="hero"]',
  "#hero",
  "#home",
  "header + main section:first-of-type",
  "main section:first-of-type",
  "main > div:first-of-type",
  "header",
];

interface ProjectRow {
  id: number;
  title: string;
  live_url: string;
  img_url: string | null;
}

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    force: args.includes("--force"),
    dryRun: args.includes("--dry-run"),
    id: args.find((arg) => arg.startsWith("--id="))?.split("=")[1],
  };
}

async function loadProjects(force: boolean, idFilter?: string): Promise<ProjectRow[]> {
  if (idFilter) {
    const projectId = Number(idFilter);
    if (!Number.isFinite(projectId)) {
      throw new Error(`Invalid --id value: ${idFilter}`);
    }

    return queryD1<ProjectRow>(
      `SELECT id, title, live_url, img_url
       FROM project
       WHERE id = ?
         AND is_active = 1
         AND live_url IS NOT NULL
         AND TRIM(live_url) != ''`,
      [projectId],
    );
  }

  const missingOnlyClause = force
    ? ""
    : `AND (img_url IS NULL OR TRIM(img_url) = '')`;

  return queryD1<ProjectRow>(
    `SELECT id, title, live_url, img_url
     FROM project
     WHERE is_active = 1
       AND live_url IS NOT NULL
       AND TRIM(live_url) != ''
       ${missingOnlyClause}
     ORDER BY id ASC`,
  );
}

function normalizeLiveUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

async function resolveHeroClip(page: Page) {
  for (const selector of HERO_SELECTORS) {
    const locator = page.locator(selector).first();
    const count = await locator.count();
    if (count === 0) {
      continue;
    }

    try {
      await locator.waitFor({ state: "visible", timeout: 4_000 });
      const box = await locator.boundingBox();
      if (box && box.height >= 120 && box.width >= 200) {
        const height = Math.min(Math.max(Math.round(box.height), 400), HERO_HEIGHT);
        return {
          x: Math.max(0, Math.round(box.x)),
          y: Math.max(0, Math.round(box.y)),
          width: Math.min(Math.round(box.width), VIEWPORT.width),
          height,
        };
      }
    } catch {
      // try next selector
    }
  }

  return {
    x: 0,
    y: 0,
    width: VIEWPORT.width,
    height: HERO_HEIGHT,
  };
}

async function captureHeroScreenshot(page: Page, liveUrl: string): Promise<Buffer> {
  await page.goto(normalizeLiveUrl(liveUrl), {
    waitUntil: "domcontentloaded",
    timeout: NAVIGATION_TIMEOUT_MS,
  });

  await page.waitForTimeout(SETTLE_MS);

  const clip = await resolveHeroClip(page);
  const png = await page.screenshot({
    type: "png",
    clip,
    animations: "disabled",
  });

  return sharp(png).webp({ quality: 82 }).toBuffer();
}

async function main() {
  const { force, dryRun, id } = parseArgs();
  const projects = await loadProjects(force, id);

  if (projects.length === 0) {
    console.log("No projects need screenshots.");
    return;
  }

  console.log(
    `Capturing hero screenshots for ${projects.length} project(s)${force ? " (force refresh)" : ""}...\n`,
  );

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "project-screenshots-"));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  let captured = 0;
  let skipped = 0;
  const errors: string[] = [];

  try {
    for (const project of projects) {
      const label = `#${project.id} ${project.title}`;
      console.log(`→ ${label}`);
      console.log(`  ${project.live_url}`);

      if (dryRun) {
        console.log("  (dry-run — skipped upload/update)");
        skipped += 1;
        continue;
      }

      try {
        const webpBuffer = await captureHeroScreenshot(page, project.live_url);
        const tmpFile = path.join(tmpDir, `${project.id}.webp`);
        fs.writeFileSync(tmpFile, webpBuffer);

        const objectKey = buildProjectScreenshotKey(project.id);
        putR2Object(objectKey, tmpFile, "image/webp");

        const publicUrl = buildProjectScreenshotUrl(project.id);
        await executeD1(`UPDATE project SET img_url = ? WHERE id = ?`, [
          publicUrl,
          project.id,
        ]);

        console.log(`  ✓ ${publicUrl}\n`);
        captured += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        errors.push(`${label}: ${message}`);
        console.error(`  ✗ ${message}\n`);
      }
    }
  } finally {
    await browser.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  console.log(
    JSON.stringify(
      {
        processed: projects.length,
        captured,
        skipped,
        errors,
      },
      null,
      2,
    ),
  );

  if (errors.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
