/**
 * Email API Tests
 *
 * Tests the portfolio's email-related API routes against a live dev environment.
 *
 * Prerequisites (both must be running):
 *   Portfolio:      cd njmtech-portfolio && pnpm dev          (localhost:3000)
 *   Template API:   cd njmtech-email-template-api && npm run dev  (localhost:3001)
 *
 * Run:
 *   pnpm test:email
 *
 * The test email below receives real emails during the live send tests.
 * Override it without editing this file:
 *   TEST_EMAIL=other@mail.com pnpm test:email
 */

import { test, expect } from '@playwright/test';

const TEMPLATE_API_URL = process.env.TEMPLATE_API_URL || 'http://localhost:3001';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Temp email used for all live send tests — real emails will be delivered here
const TEST_EMAIL = process.env.TEST_EMAIL || 'yevoy26479@fengnu.com';

test.describe('Email API', () => {
	let templateServerRunning = false;

	/**
	 * Pre-flight check — ping the template server before any test runs.
	 * If it is unreachable every test in this suite is skipped with a clear message
	 * rather than failing with a cryptic connection error.
	 */
	test.beforeAll(async ({ request }) => {
		try {
			const res = await request.get(TEMPLATE_API_URL, { timeout: 5000 });
			templateServerRunning = res.ok();
		} catch {
			templateServerRunning = false;
		}

		if (!templateServerRunning) {
			console.warn(
				`\n⚠️  Email template server not reachable at ${TEMPLATE_API_URL}` +
					'\n   Start it with: cd njmtech-email-template-api && npm run dev\n',
			);
		}
	});

	/** Skip individual tests when the template server is not available. */
	test.beforeEach(({ request: _request }, testInfo) => {
		if (!templateServerRunning) {
			testInfo.skip(true, `Email template server not running at ${TEMPLATE_API_URL}`);
		}
	});

	/**
	 * Template Server Health
	 *
	 * Verifies the email template API itself is healthy and can render templates
	 * before we rely on it for the portfolio email routes.
	 */
	test.describe('Template server health', () => {
		// Basic liveness check — confirms the server is up and serving HTML
		test('GET / returns 200 and HTML', async ({ request }) => {
			const res = await request.get(TEMPLATE_API_URL);
			expect(res.status()).toBe(200);
			expect(res.headers()['content-type']).toMatch(/html/);
		});

		// Smoke test for template rendering — uses contact_notification because it
		// exercises extra body vars (subject, message) beyond the base required fields
		test('POST /template with valid payload renders HTML', async ({ request }) => {
			const res = await request.post(`${TEMPLATE_API_URL}/template`, {
				data: {
					template_name: 'contact_notification',
					first_name: 'Playwright',
					last_name: 'Test',
					email: 'playwright@example.com',
					subject: 'Health check',
					message: 'Template server is reachable.',
				},
			});
			expect(res.status()).toBe(200);
			expect(res.headers()['content-type']).toMatch(/html/);
			const html = await res.text();
			expect(html).toContain('Playwright Test');
		});
	});

	/**
	 * POST /api/contact
	 *
	 * The contact route validates input, enforces a 1-hour per-email rate limit,
	 * and sends two emails on success:
	 *   1. Owner notification  (to EMAIL_MAIL env var)
	 *   2. Auto-reply confirmation  (to the submitted email address)
	 */
	test.describe('POST /api/contact', () => {
		// Validation: completely empty body should be rejected
		test('returns 400 when body is empty', async ({ request }) => {
			const res = await request.post(`${BASE_URL}/api/contact`, { data: {} });
			expect(res.status()).toBe(400);
		});

		// Validation: malformed email should fail the EMAIL_REGEX check
		test('returns 400 when email format is invalid', async ({ request }) => {
			const res = await request.post(`${BASE_URL}/api/contact`, {
				data: {
					name: 'Test User',
					email: 'not-an-email',
					subject: 'Test',
					message: 'Hello',
				},
			});
			expect(res.status()).toBe(400);
		});

		// Validation: partial body (missing subject, email, message) should be rejected
		test('returns 400 when required fields are missing', async ({ request }) => {
			const res = await request.post(`${BASE_URL}/api/contact`, {
				data: { name: 'Test User' },
			});
			expect(res.status()).toBe(400);
		});

		/**
		 * Live send + rate limit test.
		 *
		 * Uses TEST_EMAIL so real delivery can be verified in the inbox.
		 *
		 * The rate limit is in-memory and resets on server restart, so two scenarios
		 * are both valid:
		 *   a) First request succeeds (200) → second is immediately blocked (429)
		 *   b) Rate limit still active from a prior run within the hour → first is 429
		 */
		test('sends emails on valid submission and enforces rate limiting', async ({ request }) => {
			const first = await request.post(`${BASE_URL}/api/contact`, {
				data: {
					name: 'Playwright Test',
					email: TEST_EMAIL,
					subject: 'Playwright Email Test',
					message: 'This is an automated test submitted by Playwright.',
				},
			});

			if (first.status() === 200) {
				const body = await first.json();
				expect(body).toHaveProperty('message');

				// Same email immediately after — must be rate-limited
				const second = await request.post(`${BASE_URL}/api/contact`, {
					data: {
						name: 'Playwright Test',
						email: TEST_EMAIL,
						subject: 'Second attempt',
						message: 'This should be blocked by rate limiting.',
					},
				});
				expect(second.status()).toBe(429);
			} else {
				// Rate limit still active from a previous run within the hour — valid state
				expect(first.status()).toBe(429);
			}
		});
	});

	/**
	 * POST /api/subscribe
	 *
	 * The subscribe route validates the email, stores it in Neon PostgreSQL,
	 * enforces a 48-hour per-email rate limit, and sends a welcome email on first
	 * successful subscription.
	 */
	test.describe('POST /api/subscribe', () => {
		// Validation: body with no email field should be rejected
		test('returns 400 when email is missing', async ({ request }) => {
			const res = await request.post(`${BASE_URL}/api/subscribe`, { data: {} });
			expect(res.status()).toBe(400);
		});

		// Validation: malformed email should fail the EMAIL_REGEX check
		test('returns 400 when email is invalid', async ({ request }) => {
			const res = await request.post(`${BASE_URL}/api/subscribe`, {
				data: { email: 'bad-email' },
			});
			expect(res.status()).toBe(400);
		});

		/**
		 * Live subscribe test using TEST_EMAIL.
		 *
		 * Because the DB persists across runs all three outcomes are valid:
		 *   200 — first successful subscription, welcome email sent to TEST_EMAIL
		 *   409 — email already in the subscribers table
		 *   429 — re-submitted within the 48-hour rate limit window
		 */
		test('accepts a valid email and returns 200, 409, or 429', async ({ request }) => {
			const res = await request.post(`${BASE_URL}/api/subscribe`, {
				data: { email: TEST_EMAIL },
			});
			expect([200, 409, 429]).toContain(res.status());
		});
	});
});
