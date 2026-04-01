import { logger } from '@/utils/logger';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactRequest {
	name: string;
	email: string;
	subject: string;
	message: string;
}

const validateContactForm = (data: unknown): data is ContactRequest => {
	if (typeof data !== 'object' || data === null) return false;
	const obj = data as Record<string, unknown>;
	return (
		typeof obj.name === 'string' && obj.name.trim().length > 0 &&
		typeof obj.email === 'string' && obj.email.trim().length > 0 &&
		typeof obj.subject === 'string' && obj.subject.trim().length > 0 &&
		typeof obj.message === 'string' && obj.message.trim().length > 0
	);
};

function createTransporter() {
	return nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.NEXT_PUBLIC_EMAIL_USER,
			pass: process.env.NEXT_PUBLIC_EMAIL_APP_PASS,
		},
	});
}

export async function POST(request: Request) {
	try {
		const body = await request.json();

		if (!validateContactForm(body)) {
			logger.warn('Invalid contact form submission', body);
			return NextResponse.json({
				message: 'Missing required fields: name, email, subject, message',
			}, { status: 400 });
		}

		const { name, email, subject, message } = body;
		const ownerEmail = process.env.NEXT_PUBLIC_EMAIL_MAIL;
		const senderEmail = process.env.NEXT_PUBLIC_EMAIL_USER;

		if (!ownerEmail || !senderEmail || !process.env.NEXT_PUBLIC_EMAIL_APP_PASS) {
			logger.error('Email environment variables not configured');
			return NextResponse.json({ message: 'Email service not configured.' }, { status: 500 });
		}

		const transporter = createTransporter();

		// Notification email to site owner
		await transporter.sendMail({
			from: `"Portfolio Contact" <${senderEmail}>`,
			to: ownerEmail,
			replyTo: email,
			subject: `[Portfolio] ${subject}`,
			html: `
				<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
					<h2 style="color:#6366f1">New Contact Form Submission</h2>
					<table style="width:100%;border-collapse:collapse">
						<tr><td style="padding:8px 0;color:#888;width:80px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
						<tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
						<tr><td style="padding:8px 0;color:#888">Subject</td><td style="padding:8px 0">${subject}</td></tr>
					</table>
					<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
					<p style="color:#374151;white-space:pre-wrap">${message}</p>
				</div>`,
		});

		// Confirmation email to the sender
		await transporter.sendMail({
			from: `"Nhlanhla Malaza" <${senderEmail}>`,
			to: email,
			subject: `Thanks for reaching out, ${name.split(' ')[0]}!`,
			html: `
				<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
					<h2 style="color:#6366f1">Got your message!</h2>
					<p>Hi ${name.split(' ')[0]},</p>
					<p>Thanks for reaching out. I've received your message and will get back to you within 24 hours.</p>
					<blockquote style="border-left:3px solid #6366f1;margin:16px 0;padding:8px 16px;color:#6b7280;background:#f9fafb">
						${message}
					</blockquote>
					<p>Talk soon,<br/><strong>Nhlanhla</strong></p>
				</div>`,
		});

		logger.info('Contact emails sent', { name, email, subject });

		return NextResponse.json({
			message: 'Message sent! I\'ll be in touch within 24 hours.',
		});
	} catch (error) {
		logger.error('Contact API error', error);
		return NextResponse.json({
			message: 'Failed to send message. Please try again or email me directly.',
		}, { status: 500 });
	}
}

