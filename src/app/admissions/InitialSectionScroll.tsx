"use client";

import { useEffect } from "react";

export function InitialSectionScroll() {
  useEffect(() => {
    // With a streamed page the browser can look for the fragment before it exists.
    const section = document.getElementById(window.location.hash.slice(1));
    if (!section) return;
    const frame = requestAnimationFrame(() => {
      if (window.scrollY === 0) section.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return null;
}
