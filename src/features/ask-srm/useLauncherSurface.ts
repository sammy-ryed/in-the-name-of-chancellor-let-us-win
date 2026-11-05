import { useEffect, type RefObject } from "react";

type Surface = "light" | "dark" | "media";

function surfaceUnder(button: HTMLElement, main: HTMLElement): Surface | undefined {
  // A docked mobile button extends offscreen. Sample the center of its visible part.
  const bounds = button.getBoundingClientRect();
  const x = (Math.max(0, bounds.left) + Math.min(innerWidth, bounds.right)) / 2;
  const y = (Math.max(0, bounds.top) + Math.min(innerHeight, bounds.bottom)) / 2;
  const layers = document.elementsFromPoint(x, y);
  let overPage = false;

  for (const el of layers) {
    if (!(el instanceof HTMLElement) || !main.contains(el)) continue;
    overPage = true;
    // Clipped film panes and panorama figures contain controls above the picture.
    if (el.closest('[data-search-surface="media"]')) return "media";
    if (el.matches("img, video, canvas")) {
      const box = el.getBoundingClientRect();
      if (box.width >= 100 && box.height >= 80) return "media";
    }
    // The site's surface tokens resolve to rgb() or rgba(). Transparent layers
    // expose the next painted element in the hit-test stack.
    const style = getComputedStyle(el);
    if (style.backgroundImage.includes("url(") && !style.backgroundImage.includes("data:image/svg")) return "media";
    const rgb = style.backgroundColor.match(/^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/);
    if (!rgb || (rgb[4] !== undefined && Number(rgb[4]) < 0.65)) continue;
    const brightness = Number(rgb[1]) * .213 + Number(rgb[2]) * .715 + Number(rgb[3]) * .072;
    return brightness < 145 ? "dark" : "light";
  }
  // A modal or navigation overlay may completely cover the page.
  return overPage ? "light" : undefined;
}

export function useLauncherSurface(ref: RefObject<HTMLButtonElement | null>, pathname: string) {
  useEffect(() => {
    const button = ref.current;
    const main = document.getElementById("main");
    if (!button || !main) return;

    const update = () => {
      const surface = surfaceUnder(button, main);
      if (surface && button.dataset.surface !== surface) button.dataset.surface = surface;
    };

    let pending = 0;
    let settled = 0;
    function schedule() {
      if (!pending) pending = window.setTimeout(() => { pending = 0; update(); }, 64);
    }
    function onScroll() {
      schedule();
      // The homepage's film/academics wipe briefly continues after scrolling.
      window.clearTimeout(settled);
      settled = window.setTimeout(update, 550);
    }
    function onTransition(event: TransitionEvent) {
      if (event.propertyName === "transform") schedule();
    }
    update();
    const resize = new ResizeObserver(schedule);
    resize.observe(main);
    resize.observe(button);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("srm-reading-change", schedule);
    button.addEventListener("transitionend", onTransition);
    return () => {
      resize.disconnect();
      window.clearTimeout(pending);
      window.clearTimeout(settled);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("srm-reading-change", schedule);
      button.removeEventListener("transitionend", onTransition);
    };
  }, [ref, pathname]);
}
