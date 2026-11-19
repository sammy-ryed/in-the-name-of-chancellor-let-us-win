"use client";

import { useEffect } from "react";

export function ResponsiveScholarshipDetails() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1181px)");
    const sync = () => {
      document.querySelectorAll<HTMLDetailsElement>("details[data-responsive-scholarship]").forEach((details) => {
        details.open = desktop.matches;
      });
    };

    sync();
    desktop.addEventListener("change", sync);
    return () => desktop.removeEventListener("change", sync);
  }, []);

  return null;
}
