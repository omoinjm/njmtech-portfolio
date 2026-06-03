import { config } from "@/lib/config";
import { logger } from "@/utils/logger";

type D1Param = number | string | null;

interface D1Message {
  message: string;
}

interface D1QueryResult<T> {
  results?: T[];
  success?: boolean;
}

interface D1Response<T> {
  errors?: D1Message[];
  result?: D1QueryResult<T>[];
  success: boolean;
}

const accountId = config.get("D1_ACCOUNT_ID");
const databaseId = config.get("D1_DATABASE_ID");
const apiToken = config.get("D1_API_TOKEN");

function getD1Endpoint() {
  if (!accountId || !databaseId) {
    return null;
  }

  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
}

export function isD1Configured() {
  return Boolean(accountId && databaseId && apiToken);
}

function getD1ConfigError() {
  return new Error("Cloudflare D1 is not configured.");
}

async function executeRequest<T>(
  body: { sql: string; params?: D1Param[] } | { batch: { sql: string; params?: D1Param[] }[] },
) {
  const endpoint = getD1Endpoint();

  if (!endpoint || !apiToken) {
    logger.warn("Cloudflare D1 credentials are missing");
    throw getD1ConfigError();
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`D1 request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as D1Response<T>;

  if (!payload.success) {
    throw new Error(payload.errors?.[0]?.message ?? "D1 request failed.");
  }

  for (const result of payload.result ?? []) {
    if (!result.success) {
      throw new Error(payload.errors?.[0]?.message ?? "D1 query failed.");
    }
  }

  return payload;
}

export async function queryD1<T>(sql: string, params: D1Param[] = []) {
  const payload = await executeRequest<T>({ sql, params });
  return payload.result?.[0]?.results ?? [];
}

export async function queryOneD1<T>(sql: string, params: D1Param[] = []) {
  const rows = await queryD1<T>(sql, params);
  return rows[0] ?? null;
}

export async function executeD1Statement(sql: string, params: D1Param[] = []) {
  await executeRequest<never>({ sql, params });
}
