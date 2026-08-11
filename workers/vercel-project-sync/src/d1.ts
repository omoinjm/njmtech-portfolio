import type {
  ExistingProjectRow,
  MappedProjectFields,
  ProjectGroupRow,
} from "./types";

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
      `SELECT id, project_group_id, description, is_code, code_url, img_url
       FROM project
       WHERE vercel_project_id = ?
       LIMIT 1`,
    )
    .bind(vercelProjectId)
    .first<ExistingProjectRow>();
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
