"use client";

import { useEffect } from "react";

/** Unlocks pinch-to-zoom on pages that need it (e.g. map). */
export default function UnlockZoom() {
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=5");
    }
    return () => {
      // Re-lock zoom when leaving the page
      if (viewport) {
        viewport.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1");
      }
    };
  }, []);

  return null;
}
