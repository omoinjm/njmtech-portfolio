import {
  executeD1Statement,
  isD1Configured,
  queryD1,
  queryOneD1,
} from "@/lib/d1-client";
import type {
  FooterModel,
  LinkModel,
  MenuModel,
  ProjectModel,
  SkillModel,
  TabProjectModel,
} from "@/types";
import { logger } from "@/utils/logger";

<<<<<<< HEAD
const pool = new Pool({
	connectionString: process.env.POSTGRES_URL_NON_POOLING,
	ssl: false,
});

// Allowlist of valid table names to prevent SQL injection
const VALID_TABLES = ['skills', 'projects', 'menu', 'socials', 'nav_footer', 'nav_menu'] as const;

function validateTableName(tblName: string): asserts tblName is typeof VALID_TABLES[number] {
	if (!VALID_TABLES.includes(tblName as typeof VALID_TABLES[number])) {
		throw new Error(`Invalid table name: ${tblName}`);
	}
=======
export interface SubscriberRow {
  id: number;
  email: string;
  subscribed_at: string;
  last_attempt_at: string;
>>>>>>> cfea980c04568a683ad72723623482a2cb7a65fc
}

interface ProjectQueryRow {
  project_group_id: number;
  project_group_key: string | null;
  project_group_name: string;
  project_group_code: string;
  project_group_icon: string;
  project_id: number | null;
  project_title: string | null;
  project_description: string | null;
  img_url: string | null;
  live_url: string | null;
  is_code: number | null;
  code_url: string | null;
  stack_json: string | null;
  is_current_domain: number | null;
}

interface ProjectsResponse {
  all_project_groups: {
    project_groups: TabProjectModel[];
  };
}

function getUnconfiguredDatabaseError() {
  return new Error("Cloudflare D1 is not configured.");
}

function parseProjectStack(stackJson: string | null, projectId: number): string[] {
  if (!stackJson) {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(stackJson);
  } catch (error) {
    logger.error(`Invalid stack_json for project ${projectId}`, error);
    throw new Error(`Invalid stack_json for project ${projectId}`);
  }

  if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== "string")) {
    throw new Error(`stack_json must be a string array for project ${projectId}`);
  }

  return parsed;
}

export async function getSkills(): Promise<SkillModel[]> {
  if (!isD1Configured()) {
    logger.warn("Database not configured, returning empty result");
    return [];
  }

  return queryD1<SkillModel>(
    `SELECT id, img_url, img_name
     FROM skills
     ORDER BY id ASC`,
  );
}

export async function getMenuLinks(): Promise<LinkModel> {
  if (!isD1Configured()) {
    logger.warn("Database not configured, returning empty navigation");
    return { nav_menu: [], nav_footer: [] };
  }

  const [navMenu, navFooter] = await Promise.all([
    queryD1<MenuModel>(
      `SELECT id, name AS label, COALESCE(icon, '') AS icon, route_url AS url
       FROM nav_menu
       WHERE is_active = 1
       ORDER BY sort_order ASC, id ASC`,
    ),
    queryD1<FooterModel>(
      `SELECT id, name AS label, COALESCE(icon, '') AS icon, route_url AS url
       FROM nav_footer
       WHERE is_active = 1
       ORDER BY sort_order ASC, id ASC`,
    ),
  ]);

  return {
    nav_menu: navMenu,
    nav_footer: navFooter,
  };
}

export async function getProjects(): Promise<ProjectsResponse> {
  if (!isD1Configured()) {
    logger.warn("Database not configured, returning empty projects");
    return { all_project_groups: { project_groups: [] } };
  }

  const rows = await queryD1<ProjectQueryRow>(
    `SELECT
       pg.id AS project_group_id,
       pg."key" AS project_group_key,
       pg.name AS project_group_name,
       pg.code AS project_group_code,
       pg.icon AS project_group_icon,
       p.id AS project_id,
       p.title AS project_title,
       p.description AS project_description,
       p.img_url,
       p.live_url,
       p.is_code,
       p.code_url,
       p.stack_json,
       p.is_current_domain
     FROM project_group pg
     LEFT JOIN project p
       ON p.project_group_id = pg.id
      AND p.is_active = 1
     WHERE pg.is_active = 1
     ORDER BY pg.id ASC, p.id ASC`,
  );

  const projectGroups = new Map<number, TabProjectModel>();

  for (const row of rows) {
    const existingGroup = projectGroups.get(row.project_group_id);

    if (!existingGroup) {
      projectGroups.set(row.project_group_id, {
        project_group_id: row.project_group_id,
        project_group_key: row.project_group_key ?? row.project_group_code,
        project_group_name: row.project_group_name,
        project_group_code: row.project_group_code,
        project_group_icon: row.project_group_icon,
        projects: [],
      });
    }

    if (row.project_id === null) {
      continue;
    }

    const group = projectGroups.get(row.project_group_id);

    if (!group) {
      throw new Error(`Project group ${row.project_group_id} was not initialized`);
    }

    group.projects?.push({
      project_id: row.project_id,
      project_group_id: row.project_group_id,
      project_title: row.project_title ?? "",
      project_description: row.project_description ?? "",
      img_url: row.img_url ?? "",
      live_url: row.live_url ?? "",
      is_code: row.is_code === 1,
      code_url: row.code_url ?? "",
      stack_json: parseProjectStack(row.stack_json, row.project_id),
      is_current_domain: row.is_current_domain === 1,
    } satisfies ProjectModel);
  }

  return {
    all_project_groups: {
      project_groups: Array.from(projectGroups.values()),
    },
  };
}

export async function getVoiceCache(textHash: string) {
  if (!isD1Configured()) {
    logger.warn("Database not configured, skipping voice cache lookup");
    return null;
  }

  const row = await queryOneD1<{ audio_url: string }>(
    `SELECT audio_url
     FROM ai_voice_cache
     WHERE response_text_hash = ?
     LIMIT 1`,
    [textHash],
  );

  return row?.audio_url ?? null;
}

export async function getSubscriberByEmail(email: string) {
  if (!isD1Configured()) {
    throw getUnconfiguredDatabaseError();
  }

  return queryOneD1<SubscriberRow>(
    `SELECT id, email, subscribed_at, last_attempt_at
     FROM subscribers
     WHERE email = ?
     LIMIT 1`,
    [email],
  );
}

export async function touchSubscriberLastAttempt(email: string) {
  if (!isD1Configured()) {
    throw getUnconfiguredDatabaseError();
  }

  await executeD1Statement(
    `UPDATE subscribers
     SET last_attempt_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
     WHERE email = ?`,
    [email],
  );
}

export async function createSubscriber(email: string) {
  if (!isD1Configured()) {
    throw getUnconfiguredDatabaseError();
  }

  await executeD1Statement(
    `INSERT INTO subscribers (email, subscribed_at, last_attempt_at)
     VALUES (?, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`,
    [email],
  );
}
