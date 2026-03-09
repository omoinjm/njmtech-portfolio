import { getList } from '@/services/sql.service';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const data = await getList('nav_menu');
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({
			error: error instanceof Error ? error.message : 'Internal server error',
		}, { status: 500 });
	}
}
