"use client";

import { useEffect } from "react";

export function InitialSectionScroll() {
  useEffect(() => {
    // Client-side navigation can commit the new section after the fragment was requested.
    const section = document.getElementById(window.location.hash.slice(1));
    if (!section) return;
    const frame = requestAnimationFrame(() => {
      if (window.scrollY === 0) section.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return null;
}
