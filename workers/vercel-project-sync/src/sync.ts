import { categorizeNewProject, resolveGroupId } from "./categorize";
import {
  findOrphanProjectByLiveUrl,
  findProjectByVercelId,
  insertSyncedProject,
  isUniqueConstraintError,
  linkOrphanToVercelProject,
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
    linked: 0,
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
      let existing = await findProjectByVercelId(env.DB, project.id);
      const previewFields = mapVercelProject(
        project,
        env.SITE_URL,
        existing?.description ?? "",
      );

      if (!existing) {
        const orphan = await findOrphanProjectByLiveUrl(
          env.DB,
          previewFields.liveUrl,
        );

        if (orphan) {
          await linkOrphanToVercelProject(
            env.DB,
            orphan.id,
            project.id,
            previewFields,
            syncedAt,
          );
          summary.linked += 1;
          console.log(
            `Linked orphan D1 row #${orphan.id} to Vercel project ${project.name}`,
          );
          continue;
        }
      }

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

      try {
        await insertSyncedProject(
          env.DB,
          project.id,
          projectGroupId,
          fields,
          syncedAt,
        );
        summary.inserted += 1;
      } catch (insertError) {
        if (!isUniqueConstraintError(insertError)) {
          throw insertError;
        }

        existing = await findProjectByVercelId(env.DB, project.id);
        if (!existing) {
          throw insertError;
        }

        await updateSyncedProject(env.DB, project.id, fields, syncedAt);
        summary.updated += 1;
      }
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
