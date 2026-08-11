import type { VercelProject, VercelProjectsResponse } from "./types";

const VERCEL_API_BASE = "https://api.vercel.com";

export async function fetchAllVercelProjects(
  token: string,
  teamId: string,
): Promise<VercelProject[]> {
  const projects: VercelProject[] = [];
  let until: string | undefined;

  for (;;) {
    const url = new URL(`${VERCEL_API_BASE}/v9/projects`);
    url.searchParams.set("teamId", teamId);
    url.searchParams.set("limit", "100");

    if (until) {
      url.searchParams.set("until", until);
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
        `Vercel API failed (${response.status}): ${body.slice(0, 300)}`,
      );
    }

    const payload = (await response.json()) as VercelProjectsResponse;
    projects.push(...(payload.projects ?? []));

    const next = payload.pagination?.next;
    if (next === undefined || next === null || next === "") {
      break;
    }

    until = String(next);
  }

  return projects;
}
