"use client";

import { useEffect, useState } from "react";
import { Compass } from "./Compass";
import styles from "./wayfinding.module.css";

export default function RouteLoading({ pathname }: { pathname: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let showTimer: number | undefined;
    let expiryTimer: number | undefined;
    function clearTimers() {
      window.clearTimeout(showTimer);
      window.clearTimeout(expiryTimer);
    }
    function dismiss() {
      clearTimers();
      setVisible(false);
    }
    function start(event: Event) {
      dismiss();
      if ((event as CustomEvent<string>).detail === pathname) return;
      // Cached pages, filters and same-page anchors should stay visually immediate.
      showTimer = window.setTimeout(() => setVisible(true), 240);
      // Next also reports starts that can be interrupted before a commit.
      expiryTimer = window.setTimeout(dismiss, 12000);
    }

    window.addEventListener("srm-route-start", start);
    window.addEventListener("hashchange", dismiss);
    window.addEventListener("pageshow", dismiss);
    window.addEventListener("pagehide", dismiss);
    return () => {
      clearTimers();
      window.removeEventListener("srm-route-start", start);
      window.removeEventListener("hashchange", dismiss);
      window.removeEventListener("pageshow", dismiss);
      window.removeEventListener("pagehide", dismiss);
    };
  }, [pathname]);

  return visible ? (
    <div className={styles.loading} role="status">
      <div className={styles.instrument} aria-hidden="true"><Compass /></div>
      <p>Loading page<span aria-hidden="true">…</span></p>
    </div>
  ) : null;
}
