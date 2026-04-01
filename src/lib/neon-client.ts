import { neon, neonConfig } from "@neondatabase/serverless";
import https from "https";

// Explicitly set the correct Neon HTTP endpoint derived from POSTGRES_URL.
// This overrides any value set by @vercel/postgres, which redirects to a
// Vercel-managed Neon instance (verceldb) instead of the project's own DB.
const pgUrl = new URL(process.env.POSTGRES_URL!);
neonConfig.fetchEndpoint = `https://${pgUrl.hostname}/sql`;

// Use Node's classic https module with family:4 (IPv4-only) to bypass
// undici's Happy Eyeballs (RFC 6555) which fails with ETIMEDOUT on networks
// where IPv6 is unreachable and IPv4 connections time out under undici's
// shorter per-connection timeout.
function ipv4Fetch(url: string | URL, opts: RequestInit = {}): Promise<Response> {
  const urlStr = typeof url === "string" ? url : url.toString();
  const urlObj = new URL(urlStr);
  const body = (opts.body as string) ?? "";
  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string>),
    "Content-Length": Buffer.byteLength(body).toString(),
  };

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: urlObj.hostname,
        port: 443,
        path: urlObj.pathname + urlObj.search,
        method: opts.method ?? "GET",
        headers,
        family: 4,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          const responseBody = Buffer.concat(chunks).toString();
          resolve(
            new Response(responseBody, {
              status: res.statusCode,
              headers: res.headers as HeadersInit,
            }),
          );
        });
      },
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

neonConfig.fetchFunction = ipv4Fetch;

export const sql = neon(process.env.POSTGRES_URL!);
