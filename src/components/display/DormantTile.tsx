"use client";

import styles from "@/styles/tile.module.css";

/**
 * A static split-flap tile — blank, no animation.
 * Pure visual filler for the edge-to-edge background.
 */
export default function DormantTile() {
  return (
    <div className={styles.tile}>
      <div className={styles.topHalf}>
        <div className={styles.charDisplay}>{" "}</div>
      </div>
      <div className={styles.bottomHalf}>
        <div className={styles.charDisplay}>{" "}</div>
      </div>
      <div className={styles.flapFront}>
        <div className={styles.charDisplay}>{" "}</div>
      </div>
      <div className={styles.flapBack}>
        <div className={styles.charDisplay}>{" "}</div>
      </div>
    </div>
  );
}