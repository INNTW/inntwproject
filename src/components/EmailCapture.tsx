"use client";

import { useState, useCallback } from "react";

const inputStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(255,255,255,0.2)",
  outline: "none",
  color: "#fff",
  fontSize: "clamp(13px, 1.2vw, 16px)",
  fontFamily: "var(--font-geist-sans), sans-serif",
  letterSpacing: "0.04em",
  padding: "8px 0",
  width: "100%",
  transition: "border-color 0.3s ease",
};

const placeholderColor = "rgba(255,255,255,0.35)";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const hasInput = email.trim().length > 0 || phone.trim().length > 0;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {      e.preventDefault();
      if (!hasInput) return;

      // TODO: Wire to your backend / Supabase / API endpoint
      console.log("Submitted:", { email: email.trim(), phone: phone.trim() });
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
        setPhone("");
      }, 3000);
    },
    [email, phone, hasInput]
  );

  if (submitted) {
    return (
      <div
        style={{
          textAlign: "center",
          fontFamily: "var(--font-geist-sans), sans-serif",
          color: "rgba(255,255,255,0.6)",
          fontSize: "clamp(12px, 1.1vw, 15px)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        WE'LL BE IN TOUCH.      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        width: "100%",
        maxWidth: "360px",
      }}
    >
      <div
        style={{
          fontSize: "clamp(10px, 0.9vw, 12px)",
          fontFamily: "var(--font-geist-sans), sans-serif",
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
          marginBottom: "-4px",
        }}
      >
        Sign up for early access:
      </div>

      <div style={{ width: "100%" }}>        <style>{`
          .capture-input::placeholder { color: ${placeholderColor}; }
          .capture-input:focus { border-bottom-color: rgba(255,255,255,0.35) !important; }
        `}</style>
        <input
          className="capture-input"
          type="email"
          placeholder="EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
          style={inputStyle}
          autoComplete="email"
        />
      </div>

      <div style={{ width: "100%" }}>
        <input
          className="capture-input"
          type="tel"
          placeholder="PHONE"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onFocus={() => setFocusedField("phone")}
          onBlur={() => setFocusedField(null)}
          style={inputStyle}
          autoComplete="tel"
        />
      </div>
      {/* Submit button — only appears when there's input */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: hasInput ? "60px" : "0px",
          opacity: hasInput ? 1 : 0,
          transition: "max-height 0.4s ease, opacity 0.4s ease",
          width: "100%",
        }}
      >
        <button
          type="submit"
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.7)",
            fontSize: "clamp(10px, 0.9vw, 12px)",
            fontFamily: "var(--font-geist-mono), monospace",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "10px 32px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            width: "100%",
            marginTop: "4px",
          }}
          onMouseEnter={(e) => {            e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            e.currentTarget.style.color = "rgba(255,255,255,0.7)";
          }}
        >
          ENTER
        </button>
      </div>
    </form>
  );
}
