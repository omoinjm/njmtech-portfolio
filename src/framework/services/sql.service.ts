import { seed } from '@/framework/lib/seed';
import { logger } from '@/framework/utils/logger';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL_NON_POOLING,
  ssl: { rejectUnauthorized: false },
});

export async function getList(tblName: string) {
  try {
    const { rows } = await pool.query(`SELECT * FROM ${tblName}`);

    return rows;
  } catch (err: any) {
    await handleError(err, tblName);
  }
}

export async function getRecord(tblName: string) {
  try {
    const { rows } = await pool.query(`SELECT * FROM ${tblName}`);

    return rows[0];
  } catch (err: any) {
    await handleError(err, tblName);
  }
}

async function handleError(err: any, tblName: string) {
  if (err?.message?.includes(`relation "${tblName}" does not exist`)) {
    logger.info('Table does not exist, creating and seeding it with dummy data...');

    await seed();

    const { rows } = await pool.query(`SELECT * FROM ${tblName}`);
    return rows;
  }

  throw err; // ✅ ensures no unhandled rejections
}
