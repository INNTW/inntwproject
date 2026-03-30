"use client";

import { useState, useEffect, useCallback } from "react";
import { BOARD_COLS, BOARD_ROWS } from "@/lib/vestaboard/layout";

// Increased max now that fewer columns dictate tile size
const MAX_TILE_WIDTH = 72;
const TILE_ASPECT = 64 / 48; // height / width ratio
const MAX_GAP = 3;
const MIN_GAP = 1;

// The active area must fit between the 25% and 75% marks of the viewport
const VERTICAL_PADDING = 48;

/**
 * Dynamically calculates tile size based on viewport width.
 *
 * SIZING COLUMNS — how many columns dictate the tile size (zoom level):
 *   - Mobile     (<640px):  18 cols — inner content fills the screen
 *   - Tablet     (<1024px): 20 cols — 1 extra col each side of content
 *   - Laptop     (<1600px): 22 cols — 2 extra cols each side (full active area)
 *   - Ultra-wide (≥1600px): 24 cols — 3 extra cols each side
 *
 * On mobile, the active 22-col area is wider than the viewport — the outer
 * empty columns scroll off-screen while the 18 cols of text fill the screen.
 *
 * GRID — always overflows the viewport in all directions so dormant tiles
 * fill every pixel with no black gaps.
 */
export function useGridDimensions() {
  const [dims, setDims] = useState({
    cols: 24,
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
      sizingCols = 18; // mobile: inner 18 content cols = viewport width
    } else if (vw < 1024) {
      sizingCols = 20; // tablet: 1 extra col each side
    } else if (vw < 1600) {
      sizingCols = 22; // laptop: full 22-col active area fits
    } else {
      sizingCols = 24; // ultra-wide: 1 extra dormant col each side
    }

    // --- WIDTH CONSTRAINT ---
    // Size tiles so that sizingCols fill the viewport width
    let gap = MAX_GAP;
    let widthFit = Math.floor((vw - (sizingCols - 1) * gap) / sizingCols);
    if (widthFit < 14) {
      gap = MIN_GAP;
      widthFit = Math.floor((vw - (sizingCols - 1) * gap) / sizingCols);
    }

    // --- HEIGHT CONSTRAINT ---
    // 6 rows must fit between the 25% and 75% viewport marks with padding
    const availableHeight = vh * 0.5 - VERTICAL_PADDING * 2;
    const heightFitTileH = Math.floor(
      (availableHeight - (BOARD_ROWS - 1) * gap) / BOARD_ROWS
    );
    const heightFit = Math.floor(heightFitTileH / TILE_ASPECT);

    // Use the tighter constraint, capped at max
    const tileWidth = Math.max(10, Math.min(MAX_TILE_WIDTH, widthFit, heightFit));
    const tileHeight = Math.round(tileWidth * TILE_ASPECT);
    const tileGap = tileWidth < 20 ? MIN_GAP : gap;

    // Font size scales proportionally (30px at 48px tile width)
    const fontSize = Math.max(6, Math.round(tileWidth * 0.625));

    // Border radius scales too
    const radius = tileWidth >= 30 ? 3 : tileWidth >= 20 ? 2 : 1;

    // Write to CSS custom properties
    const root = document.documentElement;
    root.style.setProperty("--tile-width", `${tileWidth}px`);
    root.style.setProperty("--tile-height", `${tileHeight}px`);
    root.style.setProperty("--tile-gap", `${tileGap}px`);
    root.style.setProperty("--tile-font-size", `${fontSize}px`);
    root.style.setProperty("--tile-radius", `${radius}px`);

    // GRID: overflow viewport in both directions — no black edges ever
    const cols = Math.ceil(vw / (tileWidth + tileGap)) + 2;
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
