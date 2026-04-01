import { seed } from "@/lib/seed";
import { logger } from "@/utils/logger";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000, // 10 seconds
  idleTimeoutMillis: 30000, // 30 seconds
  max: 10, // Maximum number of clients in the pool
});

// Allowlist of valid table names to prevent SQL injection
const VALID_TABLES = ["skills", "projects", "links", "socials"] as const;

function validateTableName(
  tblName: string,
): asserts tblName is (typeof VALID_TABLES)[number] {
  if (!VALID_TABLES.includes(tblName as (typeof VALID_TABLES)[number])) {
    throw new Error(`Invalid table name: ${tblName}`);
  }
}

export async function getList(tblName: string) {
  try {
    validateTableName(tblName);
    logger.info(`Querying table: ${tblName}`);
    const { rows } = await pool.query(`SELECT * FROM ${tblName}`);
    logger.info(`Got ${rows.length} rows from ${tblName}`);

    return rows;
  } catch (err: unknown) {
    logger.error(`getList error for ${tblName}`, err);

    // Extract error code from pg error or AggregateError
    const errorWithCode = err as Error & {
      code?: string;
      errors?: Array<{ code?: string }>;
    };
    if (errorWithCode?.code) {
      (err as any).code = errorWithCode.code;
    } else if (errorWithCode?.errors?.[0]?.code) {
      // Handle AggregateError from pg-pool
      (err as any).code = errorWithCode.errors[0].code;
    }

    return await handleError(err, tblName);
  }
}

export async function getRecord(tblName: string) {
  try {
    validateTableName(tblName);
    const { rows } = await pool.query(`SELECT * FROM ${tblName}`);

    return rows[0];
  } catch (err: unknown) {
    const rows = await handleError(err, tblName);
    return rows?.[0];
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
): Promise<any[] | undefined> {
  if (
    hasMessage(err) &&
    err.message.includes(`relation "${tblName}" does not exist`)
  ) {
    logger.info(
      "Table does not exist, creating and seeding it with dummy data...",
    );

    try {
      await seed(pool);
      logger.info(`Seed completed for ${tblName}`);
    } catch (seedError) {
      logger.error("Seed failed", seedError);
      throw seedError;
    }

    try {
      const result = await pool.query(`SELECT * FROM ${tblName}`);
      logger.info(
        `Successfully queried ${tblName}, got ${result.rows.length} rows`,
      );
      return result.rows;
    } catch (queryError) {
      logger.error(`Failed to query ${tblName} after seed`, queryError);
      throw queryError;
    }
  }

  logger.error("Database error", { error: err, table: tblName });
  throw err; // ✅ ensures no unhandled rejections
}
