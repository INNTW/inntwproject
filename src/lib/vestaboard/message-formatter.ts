import { BOARD_ROWS, BOARD_COLS } from "./layout";
import { charToCode, BLANK } from "./charset";
import type { BoardState } from "@/types";

export function formatMessage(text: string): BoardState {
  const lines = text.split("\n").slice(0, BOARD_ROWS);
  const board: BoardState = [];

  for (let row = 0; row < BOARD_ROWS; row++) {
    const line = lines[row] ?? "";
    const upper = line.toUpperCase().slice(0, BOARD_COLS);
    const padding = Math.floor((BOARD_COLS - upper.length) / 2);
    const codes: number[] = [];

    for (let col = 0; col < BOARD_COLS; col++) {
      const charIdx = col - padding;
      if (charIdx >= 0 && charIdx < upper.length) {
        codes.push(charToCode(upper[charIdx]));
      } else {
        codes.push(BLANK);
      }
    }
    board.push(codes);
  }

  return board;
}
export function formatLines(lines: string[]): BoardState {
  return formatMessage(lines.join("\n"));
}

export function createEmptyBoard(): BoardState {
  return Array.from({ length: BOARD_ROWS }, () =>
    Array.from({ length: BOARD_COLS }, () => BLANK)
  );
}