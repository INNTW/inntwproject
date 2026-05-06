"use client";

import styles from "@/styles/tile.module.css";

/**
 * A static split-flap tile — blank, no animation.
 *
 * Slimmed down to a single element rendering the resting visual: the
 * combined gradient of top + bottom halves, plus a 1px split line via
 * ::before. Visually identical to a full SplitFlapTile at rest.
 */
export default function DormantTile() {
  return <div className={styles.dormantTile} />;
}
