"use client";

import { useState, useCallback } from "react";

interface IntroOverlayProps {
  onEnter: () => void;
}

export default function IntroOverlay({ onEnter }: IntroOverlayProps) {
  const [exiting, setExiting] = useState(false);

  const handleClick = useCallback(() => {
    setExiting(true);
    // Small delay so the fade-out animation plays before we trigger everything
    setTimeout(() => {
      onEnter();
    }, 600);
  }, [onEnter]);

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "opacity 0.6s ease",
        opacity: exiting ? 0 : 1,
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      {/* The question */}
      <h1
        style={{
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontSize: "clamp(28px, 5vw, 56px)",
          fontWeight: 300,
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.85)",
          textTransform: "uppercase",
          textAlign: "center",
          margin: 0,
          lineHeight: 1.3,
          transition: "opacity 0.6s ease, transform 0.6s ease",
          opacity: exiting ? 0 : 1,
          transform: exiting ? "translateY(-20px)" : "translateY(0)",
        }}
      >
        IF NOT NOW
      </h1>

      {/* Subtle prompt */}
      <p
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "clamp(9px, 0.9vw, 12px)",
          letterSpacing: "0.25em",
          color: "rgba(255,255,255,0.25)",
          textTransform: "uppercase",
          marginTop: "clamp(24px, 4vh, 48px)",
          transition: "opacity 0.4s ease",
          opacity: exiting ? 0 : 1,
        }}
      >
        TAP TO FIND OUT
      </p>
    </div>
  );
}
