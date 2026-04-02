import { sql } from "@/lib/neon-client";
import { logger } from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_HOURS = 48;

interface SubscriberRow {
  id: number;
  email: string;
  subscribed_at: string;
  last_attempt_at: string;
}

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS subscribers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      subscribed_at TIMESTAMPTZ DEFAULT NOW(),
      last_attempt_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

function sendWelcomeEmail(to: string, senderEmail: string, appPass: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: senderEmail, pass: appPass },
  });

  return transporter.sendMail({
    from: `"Nhlanhla Malaza" <${senderEmail}>`,
    to,
    subject: "You're on the list! \uD83C\uDF89",
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
      <h1 style="font-size:26px;font-weight:600;color:#f8f8ff;margin:0 0 8px;letter-spacing:-0.5px;font-family:'DM Sans',sans-serif;">You're on the list!</h1>
      <p style="font-size:15px;color:#a5b4fc;margin:0;font-family:'DM Sans',sans-serif;">Thanks for subscribing to NJMTech updates</p>
    </div>
    <div style="background:#ffffff;padding:32px 36px;">
      <div style="margin-bottom:24px;">
        <span style="display:inline-block;background:#d1fae520;border:1px solid #10b98140;color:#10b981;font-size:13px;font-weight:500;padding:5px 14px;border-radius:20px;">&#10003; Subscription confirmed</span>
      </div>
      <p style="color:#111827;font-size:16px;font-weight:500;margin-bottom:12px;">Hey there &#128075;</p>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin-bottom:20px;">You've successfully subscribed to updates from NJMTech. I'll keep you in the loop on new projects, articles, and anything else worth sharing.</p>
      <div style="display:block;margin:0 0 28px;">
        <span style="display:inline-block;padding:10px 18px;border-radius:8px;background:#f3f4f6;font-size:13px;color:#6b7280;font-family:'DM Sans',sans-serif;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#6366f1;margin-right:8px;vertical-align:middle;"></span>
          <span style="vertical-align:middle;">Expect updates, not spam</span>
        </span>
      </div>
      <hr style="border:none;border-top:1px solid #f0f0f5;margin-bottom:24px;"/>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;">Talk soon,<br/><strong style="color:#6366f1;font-size:16px;">Nhlanhla Malaza</strong></p>
    </div>
    <div style="background:#f9fafb;padding:20px 36px;text-align:center;border-top:1px solid #f0f0f5;">
      <p style="color:#9ca3af;font-size:12px;">You're receiving this because you subscribed at njmtech.vercel.app</p>
    </div>
  </div>
</body>
</html>`,
  });
}

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email?: string };

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 },
    );
  }

  const senderEmail = process.env.NEXT_PUBLIC_EMAIL_USER;
  const appPass = process.env.NEXT_PUBLIC_EMAIL_APP_PASS;

  if (!senderEmail || !appPass) {
    return NextResponse.json(
      { error: "Newsletter is not configured." },
      { status: 500 },
    );
  }

  try {
    await ensureTable();

    // Check for existing subscriber
    const rows = (await sql`
      SELECT id, email, subscribed_at, last_attempt_at
      FROM subscribers
      WHERE email = ${email}
    `) as SubscriberRow[];

    if (rows.length > 0) {
      const existing = rows[0];
      const hoursSinceLastAttempt =
        (Date.now() - new Date(existing.last_attempt_at).getTime()) / 36e5;

      // Update last_attempt_at on every attempt (even if already subscribed)
      await sql`
        UPDATE subscribers SET last_attempt_at = NOW() WHERE email = ${email}
      `;

      if (hoursSinceLastAttempt < RATE_LIMIT_HOURS) {
        const hoursLeft = Math.ceil(RATE_LIMIT_HOURS - hoursSinceLastAttempt);
        return NextResponse.json(
          { error: `You've already submitted recently. Please try again in ${hoursLeft} hour${hoursLeft === 1 ? "" : "s"}.` },
          { status: 429 },
        );
      }

      // Already subscribed and outside rate limit window
      return NextResponse.json(
        { error: "This email is already subscribed." },
        { status: 409 },
      );
    }

    // New subscriber — insert and send welcome email
    await sql`
      INSERT INTO subscribers (email) VALUES (${email})
    `;

    await sendWelcomeEmail(email, senderEmail, appPass);

    logger.info("New subscriber added", { email });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Subscribe error", error);
    return NextResponse.json(
      { error: "Could not complete subscription. Please try again." },
      { status: 502 },
    );
  }
}
