"use client";

import { memo, useRef, useCallback, useEffect, useImperativeHandle, forwardRef } from "react";
import { codeToChar } from "@/lib/vestaboard/charset";
import styles from "@/styles/tile.module.css";

export interface SplitFlapTileRef {
  flipTo: (nextCode: number, duration: number) => Promise<void>;
  getCurrentCode: () => number;
}

interface SplitFlapTileProps {
  initialCode: number;
  row: number;
  col: number;
}

const SplitFlapTile = memo(
  forwardRef<SplitFlapTileRef, SplitFlapTileProps>(
    function SplitFlapTile({ initialCode, row, col }, ref) {
      const currentCodeRef = useRef(initialCode);
      const isFlippingRef = useRef(false);

      const topHalfCharRef = useRef<HTMLDivElement>(null);
      const bottomHalfCharRef = useRef<HTMLDivElement>(null);
      const flapFrontCharRef = useRef<HTMLDivElement>(null);
      const flapBackCharRef = useRef<HTMLDivElement>(null);
      const flapFrontRef = useRef<HTMLDivElement>(null);
      const flapBackRef = useRef<HTMLDivElement>(null);
      useEffect(() => {
        const char = codeToChar(initialCode);
        if (topHalfCharRef.current) topHalfCharRef.current.textContent = char;
        if (bottomHalfCharRef.current) bottomHalfCharRef.current.textContent = char;
        if (flapFrontCharRef.current) flapFrontCharRef.current.textContent = char;
        if (flapBackCharRef.current) flapBackCharRef.current.textContent = char;
        currentCodeRef.current = initialCode;
      }, [initialCode]);

      const flipTo = useCallback(
        (nextCode: number, duration: number): Promise<void> => {
          return new Promise((resolve) => {
            if (isFlippingRef.current) { resolve(); return; }
            isFlippingRef.current = true;
            const currentChar = codeToChar(currentCodeRef.current);
            const nextChar = codeToChar(nextCode);

            const flapFront = flapFrontRef.current;
            const flapBack = flapBackRef.current;
            const topHalfChar = topHalfCharRef.current;
            const bottomHalfChar = bottomHalfCharRef.current;
            const flapFrontChar = flapFrontCharRef.current;
            const flapBackChar = flapBackCharRef.current;

            if (!flapFront || !flapBack || !topHalfChar || !bottomHalfChar || !flapFrontChar || !flapBackChar) {
              resolve(); return;
            }
            flapFrontChar.textContent = currentChar;
            flapBackChar.textContent = nextChar;
            bottomHalfChar.textContent = nextChar;

            flapFront.style.transform = "rotateX(0deg)";
            flapFront.style.zIndex = "3";
            flapBack.style.transform = "rotateX(90deg)";
            flapBack.style.zIndex = "2";
            flapFront.style.willChange = "transform, box-shadow";
            flapBack.style.willChange = "transform, box-shadow";

            const halfDuration = duration / 2;

            flapFront.style.transition = `transform ${halfDuration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95), box-shadow ${halfDuration}ms ease`;
            flapFront.style.transform = "rotateX(-90deg)";
            flapFront.style.boxShadow = "inset 0 1px 0 var(--tile-highlight), 0 8px 16px rgba(0,0,0,0.4)";
            flapFront.style.setProperty("--flap-darken", "1");

            setTimeout(() => {
              flapFront.style.zIndex = "1";
              flapBack.style.zIndex = "3";
              flapBack.style.transition = `transform ${halfDuration}ms cubic-bezier(0.15, 0.85, 0.3, 1.35), box-shadow ${halfDuration}ms ease`;
              flapBack.style.transform = "rotateX(0deg)";
              flapBack.style.boxShadow = "inset 0 1px 0 var(--tile-split), 0 1px 3px var(--tile-shadow)";
              flapBack.style.setProperty("--flap-brighten", "1");
            }, halfDuration);
            setTimeout(() => {
              topHalfChar.textContent = nextChar;
              flapFrontChar.textContent = nextChar;
              flapFront.style.transition = "none";
              flapBack.style.transition = "none";
              flapFront.style.transform = "rotateX(0deg)";
              flapFront.style.zIndex = "3";
              flapFront.style.boxShadow = "inset 0 1px 0 var(--tile-highlight), 0 1px 3px var(--tile-shadow)";
              flapFront.style.setProperty("--flap-darken", "0");
              flapBack.style.transform = "rotateX(90deg)";
              flapBack.style.zIndex = "2";
              flapBack.style.boxShadow = "inset 0 1px 0 var(--tile-split), 0 1px 3px var(--tile-shadow)";
              flapBack.style.setProperty("--flap-brighten", "0");
              flapFront.style.willChange = "auto";
              flapBack.style.willChange = "auto";
              currentCodeRef.current = nextCode;
              isFlippingRef.current = false;
              resolve();
            }, duration);
          });
        },
        []
      );

      const getCurrentCode = useCallback(() => currentCodeRef.current, []);
      useImperativeHandle(ref, () => ({ flipTo, getCurrentCode }), [flipTo, getCurrentCode]);
      const char = codeToChar(initialCode);

      return (
        <div className={styles.tile} data-row={row} data-col={col}>
          <div className={styles.topHalf}>
            <div className={styles.charDisplay} ref={topHalfCharRef}>{char}</div>
          </div>
          <div className={styles.bottomHalf}>
            <div className={styles.charDisplay} ref={bottomHalfCharRef}>{char}</div>
          </div>
          <div className={styles.flapFront} ref={flapFrontRef}>
            <div className={styles.charDisplay} ref={flapFrontCharRef}>{char}</div>
          </div>
          <div className={styles.flapBack} ref={flapBackRef}>
            <div className={styles.charDisplay} ref={flapBackCharRef}>{char}</div>
          </div>
        </div>
      );
    }
  )
);

SplitFlapTile.displayName = "SplitFlapTile";
export default SplitFlapTile;