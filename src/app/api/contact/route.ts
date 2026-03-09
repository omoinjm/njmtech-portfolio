import { logger } from '@/utils/logger';
import { NextResponse } from 'next/server';

interface ContactRequest {
	first_name: string;
	last_name: string;
	email_address: string;
	phone?: string;
	message: string;
}

const validateContactForm = (data: unknown): data is ContactRequest => {
	if (typeof data !== 'object' || data === null) return false;
	const obj = data as Record<string, unknown>;
	return (
		typeof obj.first_name === 'string' &&
		typeof obj.last_name === 'string' &&
		typeof obj.email_address === 'string' &&
		typeof obj.message === 'string' &&
		obj.first_name.length > 0 &&
		obj.last_name.length > 0 &&
		obj.email_address.length > 0 &&
		obj.message.length > 0
	);
};

export async function POST(request: Request) {
	try {
		const body = await request.json();
		if (!validateContactForm(body)) {
			logger.warn('Invalid contact form submission', body);
			return NextResponse.json({
				status: 400,
				message: 'Invalid request',
				error:
					'Missing required fields: first_name, last_name, email_address, message',
			}, { status: 400 });
		}

		const { first_name, last_name, email_address, message, phone } = body;

		logger.info('Contact form submission received', {
			first_name,
			last_name,
			email_address,
			phone,
			timestamp: new Date().toISOString(),
		});

		return NextResponse.json({
			status: 200,
			message: 'Contact form submitted successfully. We will be in touch soon!',
		});
	} catch (error) {
		logger.error('Contact API error', error);
		return NextResponse.json({
			status: 500,
			message: 'Internal server error',
			error: error instanceof Error ? error.message : 'Unknown error',
		}, { status: 500 });
	}
}
