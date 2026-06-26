import { logger } from '@/utils/logger';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_MS = 60 * 60 * 1000; // 1 hour per email address
const rateMap = new Map<string, number>();

interface ContactRequest {
	name: string;
	email: string;
	subject: string;
	message: string;
}

const escapeHtml = (str: string): string =>
	str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');

const validateContactForm = (data: unknown): data is ContactRequest => {
	if (typeof data !== 'object' || data === null) return false;
	const obj = data as Record<string, unknown>;
	return (
		typeof obj.name === 'string' && obj.name.trim().length > 0 &&
		typeof obj.email === 'string' && EMAIL_REGEX.test(obj.email.trim()) &&
		typeof obj.subject === 'string' && obj.subject.trim().length > 0 &&
		typeof obj.message === 'string' && obj.message.trim().length > 0
	);
};

function isRateLimited(email: string): boolean {
	const last = rateMap.get(email);
	if (last && Date.now() - last < RATE_LIMIT_MS) return true;
	rateMap.set(email, Date.now());
	return false;
}

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_APP_PASS,
	},
});

export async function POST(request: Request) {
	try {
		const body = await request.json();

		if (!validateContactForm(body)) {
			logger.warn('Invalid contact form submission', body);
			return NextResponse.json({
				message: 'Missing or invalid required fields: name, email, subject, message',
			}, { status: 400 });
		}

		const { name, email, subject, message } = body;

		if (isRateLimited(email)) {
			return NextResponse.json(
				{ message: 'Too many requests. Please try again in an hour.' },
				{ status: 429 },
			);
		}

		const ownerEmail = process.env.EMAIL_MAIL;
		const senderEmail = process.env.EMAIL_USER;

		if (!ownerEmail || !senderEmail || !process.env.EMAIL_APP_PASS) {
			logger.error('Email environment variables not configured');
			return NextResponse.json({ message: 'Email service not configured.' }, { status: 500 });
		}

		const safeName = escapeHtml(name.trim());
		const safeEmail = escapeHtml(email.trim());
		const safeSubject = escapeHtml(subject.trim());
		const safeMessage = escapeHtml(message.trim());
		const firstName = safeName.split(' ')[0];

		// Notification email to site owner
		await transporter.sendMail({
			from: `"Portfolio Contact" <${senderEmail}>`,
			to: ownerEmail,
			replyTo: email,
			subject: `[Portfolio] ${safeSubject}`,
			html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#f4f4f8;padding:40px 16px;}
</style>
</head>
<body style="background:#f4f4f8;padding:40px 16px;">
  <div style="max-width:600px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#0f0c29;padding:52px 40px 44px;text-align:center;">
      <div style="display:block;width:52px;height:52px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#818cf8);margin:0 auto 20px;line-height:52px;font-size:22px;font-weight:700;color:#ffffff;text-align:center;">N</div>
      <h1 style="font-size:26px;font-weight:600;color:#f8f8ff;margin:0 0 8px;letter-spacing:-0.5px;font-family:'DM Sans',sans-serif;">New message incoming</h1>
      <p style="font-size:15px;color:#a5b4fc;margin:0;font-family:'DM Sans',sans-serif;">Someone reached out via your portfolio</p>
    </div>
    <div style="background:#ffffff;padding:32px 36px;">
      <span style="display:inline-block;background:#ede9fe;color:#4f46e5;font-size:11px;font-weight:600;letter-spacing:0.3px;text-transform:uppercase;padding:4px 10px;border-radius:20px;margin-bottom:24px;">Portfolio Contact</span>
      <div style="margin-bottom:20px;">
        <div style="display:flex;align-items:baseline;padding:12px 0;border-bottom:1px solid #f0f0f5;">
          <span style="min-width:70px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:500;">Name</span>
          <span style="color:#111827;font-size:15px;font-weight:500;">${safeName}</span>
        </div>
        <div style="display:flex;align-items:baseline;padding:12px 0;border-bottom:1px solid #f0f0f5;">
          <span style="min-width:70px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:500;">Email</span>
          <span style="color:#111827;font-size:15px;"><a href="mailto:${safeEmail}" style="color:#6366f1;text-decoration:none;">${safeEmail}</a></span>
        </div>
        <div style="display:flex;align-items:baseline;padding:12px 0;border-bottom:1px solid #f0f0f5;">
          <span style="min-width:70px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:500;">Subject</span>
          <span style="color:#111827;font-size:15px;font-weight:500;">${safeSubject}</span>
        </div>
      </div>
      <div style="background:#f9fafb;border-radius:10px;border:1px solid #f0f0f5;padding:20px 24px;margin-bottom:28px;">
        <p style="color:#374151;font-size:15px;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
      </div>
      <a href="mailto:${safeEmail}?subject=Re: ${safeSubject}" style="display:block;text-align:center;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px;border-radius:10px;">Reply to ${firstName} &rarr;</a>
    </div>
    <div style="background:#f9fafb;padding:20px 36px;text-align:center;border-top:1px solid #f0f0f5;">
      <p style="color:#9ca3af;font-size:12px;">Sent via your portfolio contact form &middot; Hit Reply to respond directly</p>
    </div>
  </div>
</body>
</html>`,
		});

		// Confirmation email to the sender
		await transporter.sendMail({
			from: `"Nhlanhla Malaza" <${senderEmail}>`,
			to: email,
			subject: `Thanks for reaching out, ${firstName}!`,
			html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#f4f4f8;padding:40px 16px;}
</style>
</head>
<body style="background:#f4f4f8;padding:40px 16px;">
  <div style="max-width:600px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#0f0c29;padding:52px 40px 44px;text-align:center;">
      <div style="display:block;width:52px;height:52px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#818cf8);margin:0 auto 20px;line-height:52px;font-size:22px;font-weight:700;color:#ffffff;text-align:center;">N</div>
      <h1 style="font-size:26px;font-weight:600;color:#f8f8ff;margin:0 0 8px;letter-spacing:-0.5px;font-family:'DM Sans',sans-serif;">Got your message!</h1>
      <p style="font-size:15px;color:#a5b4fc;margin:0;font-family:'DM Sans',sans-serif;">I'll be in touch within 24 hours</p>
    </div>
    <div style="background:#ffffff;padding:32px 36px;">
      <div style="margin-bottom:24px;">
        <span style="display:inline-block;background:#d1fae520;border:1px solid #10b98140;color:#10b981;font-size:13px;font-weight:500;padding:5px 14px;border-radius:20px;">&#10003; Message received</span>
      </div>
      <p style="color:#111827;font-size:16px;font-weight:500;margin-bottom:12px;">Hi ${firstName},</p>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin-bottom:20px;">Thanks for reaching out &mdash; I've received your message and will get back to you as soon as possible.</p>
      <div style="border-left:3px solid #6366f1;background:#f9fafb;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
        <p style="color:#6b7280;font-size:14px;line-height:1.7;font-style:italic;white-space:pre-wrap;">${safeMessage}</p>
      </div>
      <div style="display:block;margin:0 0 28px;">
        <span style="display:inline-block;padding:10px 18px;border-radius:8px;background:#f3f4f6;font-size:13px;color:#6b7280;font-family:'DM Sans',sans-serif;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#6366f1;margin-right:8px;vertical-align:middle;"></span>
          <span style="vertical-align:middle;">Response within 24 hours</span>
        </span>
      </div>
      <hr style="border:none;border-top:1px solid #f0f0f5;margin-bottom:24px;"/>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;">Talk soon,<br/><strong style="color:#6366f1;font-size:16px;">Nhlanhla Malaza</strong></p>
    </div>
    <div style="background:#f9fafb;padding:20px 36px;text-align:center;border-top:1px solid #f0f0f5;">
      <p style="color:#9ca3af;font-size:12px;">You're receiving this because you submitted a message via njmtech.vercel.app</p>
    </div>
  </div>
</body>
</html>`,
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
