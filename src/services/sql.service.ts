import { sql } from "@/lib/neon-client";
import { seed } from "@/lib/seed";
import { logger } from "@/utils/logger";

// Allowlist of valid table names to prevent SQL injection
const VALID_TABLES = [
  "skills",
  "projects",
  "links",
  "socials",
  "nav_menu",
  "nav_footer",
  "mail_template",
  "subscribers",
  "ai_voice_cache",
] as const;

function validateTableName(
  tblName: string,
): asserts tblName is (typeof VALID_TABLES)[number] {
  if (!VALID_TABLES.includes(tblName as (typeof VALID_TABLES)[number])) {
    throw new Error(`Invalid table name: ${tblName}`);
  }
}

export async function getList(tblName: string) {
  if (!sql) {
    logger.warn("Database not configured, returning empty result");
    return [];
  }

  try {
    validateTableName(tblName);
    logger.info(`Querying table: ${tblName}`);
    const rows = await sql`SELECT * FROM ${sql.unsafe(tblName)}`;
    logger.info(`Got ${rows.length} rows from ${tblName}`);

    return rows;
  } catch (err: unknown) {
    logger.error(`getList error for ${tblName}`, err);

    return await handleError(err, tblName);
  }
}

export async function getRecord(tblName: string) {
  if (!sql) {
    logger.warn("Database not configured, returning undefined");
    return undefined;
  }

  try {
    validateTableName(tblName);
    const rows = await sql`SELECT * FROM ${sql.unsafe(tblName)}`;

    return rows[0];
  } catch (err: unknown) {
    const rows = await handleError(err, tblName);
    return rows?.[0];
  }
}

export async function getVoiceCache(textHash: string) {
  if (!sql) return null;
  try {
    const rows = await sql`SELECT audio_url FROM ai_voice_cache WHERE response_text_hash = ${textHash} LIMIT 1`;
    return rows[0]?.audio_url || null;
  } catch (err) {
    logger.error("Failed to query ai_voice_cache", err);
    return null;
  }
}

function hasMessage(err: unknown): err is { message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as { message?: unknown }).message === "string"
  );
}

async function handleError(
  err: unknown,
  tblName: string,
): Promise<unknown[] | undefined> {
  if (
    hasMessage(err) &&
    err.message.includes(`relation "${tblName}" does not exist`)
  ) {
    logger.info(
      "Table does not exist, creating and seeding it with dummy data...",
    );

    try {
      await seed();
      logger.info(`Seed completed for ${tblName}`);
    } catch (seedError) {
      logger.error("Seed failed", seedError);
      throw seedError;
    }

    try {
      const rows = await sql`SELECT * FROM ${sql.unsafe(tblName)}`;
      logger.info(
        `Successfully queried ${tblName}, got ${rows.length} rows`,
      );
      return rows;
    } catch (queryError) {
      logger.error(`Failed to query ${tblName} after seed`, queryError);
      throw queryError;
    }
  }

  logger.error("Database error", { error: err, table: tblName });
  throw err;
}
