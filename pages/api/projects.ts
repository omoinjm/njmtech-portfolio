import { get } from '@vercel/edge-config';
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
	const data = await get('tabProjects');
	return NextResponse.json(data);
};

export const config = {
	runtime: 'experimental-edge',
};

export default handler;
