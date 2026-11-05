import { useLayoutEffect, type RefObject } from "react";

// Some mobile browsers shrink the visual viewport, but not a fixed dialog, for the keyboard.
export function useKeyboardInset(panel: RefObject<HTMLDialogElement | null>, open: boolean) {
  useLayoutEffect(() => {
    const viewport = window.visualViewport;
    const sheet = panel.current;
    if (!open || !viewport || !sheet) return;
    const update = () => {
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      if (viewport.scale === 1 && inset > 80) {
        sheet.style.setProperty("--ask-visible-height", Math.max(0, viewport.height - 8) + "px");
      } else {
        sheet.style.removeProperty("--ask-visible-height");
      }
    };
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      sheet.style.removeProperty("--ask-visible-height");
    };
  }, [panel, open]);
}
