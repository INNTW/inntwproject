"use client";

import {
  useRef, useCallback, useImperativeHandle, forwardRef, createRef,
} from "react";
import SplitFlapRow, { type SplitFlapRowRef } from "./SplitFlapRow";
import { BOARD_ROWS, BOARD_COLS } from "@/lib/vestaboard/layout";
import { calculateFlipPath } from "@/lib/vestaboard/charset";
import type { BoardState } from "@/types";
import styles from "@/styles/board.module.css";

export interface SplitFlapBoardRef {
  transitionTo: (
    target: BoardState,
    flipSpeed?: number,
    staggerDelay?: number,
    onFlipStep?: (row: number, col: number) => void
  ) => Promise<void>;
}

interface SplitFlapBoardProps {
  initialBoard: BoardState;
}

const SplitFlapBoard = forwardRef<SplitFlapBoardRef, SplitFlapBoardProps>(
  function SplitFlapBoard({ initialBoard }, ref) {
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
    return (
      <div className={styles.boardContainer}>
        <div className={styles.board}>
          {Array.from({ length: BOARD_ROWS }, (_, row) => (
            <SplitFlapRow
              key={row}
              ref={rowRefs.current[row]}
              rowIndex={row}
              codes={initialBoard[row] ?? []}
            />
          ))}
        </div>
      </div>
    );
  }
);

SplitFlapBoard.displayName = "SplitFlapBoard";
export default SplitFlapBoard;