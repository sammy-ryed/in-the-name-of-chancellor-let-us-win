"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function RouteContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const main = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (document.documentElement.hasAttribute("data-quiet-motion") ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only animate committed content. First paint, hash links, and filters stay immediate.
    const arrival = main.current?.animate([{ opacity: 0.82 }, { opacity: 1 }], {
      duration: 160,
      easing: "ease-out",
    });
    return () => arrival?.cancel();
  }, [pathname]);

  return <main ref={main} id="main">{children}</main>;
}
