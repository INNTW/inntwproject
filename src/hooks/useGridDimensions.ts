"use client";

import { useState, useEffect, useCallback } from "react";
import { BOARD_COLS, BOARD_ROWS } from "@/lib/vestaboard/layout";

// Increased max now that we have fewer columns to fill the viewport
const MAX_TILE_WIDTH = 72;
const TILE_ASPECT = 64 / 48; // height / width ratio
const MAX_GAP = 3;
const MIN_GAP = 1;

// The active area must fit between the 25% and 75% marks of the viewport
const VERTICAL_PADDING = 48;

/**
 * Dynamically calculates tile size based on viewport and desired side padding.
 *
 * Side padding (dormant columns beside the active 22-col area):
 *   - Mobile  (<640px):  0 extra columns — text goes edge-to-edge
 *   - Tablet  (<1024px): 1 extra column on each side
 *   - Desktop (≥1024px): 2 extra columns on each side
 *
 * Tiles are sized so that exactly (22 + sidePad*2) columns fill the viewport
 * width, making them significantly larger than before (especially on desktop).
 * The height constraint still ensures rows fit between the timer and email.
 */
export function useGridDimensions() {
  const [dims, setDims] = useState({
    cols: 26,
    rows: 6,
    tileWidth: 48,
    tileHeight: 64,
    tileGap: MAX_GAP,
    sidePad: 2,
  });

  const calculate = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // --- DYNAMIC SIDE PADDING ---
    let sidePad: number;
    if (vw < 640) {
      sidePad = 0; // mobile: active area edge-to-edge
    } else if (vw < 1024) {
      sidePad = 1; // tablet: 1 dormant column each side
    } else {
      sidePad = 2; // desktop: 2 dormant columns each side
    }

    const visibleCols = BOARD_COLS + sidePad * 2;

    // --- WIDTH CONSTRAINT ---
    // Fit exactly visibleCols tiles across the full viewport width
    let gap = MAX_GAP;
    let widthFit = Math.floor((vw - (visibleCols - 1) * gap) / visibleCols);
    if (widthFit < 14) {
      gap = MIN_GAP;
      widthFit = Math.floor((vw - (visibleCols - 1) * gap) / visibleCols);
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

    // Horizontal: exactly visibleCols (no side overflow)
    const cols = visibleCols;
    // Vertical: overflow to fill viewport top-to-bottom
    const rows = Math.ceil(vh / (tileHeight + tileGap)) + 2;

    setDims({ cols, rows, tileWidth, tileHeight, tileGap, sidePad });
  }, []);

  useEffect(() => {
    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, [calculate]);

  return dims;
}
