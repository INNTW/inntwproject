"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface IntroOverlayProps {
  onEnter: () => void;
}

/* Fixed-size square container ensures perfect circles */
const RING_SIZE = 140; // px — base size for the ring container

/* Radiating ring: uses fixed pixel width/height so it's always a perfect circle */
function PulseRing({ delay, duration }: { delay: number; duration: number }) {
  return (
    <span
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: `${RING_SIZE}px`,
        height: `${RING_SIZE}px`,
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
  const [collapsingDone, setCollapsingDone] = useState(false);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulseExpand {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.5;
        }
        100% {
          transform: translate(-50%, -50%) scale(12);
          opacity: 0;
        }
      }
      @keyframes collapseIn {
        0% {
          transform: translate(-50%, -50%) scale(20);
          opacity: 0;
        }
        30% {
          opacity: 0.6;
        }
        100% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 0.8;
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
    // Wait for the collapse animation to finish, then dismiss
    setTimeout(() => {
      setCollapsingDone(true);
      setTimeout(() => {
        onEnter();
      }, 300);
    }, 900);
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
        transition: collapsingDone ? "opacity 0.3s ease" : "none",
        opacity: collapsingDone ? 0 : 1,
        pointerEvents: collapsingDone ? "none" : "auto",
      }}
      onClick={handleClick}
    >
      {/* Center container — fixed square so rings are perfect circles */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: `${RING_SIZE}px`,
          height: `${RING_SIZE}px`,
        }}
      >
        {/* Pulsating rings — only show when not exiting */}
        {!exiting && (
          <>
            <PulseRing delay={0} duration={3} />
            <PulseRing delay={0.8} duration={3} />
            <PulseRing delay={1.6} duration={3} />
          </>
        )}

        {/* Collapsing ring — appears on click, shrinks from outside screen to center */}
        {exiting && !collapsingDone && (
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: `${RING_SIZE}px`,
              height: `${RING_SIZE}px`,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.6)",
              animation: "collapseIn 0.9s ease-in forwards",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Logo — no circle border, just the logo */}
        <img
          src="/inntw-logo-white.svg"
          alt="If Not Now Then When"
          style={{
            width: "clamp(80px, 11vw, 120px)",
            height: "auto",
            opacity: 0.85,
            zIndex: 1,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>

      {/* "Click to enter" text below */}
      <p
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "clamp(9px, 0.9vw, 12px)",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
          marginTop: "clamp(20px, 3vh, 36px)",
          transition: "opacity 0.3s ease",
          opacity: exiting ? 0 : 1,
        }}
      >
        Click to enter
      </p>
    </div>
  );
}
