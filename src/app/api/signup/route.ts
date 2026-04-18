import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, consent_given, consent_text } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Please provide an email or phone number." },
        { status: 400 }
      );
    }

    if (!consent_given) {
      return NextResponse.json(
        { error: "You must agree to receive communications." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const ip_address =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const user_agent = request.headers.get("user-agent") || "unknown";

    await sql`
      INSERT INTO signups (email, phone, consent_given, consent_text, ip_address, user_agent)
      VALUES (${email || null}, ${phone || null}, ${consent_given}, ${consent_text || null}, ${ip_address}, ${user_agent})
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Signup API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
