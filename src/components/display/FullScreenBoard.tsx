"use client";

import {
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
  createRef,
  useMemo,
} from "react";
import SplitFlapRow, { type SplitFlapRowRef } from "./SplitFlapRow";
import DormantTile from "./DormantTile";
import { BOARD_ROWS, BOARD_COLS } from "@/lib/vestaboard/layout";
import { calculateFlipPath } from "@/lib/vestaboard/charset";
import { useGridDimensions } from "@/hooks/useGridDimensions";
import type { BoardState } from "@/types";

export interface FullScreenBoardRef {
  transitionTo: (
    target: BoardState,
    flipSpeed?: number,
    staggerDelay?: number,
    onFlipStep?: (row: number, col: number) => void
  ) => Promise<void>;
}

/**
 * Deceleration curve for flip animation.
 *
 * Each flip in the sequence gets progressively slower, creating a
 * natural "winding down" effect like a real mechanical split-flap board.
 *
 * @param stepIndex   Current step (0 = first flip)
 * @param totalSteps  Total number of flips in the path
 * @param minDuration Fastest flip speed (ms) — used at the start
 * @param maxDuration Slowest flip speed (ms) — used at the end
 */
function deceleratingDuration(
  stepIndex: number,
  totalSteps: number,
  minDuration: number,
  maxDuration: number
): number {
  if (totalSteps <= 1) return maxDuration;
  // Cubic ease-out: starts fast, smoothly decelerates to final speed
  const t = stepIndex / (totalSteps - 1); // 0 → 1
  const eased = t * t * t; // cubic curve
  return minDuration + (maxDuration - minDuration) * eased;
}

const FullScreenBoard = forwardRef<FullScreenBoardRef, { initialBoard: BoardState }>(
  function FullScreenBoard({ initialBoard }, ref) {
    const { cols: totalCols, rows: totalRows } = useGridDimensions();

    const padTop = Math.ceil((totalRows - BOARD_ROWS) / 2);
    const padLeft = Math.floor((totalCols - BOARD_COLS) / 2);

    const rowRefs = useRef<React.RefObject<SplitFlapRowRef | null>[]>(
      Array.from({ length: BOARD_ROWS }, () => createRef<SplitFlapRowRef>())
    );

    const transitionTo = useCallback(
      async (
        target: BoardState,
        flipSpeed: number = 280,
        staggerDelay: number = 35,
        onFlipStep?: (row: number, col: number) => void
      ) => {
        const flipPromises: Promise<void>[] = [];

        // Deceleration parameters
        const MIN_FLIP_MS = 60;  // fastest flip (start of sequence)
        const MAX_FLIP_MS = 280; // slowest flip (final landing)

        for (let row = 0; row < BOARD_ROWS; row++) {
          for (let col = 0; col < BOARD_COLS; col++) {
            const rowRef = rowRefs.current[row]?.current;
            if (!rowRef) continue;
            const tileRef = rowRef.getTileRef(col);
            if (!tileRef) continue;

            const currentCode = tileRef.getCurrentCode();
            const targetCode = target[row]?.[col] ?? 0;

            if (currentCode === targetCode) continue;

            const flipPath = calculateFlipPath(currentCode, targetCode);
            if (flipPath.length === 0) continue;

            const linearIndex = row * BOARD_COLS + col;
            const jitter = (Math.random() - 0.5) * staggerDelay * 0.3;
            const delay = linearIndex * staggerDelay + jitter;

            const flipTile = async () => {
              await new Promise((r) => setTimeout(r, Math.max(0, delay)));
              const totalSteps = flipPath.length;
              for (let s = 0; s < totalSteps; s++) {
                onFlipStep?.(row, col);
                const duration = deceleratingDuration(
                  s,
                  totalSteps,
                  MIN_FLIP_MS,
                  MAX_FLIP_MS
                );
                await tileRef.flipTo(flipPath[s], duration);
              }
            };

            flipPromises.push(flipTile());
          }
        }

        await Promise.all(flipPromises);
      },
      []
    );

    useImperativeHandle(ref, () => ({ transitionTo }), [transitionTo]);

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${totalCols}, var(--tile-width))`,
          gridTemplateRows: `repeat(${totalRows}, var(--tile-height))`,
          gap: "var(--tile-gap)",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#000",
        }}
      >
        {Array.from({ length: totalRows }, (_, r) => {
          const activeRowIndex = r - padTop;
          const isActiveRow = activeRowIndex >= 0 && activeRowIndex < BOARD_ROWS;

          return Array.from({ length: totalCols }, (_, c) => {
            const activeColIndex = c - padLeft;
            const isActiveCol = activeColIndex >= 0 && activeColIndex < BOARD_COLS;

            if (isActiveRow && isActiveCol) {
              if (activeColIndex === 0) {
                return (
                  <SplitFlapRow
                    key={`active-${activeRowIndex}`}
                    ref={rowRefs.current[activeRowIndex]}
                    rowIndex={activeRowIndex}
                    codes={initialBoard[activeRowIndex] ?? []}
                  />
                );
              }
              return null;
            }

            return <DormantTile key={`d-${r}-${c}`} />;
          });
        })}
      </div>
    );
  }
);

FullScreenBoard.displayName = "FullScreenBoard";

export default FullScreenBoard;
