import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email?: string };

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 },
    );
  }

  const mailchimpUrl = process.env.NEXT_PUBLIC_MAILCHIMP_URL;

  if (!mailchimpUrl) {
    return NextResponse.json(
      { error: "Newsletter is not configured." },
      { status: 500 },
    );
  }

  // Mailchimp embedded form uses /subscribe/post; swap to /subscribe/post-json
  // for a JSONP-style response we can parse server-side.
  const jsonUrl =
    mailchimpUrl.replace("/subscribe/post?", "/subscribe/post-json?") +
    `&EMAIL=${encodeURIComponent(email)}&c=__mc_response__`;

  try {
    const res = await fetch(jsonUrl, {
      method: "GET",
      headers: { "User-Agent": "njmtech-portfolio/1.0" },
    });

    const text = await res.text();

    // Response is JSONP: __mc_response__({"result":"...","msg":"..."})
    const jsonMatch = text.match(/__mc_response__\(([\s\S]*)\)/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Unexpected response from newsletter service." },
        { status: 502 },
      );
    }

    const data = JSON.parse(jsonMatch[1]) as { result: string; msg: string };

    if (data.result === "success") {
      return NextResponse.json({ success: true });
    }

    // Mailchimp returns HTML-encoded messages — strip tags for a clean error
    const cleanMsg = data.msg
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return NextResponse.json({ error: cleanMsg }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the newsletter service. Please try again." },
      { status: 502 },
    );
  }
}
