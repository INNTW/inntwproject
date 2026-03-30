"use client";

import { useState, useCallback } from "react";

const CONSENT_TEXT =
  "I agree to receive communications from INNTW, Inc. I understand that I may unsubscribe at any time.";

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
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const hasInput = email.trim().length > 0 || phone.trim().length > 0;
  const canSubmit = hasInput && consent && !submitting;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;

      setSubmitting(true);
      setError("");

      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim() || null,
            phone: phone.trim() || null,
            consent_given: consent,
            consent_text: CONSENT_TEXT,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Something went wrong");
        }

        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setEmail("");
          setPhone("");
          setConsent(false);
        }, 3000);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
    [email, phone, consent, canSubmit]
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
        WE&apos;LL BE IN TOUCH.
      </div>
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

      <div style={{ width: "100%" }}>
        <style>{`
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

      {/* Consent checkbox + submit — appear when there's input */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: hasInput ? "120px" : "0px",
          opacity: hasInput ? 1 : 0,
          transition: "max-height 0.4s ease, opacity 0.4s ease",
          width: "100%",
        }}
      >
        {/* Consent checkbox */}
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            cursor: "pointer",
            marginBottom: "12px",
          }}
        >
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              width: "14px",
              height: "14px",
              minWidth: "14px",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "2px",
              background: consent ? "rgba(255,255,255,0.15)" : "transparent",
              cursor: "pointer",
              marginTop: "2px",
              position: "relative",
            }}
          />
          {/* Custom checkmark */}
          {consent && (
            <span
              style={{
                position: "absolute",
                marginLeft: "3px",
                marginTop: "2px",
                color: "rgba(255,255,255,0.8)",
                fontSize: "10px",
                lineHeight: "14px",
                pointerEvents: "none",
              }}
            >
              ✓
            </span>
          )}
          <span
            style={{
              fontSize: "clamp(8px, 0.7vw, 10px)",
              fontFamily: "var(--font-geist-sans), sans-serif",
              color: "rgba(255,255,255,0.4)",
              lineHeight: "1.4",
              letterSpacing: "0.02em",
            }}
          >
            {CONSENT_TEXT}
          </span>
        </label>

        {/* Error message */}
        {error && (
          <div
            style={{
              fontSize: "clamp(8px, 0.7vw, 10px)",
              color: "rgba(255,100,100,0.8)",
              fontFamily: "var(--font-geist-sans), sans-serif",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            color: canSubmit ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
            fontSize: "clamp(10px, 0.9vw, 12px)",
            fontFamily: "var(--font-geist-mono), monospace",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "10px 32px",
            cursor: canSubmit ? "pointer" : "not-allowed",
            transition: "all 0.3s ease",
            width: "100%",
            marginTop: "4px",
            opacity: canSubmit ? 1 : 0.5,
          }}
          onMouseEnter={(e) => {
            if (canSubmit) {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
              e.currentTarget.style.color = "#fff";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            e.currentTarget.style.color = canSubmit
              ? "rgba(255,255,255,0.7)"
              : "rgba(255,255,255,0.25)";
          }}
        >
          {submitting ? "..." : "ENTER"}
        </button>
      </div>
    </form>
  );
}
