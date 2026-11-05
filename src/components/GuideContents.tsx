"use client";

import { useEffect, useState } from "react";

export function GuideContents({ links }: { links: [string, string][] }) {
  const [active, setActive] = useState(links[0][1]);

  useEffect(() => {
    const sections = links.flatMap(([, id]) => {
      const section = document.getElementById(id);
      return section ? [section] : [];
    });
    let frame = 0;
    function update() {
      frame = 0;
      const top = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const passed = sections.filter(section => section.getBoundingClientRect().top <= top + 72);
      setActive((passed.at(-1) ?? sections[0])?.id ?? "");
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [links]);

  return <nav className="guide-jump" aria-label="On this page">
    <strong>On this page</strong>
    {links.map(([label, id]) => <a key={id} href={"#" + id} aria-current={active === id ? "location" : undefined}>
      {label}<span aria-hidden="true">↘</span>
    </a>)}
  </nav>;
}
