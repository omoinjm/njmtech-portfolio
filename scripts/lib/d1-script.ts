/**
 * Minimal D1 REST client for Node scripts (Infisical / CI env vars).
 */
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

function getEndpoint() {
  const accountId = process.env.D1_ACCOUNT_ID ?? process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId =
    process.env.D1_DATABASE_ID ?? "773865eb-1e3b-4ee3-9592-ffe658765d19";
  const apiToken = process.env.D1_API_TOKEN ?? process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    throw new Error(
      "D1 credentials missing. Set D1_ACCOUNT_ID, D1_DATABASE_ID, and D1_API_TOKEN (or CLOUDFLARE_* for CI).",
    );
  }

  return {
    endpoint: `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    apiToken,
  };
}

async function executeRequest<T>(
  body: { sql: string; params?: D1Param[] } | { batch: { sql: string; params?: D1Param[] }[] },
) {
  const { endpoint, apiToken } = getEndpoint();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`D1 request failed (${response.status}): ${text}`);
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

export async function executeD1(sql: string, params: D1Param[] = []) {
  await executeRequest<never>({ sql, params });
}
