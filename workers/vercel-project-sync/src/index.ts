import { syncVercelProjects } from "./sync";
import type { Env } from "./types";

function unauthorized(): Response {
  return new Response("Unauthorized", { status: 401 });
}

function methodNotAllowed(): Response {
  return new Response("Method Not Allowed", { status: 405 });
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

    if (url.pathname !== "/sync") {
      return new Response("Not Found", { status: 404 });
    }

    if (request.method !== "POST") {
      return methodNotAllowed();
    }

    if (env.CRON_SECRET) {
      const auth = request.headers.get("Authorization");
      if (auth !== `Bearer ${env.CRON_SECRET}`) {
        return unauthorized();
      }
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
