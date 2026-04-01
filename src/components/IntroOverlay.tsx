"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface IntroOverlayProps {
  onEnter: () => void;
}

/* Radiating ring that expands outward from the button and fades */
function PulseRing({ delay, duration }: { delay: number; duration: number }) {
  return (
    <span
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.35)",
        transform: "translate(-50%, -50%) scale(1)",
        animation: `pulseExpand ${duration}s ease-out ${delay}s infinite`,
        pointerEvents: "none",
      }}
    />
  );
}

export default function IntroOverlay({ onEnter }: IntroOverlayProps) {
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Inject the keyframe animation on mount
  useEffect(() => {
    setMounted(true);
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulseExpand {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.5;
        }
        100% {
          transform: translate(-50%, -50%) scale(8);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    styleRef.current = style;
    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
      }
    };
  }, []);

  const handleClick = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      onEnter();
    }, 600);
  }, [onEnter, exiting]);

  return (
    <div
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
      onClick={handleClick}
    >
      {/* Center: Logo in circle with pulsating rings */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Pulsating rings */}
        <PulseRing delay={0} duration={3} />
        <PulseRing delay={0.8} duration={3} />
        <PulseRing delay={1.6} duration={3} />

        {/* The circle with logo inside */}
        <div
          style={{
            width: "clamp(120px, 16vw, 180px)",
            height: "clamp(120px, 16vw, 180px)",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            transition: "border-color 0.3s ease, transform 0.6s ease, opacity 0.6s ease",
            transform: exiting ? "scale(1.2)" : "scale(1)",
            opacity: exiting ? 0 : 1,
            zIndex: 1,
            padding: "20%",
          }}
        >
          <img
            src="/inntw-logo-white.svg"
            alt="If Not Now Then When"
            style={{
              width: "100%",
              height: "auto",
              opacity: 0.85,
            }}
          />
        </div>

        {/* "Click to enter" text below the circle */}
        <p
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "clamp(9px, 0.9vw, 12px)",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            marginTop: "clamp(16px, 2.5vh, 28px)",
            transition: "opacity 0.4s ease",
            opacity: exiting ? 0 : 1,
            zIndex: 1,
          }}
        >
          Click to enter
        </p>
      </div>
    </div>
  );
}
