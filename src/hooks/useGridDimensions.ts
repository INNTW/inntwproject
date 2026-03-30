"use client";

import { useState, useEffect, useCallback } from "react";
import { BOARD_COLS, BOARD_ROWS } from "@/lib/vestaboard/layout";

const MAX_TILE_WIDTH = 72;
const TILE_ASPECT = 64 / 48;
const MAX_GAP = 3;
const MIN_GAP = 1;
const VERTICAL_PADDING = 48;

/**
 * Dynamically calculates tile size based on viewport width.
 *
 * SIZING COLUMNS — controls the "zoom level" (how big tiles appear):
 *   - Mobile     (<640px):  18 cols — inner content fills the screen
 *   - Tablet     (<1024px): 20 cols — 1 extra col each side of content
 *   - Laptop     (<1600px): 22 cols — full active area visible
 *   - Ultra-wide (≥1600px): 24 cols — extra breathing room
 *
 * GRID — always has enough columns/rows to overflow the viewport in all
 * directions, with at least 2 dormant columns on each side of the active
 * area. The active 22 columns are always perfectly centered.
 */
export function useGridDimensions() {
  const [dims, setDims] = useState({
    cols: 26,
    rows: 6,
    tileWidth: 48,
    tileHeight: 64,
    tileGap: MAX_GAP,
  });

  const calculate = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // --- SIZING COLUMNS (controls zoom level) ---
    let sizingCols: number;
    if (vw < 640) {
      sizingCols = 18;
    } else if (vw < 1024) {
      sizingCols = 20;
    } else if (vw < 1600) {
      sizingCols = 22;
    } else {
      sizingCols = 24;
    }

    // --- DETERMINE GAP ---
    // Try MAX_GAP first; if tiles would be tiny, use MIN_GAP
    let gap = MAX_GAP;
    let widthFit = Math.floor((vw - (sizingCols - 1) * gap) / sizingCols);
    if (widthFit < 20) {
      gap = MIN_GAP;
      widthFit = Math.floor((vw - (sizingCols - 1) * gap) / sizingCols);
    }

    // --- HEIGHT CONSTRAINT ---
    const availableHeight = vh * 0.5 - VERTICAL_PADDING * 2;
    const heightFitTileH = Math.floor(
      (availableHeight - (BOARD_ROWS - 1) * gap) / BOARD_ROWS
    );
    const heightFit = Math.floor(heightFitTileH / TILE_ASPECT);

    // Tighter of width/height, capped at max
    const tileWidth = Math.max(10, Math.min(MAX_TILE_WIDTH, widthFit, heightFit));
    const tileHeight = Math.round(tileWidth * TILE_ASPECT);
    // IMPORTANT: use the same gap that was used in the width calculation
    const tileGap = gap;

    // Font & radius scale proportionally
    const fontSize = Math.max(6, Math.round(tileWidth * 0.625));
    const radius = tileWidth >= 30 ? 3 : tileWidth >= 20 ? 2 : 1;

    // Write CSS custom properties
    const root = document.documentElement;
    root.style.setProperty("--tile-width", `${tileWidth}px`);
    root.style.setProperty("--tile-height", `${tileHeight}px`);
    root.style.setProperty("--tile-gap", `${tileGap}px`);
    root.style.setProperty("--tile-font-size", `${fontSize}px`);
    root.style.setProperty("--tile-radius", `${radius}px`);

    // --- GRID DIMENSIONS ---
    // Must cover the full viewport AND have room for the 22-col active area
    // with at least 2 dormant columns on each side (minimum 26 cols)
    const cellSize = tileWidth + tileGap;
    let cols = Math.max(BOARD_COLS + 4, Math.ceil(vw / cellSize) + 2);
    // Ensure (cols - BOARD_COLS) is even so active area is perfectly centered
    if ((cols - BOARD_COLS) % 2 !== 0) cols++;

    const rows = Math.ceil(vh / (tileHeight + tileGap)) + 2;

    setDims({ cols, rows, tileWidth, tileHeight, tileGap });
  }, []);

  useEffect(() => {
    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, [calculate]);

  return dims;
}
