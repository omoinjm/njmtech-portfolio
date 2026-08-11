import { categorizeNewProject, resolveGroupId } from "./categorize";
import {
  findProjectByVercelId,
  insertSyncedProject,
  loadProjectGroups,
  softDeleteMissingProjects,
  updateSyncedProject,
} from "./d1";
import { mapVercelProject } from "./map-project";
import type { Env, SyncSummary } from "./types";
import { fetchAllVercelProjects } from "./vercel";

function nowIso(): string {
  return new Date().toISOString();
}

export async function syncVercelProjects(env: Env): Promise<SyncSummary> {
  const summary: SyncSummary = {
    fetched: 0,
    inserted: 0,
    updated: 0,
    deactivated: 0,
    errors: [],
  };

  const syncedAt = nowIso();
  const groups = await loadProjectGroups(env.DB);

  if (groups.length === 0) {
    throw new Error("No active project_group rows found in D1");
  }

  const vercelProjects = await fetchAllVercelProjects(
    env.VERCEL_TOKEN,
    env.VERCEL_TEAM_ID,
  );

  summary.fetched = vercelProjects.length;
  const activeVercelIds: string[] = [];

  for (const project of vercelProjects) {
    activeVercelIds.push(project.id);

    try {
      const existing = await findProjectByVercelId(env.DB, project.id);

      if (existing) {
        const fields = mapVercelProject(
          project,
          env.SITE_URL,
          existing.description,
        );
        await updateSyncedProject(env.DB, project.id, fields, syncedAt);
        summary.updated += 1;
        continue;
      }

      const categorization = await categorizeNewProject(env, project);
      const projectGroupId = resolveGroupId(groups, categorization.category);
      const fields = mapVercelProject(
        project,
        env.SITE_URL,
        categorization.description,
      );

      await insertSyncedProject(
        env.DB,
        project.id,
        projectGroupId,
        fields,
        syncedAt,
      );
      summary.inserted += 1;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown sync error";
      summary.errors.push(`${project.name} (${project.id}): ${message}`);
      console.error(`Failed to sync ${project.id}:`, error);
    }
  }

  summary.deactivated = await softDeleteMissingProjects(
    env.DB,
    activeVercelIds,
    syncedAt,
  );

  console.log("Vercel project sync complete:", JSON.stringify(summary));
  return summary;
}
