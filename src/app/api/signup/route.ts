import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, consent_given, consent_text } = body;

    // Validate: at least one contact method
    if (!email && !phone) {
      return NextResponse.json(
        { error: "Please provide an email or phone number." },
        { status: 400 }
      );
    }

    // Validate: consent must be given
    if (!consent_given) {
      return NextResponse.json(
        { error: "You must agree to receive communications." },
        { status: 400 }
      );
    }

    // Basic email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Capture metadata for compliance
    const ip_address =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const user_agent = request.headers.get("user-agent") || "unknown";

    // Insert into Supabase using service role key (bypasses RLS)
    const res = await fetch(`${SUPABASE_URL}/rest/v1/signups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        email: email || null,
        phone: phone || null,
        consent_given,
        consent_text,
        ip_address,
        user_agent,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Supabase insert error:", errText);
      return NextResponse.json(
        { error: "Failed to save. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Signup API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
