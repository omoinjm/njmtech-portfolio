import type {
  ExistingProjectRow,
  MappedProjectFields,
  ProjectGroupRow,
} from "./types";

function normalizeHostname(url: string): string | null {
  try {
    const normalized = url.trim().startsWith("http")
      ? url.trim()
      : `https://${url.trim()}`;
    return new URL(normalized).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

export async function loadProjectGroups(
  db: D1Database,
): Promise<ProjectGroupRow[]> {
  const result = await db
    .prepare(
      `SELECT id, name, code
       FROM project_group
       WHERE is_active = 1
       ORDER BY id ASC`,
    )
    .all<ProjectGroupRow>();

  return result.results ?? [];
}

export async function findProjectByVercelId(
  db: D1Database,
  vercelProjectId: string,
): Promise<ExistingProjectRow | null> {
  return db
    .prepare(
      `SELECT id, project_group_id, description, is_code, code_url, img_url, is_active
       FROM project
       WHERE vercel_project_id = ?
       LIMIT 1`,
    )
    .bind(vercelProjectId)
    .first<ExistingProjectRow>();
}

/** Manual D1 rows (no vercel_project_id) matched by live URL hostname. */
export async function findOrphanProjectByLiveUrl(
  db: D1Database,
  liveUrl: string,
): Promise<ExistingProjectRow | null> {
  const targetHost = normalizeHostname(liveUrl);
  if (!targetHost) {
    return null;
  }

  const result = await db
    .prepare(
      `SELECT id, project_group_id, description, is_code, code_url, img_url, live_url
       FROM project
       WHERE vercel_project_id IS NULL
         AND is_active = 1
         AND live_url IS NOT NULL
         AND TRIM(live_url) != ''`,
    )
    .all<ExistingProjectRow & { live_url: string }>();

  for (const row of result.results ?? []) {
    if (normalizeHostname(row.live_url) === targetHost) {
      return row;
    }
  }

  return null;
}

export async function insertSyncedProject(
  db: D1Database,
  vercelProjectId: string,
  projectGroupId: number,
  fields: MappedProjectFields,
  syncedAt: string,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO project (
         project_group_id,
         title,
         description,
         img_url,
         live_url,
         is_code,
         code_url,
         is_current_domain,
         stack_json,
         is_active,
         vercel_project_id,
         synced_at
       ) VALUES (?, ?, ?, '', ?, 0, '', ?, ?, 1, ?, ?)`,
    )
    .bind(
      projectGroupId,
      fields.title,
      fields.description,
      fields.liveUrl,
      fields.isCurrentDomain,
      fields.stackJson,
      vercelProjectId,
      syncedAt,
    )
    .run();
}

/** Re-enable a sync-managed row that was soft-deleted when the project returns on Vercel. */
export async function reactivateSyncedProject(
  db: D1Database,
  vercelProjectId: string,
  syncedAt: string,
): Promise<void> {
  await db
    .prepare(
      `UPDATE project
       SET is_active = 1,
           synced_at = ?
       WHERE vercel_project_id = ?`,
    )
    .bind(syncedAt, vercelProjectId)
    .run();
}

export async function updateSyncedProject(
  db: D1Database,
  vercelProjectId: string,
  fields: MappedProjectFields,
  syncedAt: string,
): Promise<void> {
  await db
    .prepare(
      `UPDATE project
       SET title = ?,
           live_url = ?,
           stack_json = ?,
           is_current_domain = ?,
           is_active = 1,
           synced_at = ?
       WHERE vercel_project_id = ?`,
    )
    .bind(
      fields.title,
      fields.liveUrl,
      fields.stackJson,
      fields.isCurrentDomain,
      syncedAt,
      vercelProjectId,
    )
    .run();
}

/** Attach vercel_project_id to an existing manual row without overwriting editorial fields. */
export async function linkOrphanToVercelProject(
  db: D1Database,
  projectId: number,
  vercelProjectId: string,
  fields: MappedProjectFields,
  syncedAt: string,
): Promise<void> {
  await db
    .prepare(
      `UPDATE project
       SET vercel_project_id = ?,
           title = ?,
           live_url = ?,
           stack_json = ?,
           is_current_domain = ?,
           is_active = 1,
           synced_at = ?
       WHERE id = ?
         AND vercel_project_id IS NULL`,
    )
    .bind(
      vercelProjectId,
      fields.title,
      fields.liveUrl,
      fields.stackJson,
      fields.isCurrentDomain,
      syncedAt,
      projectId,
    )
    .run();
}

export async function softDeleteMissingProjects(
  db: D1Database,
  activeVercelIds: string[],
  syncedAt: string,
): Promise<number> {
  if (activeVercelIds.length === 0) {
    const result = await db
      .prepare(
        `UPDATE project
         SET is_active = 0, synced_at = ?
         WHERE vercel_project_id IS NOT NULL
           AND is_active = 1`,
      )
      .bind(syncedAt)
      .run();

    return result.meta.changes ?? 0;
  }

  const placeholders = activeVercelIds.map(() => "?").join(", ");
  const result = await db
    .prepare(
      `UPDATE project
       SET is_active = 0, synced_at = ?
       WHERE vercel_project_id IS NOT NULL
         AND vercel_project_id NOT IN (${placeholders})
         AND is_active = 1`,
    )
    .bind(syncedAt, ...activeVercelIds)
    .run();

  return result.meta.changes ?? 0;
}

function isUniqueConstraintError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";
  return /unique|constraint|UNIQUE/i.test(message);
}

export { isUniqueConstraintError };
