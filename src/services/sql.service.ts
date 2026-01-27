import { seed } from '@/lib/seed';
import { logger } from '@/utils/logger';
import { Pool } from 'pg';

const pool = new Pool({
	connectionString: process.env.POSTGRES_URL_NON_POOLING,
	ssl: { rejectUnauthorized: false },
});

// Allowlist of valid table names to prevent SQL injection
const VALID_TABLES = ['skills', 'projects', 'menu', 'socials'] as const;

function validateTableName(tblName: string): asserts tblName is typeof VALID_TABLES[number] {
	if (!VALID_TABLES.includes(tblName as typeof VALID_TABLES[number])) {
		throw new Error(`Invalid table name: ${tblName}`);
	}
}

export async function getList(tblName: string) {
	try {
		validateTableName(tblName);
		const { rows } = await pool.query(`SELECT * FROM ${tblName}`);

		return rows;
	} catch (err: unknown) {
		await handleError(err, tblName);
	}
}

export async function getRecord(tblName: string) {
	try {
		validateTableName(tblName);
		const { rows } = await pool.query(`SELECT * FROM ${tblName}`);

		return rows[0];
	} catch (err: unknown) {
		await handleError(err, tblName);
	}
}

function hasMessage(err: unknown): err is { message: string } {
	return (
		typeof err === 'object' &&
		err !== null &&
		'message' in err &&
		typeof (err as { message?: unknown }).message === 'string'
	);
}

async function handleError(err: unknown, tblName: string) {
	if (
		hasMessage(err) &&
		err.message.includes(`relation "${tblName}" does not exist`)
	) {
		logger.info(
			'Table does not exist, creating and seeding it with dummy data...',
		);

		await seed();

		const { rows } = await pool.query(`SELECT * FROM ${tblName}`);
		return rows;
	}

	throw err; // ✅ ensures no unhandled rejections
}
