import { fetchAllVercelProjects } from "./vercel";
import { syncVercelProjects } from "./sync";
import type { Env } from "./types";

function unauthorized(): Response {
  return new Response("Unauthorized", { status: 401 });
}

function methodNotAllowed(): Response {
  return new Response("Method Not Allowed", { status: 405 });
}

function isAuthorized(request: Request, env: Env): boolean {
  if (!env.CRON_SECRET) {
    return true;
  }

  const auth = request.headers.get("Authorization");
  return auth === `Bearer ${env.CRON_SECRET}`;
}

export default {
  async scheduled(
    _controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    ctx.waitUntil(syncVercelProjects(env));
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/sync/discover") {
      if (request.method !== "GET" && request.method !== "POST") {
        return methodNotAllowed();
      }

      if (!isAuthorized(request, env)) {
        return unauthorized();
      }

      try {
        const result = await fetchAllVercelProjects(
          env.VERCEL_TOKEN,
          env.VERCEL_TEAM_ID,
        );

        return Response.json({
          ok: true,
          total: result.projects.length,
          scopes: result.scopes,
          projects: result.projects.map((project) => ({
            id: project.id,
            name: project.name,
            framework: project.framework ?? null,
          })),
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Discover failed unexpectedly";
        console.error("Discover failed:", error);
        return Response.json({ ok: false, error: message }, { status: 500 });
      }
    }

    if (url.pathname !== "/sync") {
      return new Response("Not Found", { status: 404 });
    }

    if (request.method !== "POST") {
      return methodNotAllowed();
    }

    if (!isAuthorized(request, env)) {
      return unauthorized();
    }

    try {
      const summary = await syncVercelProjects(env);
      return Response.json({ ok: true, summary });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sync failed unexpectedly";
      console.error("Manual sync failed:", error);
      return Response.json({ ok: false, error: message }, { status: 500 });
    }
  },
};
