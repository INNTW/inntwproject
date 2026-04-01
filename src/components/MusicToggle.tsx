"use client";

import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { audioEngine } from "@/lib/audio/audio-engine";

export interface MusicToggleRef {
  start: () => void;
}

const MusicToggle = forwardRef<MusicToggleRef>(function MusicToggle(_, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [soundOn, setSoundOn] = useState(true);
  const soundOnRef = useRef(true);
  const toggleRef = useRef(() => {});

  useImperativeHandle(ref, () => ({
    start() {
      const audio = audioRef.current;
      if (audio) {
        audio.play().catch(() => {});
      }
    },
  }));

  // Pause when user leaves (tab switch OR app switch), resume on return
  useEffect(() => {
    const pause = () => {
      const audio = audioRef.current;
      if (audio) audio.pause();
      audioEngine.setMuted(true);
    };

    const resume = () => {
      if (!soundOnRef.current) return;
      const audio = audioRef.current;
      if (audio) audio.play().catch(() => {});
      audioEngine.setMuted(false);
    };

    // Tab switch (within browser)
    const handleVisibility = () => {
      if (document.hidden) pause();
      else resume();
    };

    // App switch (window loses/gains focus)
    const handleBlur = () => pause();
    const handleFocus = () => resume();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Spacebar toggles sound — but not when focused on an input field
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault(); // prevent page scroll
      toggleRef.current();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggle = useCallback(() => {
    const newState = !soundOnRef.current;
    setSoundOn(newState);
    soundOnRef.current = newState;

    const audio = audioRef.current;
    if (audio) {
      if (newState) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }

    audioEngine.setMuted(!newState);
  }, []);

  // Keep toggleRef in sync so the keydown handler always calls the latest toggle
  toggleRef.current = toggle;

  return (
    <>
      <audio
        ref={audioRef}
        src="/angie-loop.mp3"
        loop
        preload="auto"
      />
      <button
        onClick={toggle}
        aria-label={soundOn ? "Mute all sound" : "Unmute all sound"}
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
        {soundOn ? (
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
    </>
  );
});

export default MusicToggle;
