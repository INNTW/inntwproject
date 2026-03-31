"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import FullScreenBoard, {
  type FullScreenBoardRef,
} from "@/components/display/FullScreenBoard";
import { formatLines, createEmptyBoard } from "@/lib/vestaboard/message-formatter";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { ContentRotator } from "@/lib/content/content-rotator";
import { QUOTES } from "@/lib/content/quotes";
import CountdownTimer from "@/components/CountdownTimer";
import EmailCapture from "@/components/EmailCapture";
import ParticleCanvas from "@/components/ParticleCanvas";


const FLIP_SPEED = 100;
const STAGGER_DELAY = 10;
const ROTATION_INTERVAL = 12;
const INITIAL_DELAY = 800;

export default function HomePage() {
  const boardRef = useRef<FullScreenBoardRef>(null);
  const [initialBoard] = useState(() => createEmptyBoard());
  const isTransitioningRef = useRef(false);
  const { audioEngine } = useAudioEngine();
  const rotatorRef = useRef(new ContentRotator(QUOTES));
  const soundEnabledRef = useRef(false);

  const onFlipStep = useCallback(() => {
    if (audioEngine.initialized && soundEnabledRef.current) {
      audioEngine.playClack(Math.floor(Math.random() * 3));
    }
  }, [audioEngine]);

  const showMessage = useCallback(
    async (lines: string[]) => {
      if (!boardRef.current || isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      soundEnabledRef.current = true;
      const target = formatLines(lines);
      await boardRef.current.transitionTo(target, FLIP_SPEED, STAGGER_DELAY, onFlipStep);
      soundEnabledRef.current = false;
      isTransitioningRef.current = false;
    },
    [onFlipStep]
  );

  const cycleNext = useCallback(async () => {
    const content = rotatorRef.current.next();
    await showMessage(content.lines);
  }, [showMessage]);

  useEffect(() => {
    const startTimeout = setTimeout(() => { cycleNext(); }, INITIAL_DELAY);
    const interval = setInterval(() => {
      if (!isTransitioningRef.current) cycleNext();
    }, ROTATION_INTERVAL * 1000);
    return () => { clearTimeout(startTimeout); clearInterval(interval); };
  }, [cycleNext]);

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        isTransitioningRef.current = false;
        cycleNext();
      }, 500);
    };
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("resize", handleResize); clearTimeout(resizeTimer); };
  }, [cycleNext]);

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* LAYER 1: Full-screen split-flap tile grid */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <FullScreenBoard ref={boardRef} initialBoard={initialBoard} />
      </div>

      {/* LAYER 2: Particles — drift upward through tile gaps */}
      <ParticleCanvas />

      {/* LAYER 3: Content overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/inntw-logo.svg"
            alt="INNTW"
            style={{
              width: "clamp(36px, 5vw, 56px)",
              height: "auto",
              opacity: 0.9,
              filter: "drop-shadow(0 0 8px rgba(0,0,0,0.5))",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: "22%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "auto",
          }}
        >
          <CountdownTimer />
        </div>

        <div
          style={{
            position: "absolute",
            top: "75%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "auto",
            width: "100%",
            maxWidth: "360px",
            padding: "0 24px",
          }}
        >
          <EmailCapture />
        </div>
      </div>
    </main>
  );
}
