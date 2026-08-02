/**
 * Cloudflare Worker: sync Vercel projects into D1 `project` / `project_group`.
 *
 * - Cron: hourly (see wrangler.toml)
 * - Manual: GET /sync with header `X-Sync-Secret: <SYNC_SECRET>`
 */

export interface Env {
  DB: D1Database;
  VERCEL_TOKEN: string;
  VERCEL_TEAM_ID?: string;
  SYNC_SECRET: string;
  /** JSON map: Vercel project name → WEB | TOOL | ECOM */
  PROJECT_CATEGORY_MAP?: string;
}

type CategoryCode = "WEB" | "TOOL" | "ECOM";

interface VercelGitLink {
  type?: string;
  repo?: string;
  org?: string;
  repoOwner?: string;
  productionBranch?: string;
}

interface VercelProject {
  id: string;
  name: string;
  framework?: string | null;
  link?: VercelGitLink | null;
  targets?: {
    production?: {
      alias?: string[];
      url?: string;
    };
  };
  latestDeployments?: Array<{
    url?: string;
    readyState?: string;
    target?: string | null;
  }>;
}

interface VercelProjectsResponse {
  projects?: VercelProject[];
  pagination?: {
    count?: number;
    next?: number | string | null;
  };
}

interface GroupRow {
  id: number;
  code: string;
}

interface ExistingProjectRow {
  id: number;
  vercel_project_id: string;
  category_locked: number;
  project_group_id: number;
}

const DEFAULT_DESCRIPTION = "Deployed on Vercel";
const DEFAULT_IMG_URL = "";

const ECOM_RE = /shop|store|cart|commerce|e-?comm/i;
const TOOL_RE = /tool|cli|util|api|dashboard|admin|generator|converter/i;

const FRAMEWORK_LABELS: Record<string, string> = {
  nextjs: "Next.js",
  "nextjs-v2": "Next.js",
  vite: "Vite",
  react: "React",
  "create-react-app": "React",
  remix: "Remix",
  astro: "Astro",
  nuxtjs: "Nuxt",
  vue: "Vue",
  svelte: "Svelte",
  "sveltekit-1": "SvelteKit",
  gatsby: "Gatsby",
  angular: "Angular",
  hugo: "Hugo",
  eleventy: "Eleventy",
  blitzjs: "Blitz",
  solidstart: "SolidStart",
  dojo: "Dojo",
  ember: "Ember",
  hexo: "Hexo",
  hydrogen: "Hydrogen",
  ionic: "Ionic",
  polymer: "Polymer",
  preact: "Preact",
  redwoodjs: "Redwood",
  stencil: "Stencil",
  umijs: "UmiJS",
  docusaurus: "Docusaurus",
  sapper: "Sapper",
  gridsome: "Gridsome",
  python: "Python",
  flask: "Flask",
  fastapi: "FastAPI",
  django: "Django",
  nestjs: "NestJS",
  express: "Express",
  hono: "Hono",
  other: "Web",
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/health") {
      return json({ ok: true, service: "vercel-projects-sync" });
    }

    if (url.pathname === "/sync") {
      if (request.method !== "GET" && request.method !== "POST") {
        return json({ error: "Method not allowed" }, 405);
      }

      const secret = request.headers.get("X-Sync-Secret");
      if (!env.SYNC_SECRET || secret !== env.SYNC_SECRET) {
        return json({ error: "Unauthorized" }, 401);
      }

      try {
        const result = await runSync(env);
        return json({ ok: true, ...result });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Sync failed";
        return json({ ok: false, error: message }, 500);
      }
    }

    return json({ error: "Not found" }, 404);
  },

  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    await runSync(env);
  },
};

async function runSync(env: Env) {
  if (!env.VERCEL_TOKEN) {
    throw new Error("VERCEL_TOKEN is not configured");
  }

  const categoryMap = parseCategoryMap(env.PROJECT_CATEGORY_MAP);
  const groupIds = await loadGroupIds(env.DB);
  const vercelProjects = await listAllVercelProjects(env.VERCEL_TOKEN, env.VERCEL_TEAM_ID);
  const existing = await loadExistingSyncedProjects(env.DB);
  const seenIds = new Set<string>();

  let inserted = 0;
  let updated = 0;
  let deactivated = 0;
  const syncedAt = new Date().toISOString();

  for (const project of vercelProjects) {
    seenIds.add(project.id);

    const category = resolveCategory(project.name, categoryMap);
    const groupId = groupIds[category];
    if (!groupId) {
      throw new Error(`Missing project_group for code ${category}`);
    }

    const title = humanizeProjectName(project.name);
    const liveUrl = resolveLiveUrl(project);
    const codeUrl = resolveCodeUrl(project);
    const isCode = codeUrl ? 1 : 0;
    const stackJson = JSON.stringify(frameworkToStack(project.framework));
    const isCurrentDomain = liveUrl.includes("njmtech.co.za") ? 1 : 0;

    const current = existing.get(project.id);

    if (!current) {
      await env.DB.prepare(
        `INSERT INTO project (
           project_group_id, title, description, img_url, live_url,
           is_code, code_url, is_current_domain, stack_json, is_active,
           vercel_project_id, source, category_locked, synced_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, 'vercel', 0, ?)`,
      )
        .bind(
          groupId,
          title,
          DEFAULT_DESCRIPTION,
          DEFAULT_IMG_URL,
          liveUrl,
          isCode,
          codeUrl,
          isCurrentDomain,
          stackJson,
          project.id,
          syncedAt,
        )
        .run();
      inserted += 1;
      continue;
    }

    const nextGroupId =
      current.category_locked === 1 ? current.project_group_id : groupId;

    await env.DB.prepare(
      `UPDATE project
       SET title = ?,
           live_url = ?,
           is_code = ?,
           code_url = ?,
           is_current_domain = ?,
           stack_json = ?,
           is_active = 1,
           project_group_id = ?,
           synced_at = ?
       WHERE id = ? AND source = 'vercel'`,
    )
      .bind(
        title,
        liveUrl,
        isCode,
        codeUrl,
        isCurrentDomain,
        stackJson,
        nextGroupId,
        syncedAt,
        current.id,
      )
      .run();
    updated += 1;
  }

  const staleIds = [...existing.keys()].filter((id) => !seenIds.has(id));
  if (staleIds.length > 0) {
    const placeholders = staleIds.map(() => "?").join(", ");
    const result = await env.DB.prepare(
      `UPDATE project
       SET is_active = 0, synced_at = ?
       WHERE source = 'vercel'
         AND vercel_project_id IN (${placeholders})`,
    )
      .bind(syncedAt, ...staleIds)
      .run();
    deactivated = result.meta.changes ?? staleIds.length;
  }

  return {
    fetched: vercelProjects.length,
    inserted,
    updated,
    deactivated,
    syncedAt,
  };
}

async function loadGroupIds(db: D1Database): Promise<Record<CategoryCode, number>> {
  const { results } = await db
    .prepare(
      `SELECT id, code FROM project_group
       WHERE code IN ('WEB', 'TOOL', 'ECOM') AND is_active = 1`,
    )
    .all<GroupRow>();

  const map = {} as Record<CategoryCode, number>;
  for (const row of results ?? []) {
    if (row.code === "WEB" || row.code === "TOOL" || row.code === "ECOM") {
      map[row.code] = row.id;
    }
  }

  for (const code of ["WEB", "TOOL", "ECOM"] as CategoryCode[]) {
    if (!map[code]) {
      throw new Error(
        `project_group code ${code} is missing. Run scripts/migrate-vercel-projects-sync.sql`,
      );
    }
  }

  return map;
}

async function loadExistingSyncedProjects(db: D1Database) {
  const { results } = await db
    .prepare(
      `SELECT id, vercel_project_id, category_locked, project_group_id
       FROM project
       WHERE source = 'vercel' AND vercel_project_id IS NOT NULL`,
    )
    .all<ExistingProjectRow>();

  const map = new Map<string, ExistingProjectRow>();
  for (const row of results ?? []) {
    map.set(row.vercel_project_id, row);
  }
  return map;
}

async function listAllVercelProjects(token: string, teamId?: string) {
  const projects: VercelProject[] = [];
  let from: number | string | undefined;

  for (let page = 0; page < 50; page += 1) {
    const url = new URL("https://api.vercel.com/v10/projects");
    url.searchParams.set("limit", "100");
    if (teamId) {
      url.searchParams.set("teamId", teamId);
    }
    if (from !== undefined) {
      url.searchParams.set("from", String(from));
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Vercel API error ${response.status}: ${body.slice(0, 300)}`);
    }

    const payload = (await response.json()) as VercelProjectsResponse;
    const batch = payload.projects ?? [];
    projects.push(...batch);

    const next = payload.pagination?.next;
    if (next == null || batch.length === 0) {
      break;
    }
    from = next;
  }

  return projects;
}

function parseCategoryMap(raw?: string): Record<string, CategoryCode> {
  if (!raw || raw.trim() === "") {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    const map: Record<string, CategoryCode> = {};
    for (const [name, code] of Object.entries(parsed)) {
      const normalized = code.toUpperCase();
      if (normalized === "WEB" || normalized === "TOOL" || normalized === "ECOM") {
        map[name.toLowerCase()] = normalized;
      }
    }
    return map;
  } catch {
    throw new Error("PROJECT_CATEGORY_MAP must be valid JSON");
  }
}

function resolveCategory(
  projectName: string,
  map: Record<string, CategoryCode>,
): CategoryCode {
  const fromMap = map[projectName.toLowerCase()];
  if (fromMap) {
    return fromMap;
  }

  if (ECOM_RE.test(projectName)) {
    return "ECOM";
  }
  if (TOOL_RE.test(projectName)) {
    return "TOOL";
  }
  return "WEB";
}

function humanizeProjectName(name: string): string {
  return name
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveLiveUrl(project: VercelProject): string {
  const production = project.targets?.production;
  const alias = production?.alias?.find((value) => Boolean(value));
  if (alias) {
    return alias.startsWith("http") ? alias : `https://${alias}`;
  }

  if (production?.url) {
    return production.url.startsWith("http")
      ? production.url
      : `https://${production.url}`;
  }

  const readyProduction = project.latestDeployments?.find(
    (deployment) =>
      deployment.readyState === "READY" &&
      (deployment.target === "production" || deployment.target == null) &&
      deployment.url,
  );

  if (readyProduction?.url) {
    return readyProduction.url.startsWith("http")
      ? readyProduction.url
      : `https://${readyProduction.url}`;
  }

  // Stable Vercel project URL fallback
  return `https://${project.name}.vercel.app`;
}

function resolveCodeUrl(project: VercelProject): string {
  const link = project.link;
  if (!link?.repo) {
    return "";
  }

  const owner = link.org || link.repoOwner;
  if (link.type === "github" && owner) {
    return `https://github.com/${owner}/${link.repo}`;
  }
  if (link.type === "gitlab" && owner) {
    return `https://gitlab.com/${owner}/${link.repo}`;
  }
  if (link.type === "bitbucket" && owner) {
    return `https://bitbucket.org/${owner}/${link.repo}`;
  }

  return "";
}

function frameworkToStack(framework?: string | null): string[] {
  if (!framework) {
    return ["Vercel"];
  }
  const label = FRAMEWORK_LABELS[framework] ?? framework;
  return [label, "Vercel"];
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
