import type { EcosystemDivisionContent } from "@/sanity/lib/content";

export const OPEN_LABS_NAME = "Open Akha Labs, Inc.";
export const OPEN_STUDIO_NAME = "Open Akha Studio";

/** TODO: replace with the live Open Akha Studio marketing site URL when available. */
export const OPEN_STUDIO_URL = "#";

/**
 * Stable division identifiers, matching the `key` field of `ecosystemDivision`
 * documents in Sanity. Division display copy (name/tagline/status) lives in
 * Sanity — see src/sanity/lib/content.ts. This union only exists so the
 * project→division mapping below stays type-checked.
 */
export type DivisionKey = "open-studio" | "open-intelligence" | "open-dynamics";

/**
 * Static, hand-maintained per-project-group division tag.
 * Keyed by `project_group_key` (TabProjectModel.project_group_key from D1).
 * Add an entry here when a new project_group is created, or when
 * Open Akha Intelligence / Open Akha Dynamics ship their first real project.
 * Anything not listed falls back to DEFAULT_PROJECT_DIVISION.
 */
export const PROJECT_GROUP_DIVISION: Record<string, DivisionKey> = {
  // "web-dev": "open-studio",
};

export const DEFAULT_PROJECT_DIVISION: DivisionKey = "open-studio";

export function getDivisionForProjectGroup(
  groupKey: string | null | undefined,
): DivisionKey {
  if (!groupKey) return DEFAULT_PROJECT_DIVISION;
  return PROJECT_GROUP_DIVISION[groupKey] ?? DEFAULT_PROJECT_DIVISION;
}

export function getDivisionName(
  divisionKey: DivisionKey,
  divisions: EcosystemDivisionContent[],
): string {
  return (
    divisions.find((division) => division.key === divisionKey)?.name ??
    divisions[0]?.name ??
    OPEN_STUDIO_NAME
  );
}
