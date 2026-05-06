"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the page is being viewed inside Instagram's in-app
 * browser on Android. That WebView is heavily memory-constrained and
 * crashes on the heavier parts of the experience (music decode + canvas
 * particle loop + board transitions all firing at once on entry).
 *
 * On the server and on first client render, this returns false to avoid
 * hydration mismatches; the real value is set in useEffect after mount.
 */
export function useIsInstagramAndroid(): boolean {
  const [is, setIs] = useState(false);
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent || "";
    if (ua.includes("Instagram") && ua.includes("Android")) {
      setIs(true);
    }
  }, []);
  return is;
}
