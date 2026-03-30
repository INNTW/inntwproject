"use client";

import { useState, useEffect, useCallback } from "react";
import { BOARD_COLS, BOARD_ROWS } from "@/lib/vestaboard/layout";

// Desktop maximum tile sizes
const MAX_TILE_WIDTH = 48;
const TILE_ASPECT = 64 / 48; // height / width ratio
const MAX_GAP = 3;
const MIN_GAP = 1;

// The active area must fit between the 25% and 75% marks of the viewport
// with at least this much padding above and below it.
const VERTICAL_PADDING = 48;

/**
 * Dynamically calculates tile size so that:
 *   1) BOARD_COLS (22) active columns always fit within the viewport width
 *   2) BOARD_ROWS (6) active rows always fit between the 25% and 75%
 *      viewport marks with comfortable padding to the timer and email
 *
 * Whichever constraint is tighter wins. On large desktops tiles cap at 48x64.
 * Also writes the computed sizes to CSS custom properties.
 */
export function useGridDimensions() {
  const [dims, setDims] = useState({
    cols: 22,
    rows: 6,
    tileWidth: MAX_TILE_WIDTH,
    tileHeight: Math.round(MAX_TILE_WIDTH * TILE_ASPECT),    tileGap: MAX_GAP,
  });

  const calculate = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // --- WIDTH CONSTRAINT ---
    // 22 tiles + 21 gaps must fit with 8px margin on each side
    const availableWidth = vw - 16;
    let gap = MAX_GAP;
    let widthFit = Math.floor((availableWidth - (BOARD_COLS - 1) * gap) / BOARD_COLS);
    if (widthFit < 14) {
      gap = MIN_GAP;
      widthFit = Math.floor((availableWidth - (BOARD_COLS - 1) * gap) / BOARD_COLS);
    }

    // --- HEIGHT CONSTRAINT ---
    // The active area lives between 25% and 75% of the viewport = 50% of vh
    // Subtract padding so it doesn't butt up against the timer or email
    const availableHeight = vh * 0.5 - VERTICAL_PADDING * 2;
    const heightFitTileH = Math.floor((availableHeight - (BOARD_ROWS - 1) * gap) / BOARD_ROWS);
    const heightFit = Math.floor(heightFitTileH / TILE_ASPECT);

    // Use the tighter of the two constraints, capped at desktop max
    const tileWidth = Math.max(10, Math.min(MAX_TILE_WIDTH, widthFit, heightFit));
    const tileHeight = Math.round(tileWidth * TILE_ASPECT);
    const tileGap = tileWidth < 20 ? MIN_GAP : gap;
    // Font size scales proportionally (30px at 48px tile width)
    const fontSize = Math.max(6, Math.round(tileWidth * (30 / MAX_TILE_WIDTH)));

    // Border radius scales too
    const radius = tileWidth >= 30 ? 3 : tileWidth >= 20 ? 2 : 1;

    // Write to CSS custom properties so tile.module.css picks them up
    const root = document.documentElement;
    root.style.setProperty("--tile-width", `${tileWidth}px`);
    root.style.setProperty("--tile-height", `${tileHeight}px`);
    root.style.setProperty("--tile-gap", `${tileGap}px`);
    root.style.setProperty("--tile-font-size", `${fontSize}px`);
    root.style.setProperty("--tile-radius", `${radius}px`);

    // Calculate how many tiles fill the viewport (with overflow for edge coverage)
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
