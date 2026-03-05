"use client";

import { useEffect } from "react";

export default function ResetZoom() {
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1");
      requestAnimationFrame(() => {
        viewport.setAttribute("content", "width=device-width, initial-scale=1");
      });
    }
  }, []);

  return null;
}
