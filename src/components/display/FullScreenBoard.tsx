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
 * A full-viewport split-flap board.
 * Dormant tiles fill the entire screen edge-to-edge (no black gaps).
 * The active 6x22 message area sits centered.
 * Tile SIZE is dictated by viewport breakpoints (bigger = more zoomed in),
 * while the GRID always overflows the viewport in all directions.
 */
const FullScreenBoard = forwardRef<FullScreenBoardRef, { initialBoard: BoardState }>(
  function FullScreenBoard({ initialBoard }, ref) {
    const { cols: totalCols, rows: totalRows } = useGridDimensions();

    // Center the active 6x22 area in the overflow grid
    const padTop = Math.ceil((totalRows - BOARD_ROWS) / 2);
    const padLeft = Math.floor((totalCols - BOARD_COLS) / 2);

    // Refs only for the active 6 rows
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
              for (const stepCode of flipPath) {
                onFlipStep?.(row, col);
                await tileRef.flipTo(stepCode, flipSpeed);
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

    // Build the full grid: dormant tiles everywhere, active tiles in the center
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
