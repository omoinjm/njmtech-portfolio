import type { VercelProject, VercelProjectsResponse } from "./types";

const VERCEL_API_BASE = "https://api.vercel.com";
const MAX_PAGES = 50;

interface FetchScope {
  label: string;
  teamId?: string;
  slug?: string;
}

export interface VercelScopeStats {
  scope: string;
  count: number;
  pages: number;
}

export interface VercelFetchResult {
  projects: VercelProject[];
  scopes: VercelScopeStats[];
}

function normalizeProjectsResponse(payload: unknown): VercelProjectsResponse {
  if (Array.isArray(payload)) {
    return {
      projects: payload as VercelProject[],
      pagination: { count: payload.length, next: null },
    };
  }

  if (payload && typeof payload === "object" && "projects" in payload) {
    return payload as VercelProjectsResponse;
  }

  return { projects: [] };
}

function buildFetchScopes(teamIdOrSlug?: string): FetchScope[] {
  const scopes: FetchScope[] = [{ label: "personal" }];

  const value = teamIdOrSlug?.trim();
  if (!value) {
    return scopes;
  }

  if (value.startsWith("team_")) {
    scopes.push({ label: `team:${value}`, teamId: value });
  } else {
    scopes.push({ label: `team-slug:${value}`, slug: value });
  }

  return scopes;
}

async function fetchProjectsForScope(
  token: string,
  scope: FetchScope,
): Promise<{ projects: VercelProject[]; pages: number }> {
  const byId = new Map<string, VercelProject>();
  let from: string | undefined;
  let pages = 0;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const url = new URL(`${VERCEL_API_BASE}/v10/projects`);
    url.searchParams.set("limit", "100");

    if (scope.teamId) {
      url.searchParams.set("teamId", scope.teamId);
    } else if (scope.slug) {
      url.searchParams.set("slug", scope.slug);
    }

    if (from) {
      url.searchParams.set("from", from);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Vercel API failed for ${scope.label} (${response.status}): ${body.slice(0, 300)}`,
      );
    }

    const payload = normalizeProjectsResponse(await response.json());
    const batch = payload.projects ?? [];
    pages += 1;

    for (const project of batch) {
      byId.set(project.id, project);
    }

    const next = payload.pagination?.next;
    if (
      batch.length === 0 ||
      next === undefined ||
      next === null ||
      next === ""
    ) {
      break;
    }

    const nextFrom = String(next);
    if (nextFrom === from) {
      break;
    }

    from = nextFrom;
  }

  return {
    projects: Array.from(byId.values()),
    pages,
  };
}

/** Fetches personal-account projects plus optional team/slug scope, merged by id. */
export async function fetchAllVercelProjects(
  token: string,
  teamIdOrSlug?: string,
): Promise<VercelFetchResult> {
  const scopes = buildFetchScopes(teamIdOrSlug);
  const merged = new Map<string, VercelProject>();
  const scopeStats: VercelScopeStats[] = [];

  for (const scope of scopes) {
    const result = await fetchProjectsForScope(token, scope);

    for (const project of result.projects) {
      merged.set(project.id, project);
    }

    scopeStats.push({
      scope: scope.label,
      count: result.projects.length,
      pages: result.pages,
    });
  }

  return {
    projects: Array.from(merged.values()),
    scopes: scopeStats,
  };
}
