const RESEND_API = "https://api.resend.com/emails";

export async function sendWelcomeEmail(to: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set; skipping welcome email");
    return;
  }

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "INNTW <now@inntwproject.com>",
      to,
      subject: "if not now, then when.",
      text: "your email is in.\n\nthank you.\n\nwe'll be in touch.\n\n—INNTW",
    }),
  });

  if (!res.ok) {
    console.error("Resend send failed:", res.status, await res.text());
  }
}
