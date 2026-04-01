"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Create audio element on mount
  useEffect(() => {
    const audio = new Audio("/angie-loop.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!hasInteracted) setHasInteracted(true);

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing, hasInteracted]);

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Mute music" : "Unmute music"}
      style={{
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        opacity: 0.5,
        padding: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "0.8";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "0.5";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
      }}
    >
      {playing ? (
        /* Speaker with sound waves — unmuted */
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="rgba(255,255,255,0.15)" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        /* Speaker with X — muted */
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="rgba(255,255,255,0.08)" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
