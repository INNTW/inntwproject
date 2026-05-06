"use client";

import ReactDOM from "react-dom";

/**
 * Pre-fetch the background music so the bytes are in the HTTP cache by
 * the time the user taps "enter". We do NOT decode here — Web Audio
 * decodes lazily on tap to keep memory pressure off Instagram's Android
 * WebView.
 *
 * Implemented via React 19's ReactDOM.preload() rather than a manual
 * <link> tag in <head> — manual <head> elements in the layout collide
 * with Next.js's metadata API and React 19's metadata hoisting, which
 * causes head links (incl. apple-touch-icon) to thrash on re-renders.
 */
export default function AudioPreload() {
  ReactDOM.preload("/angie-loop.mp3", {
    as: "fetch",
    type: "audio/mpeg",
  });
  return null;
}
