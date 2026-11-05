"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { navigation, services } from "@/lib/navigation";
import { srm, tourUrl } from "./content";
export function Rail({
  scrollHref = "#explore",
  current,
}: {
  scrollHref?: string;
  current?: string;
}) {
  const panel = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
    const tick = () => setTime(fmt.format(new Date()).toUpperCase());
    tick();
    const id = window.setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!open) return;
    const before = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = before;
    };
  }, [open]);
  const logo = (
    <Image
      src="/home/srm-white.svg"
      width={600}
      height={203}
      alt="SRM Institute of Science and Technology"
      unoptimized
    />
  );
  return (
    <>
      <aside className="s-rail" aria-label="Site controls">
        <Link href="/" aria-label="SRM home">
          {logo}
        </Link>
        {current && (
          <span className="guide-spine" aria-hidden="true">
            {current}
          </span>
        )}
        <button
          ref={trigger}
          aria-label="Open menu"
          aria-controls="srm-menu"
          aria-expanded={open}
          onClick={() => {
            panel.current?.showModal();
            setOpen(true);
          }}
        >
          <i />
          <i />
        </button>
        <a className="s-rail-caption" href={scrollHref}>
          Scroll for more
        </a>
        <span className="s-progress" aria-hidden="true" />
      </aside>
      <div className="s-edge" aria-hidden="true">
        <span>{time} IST</span>
        <span>Learn. Leap. Lead.</span>
      </div>
      <dialog
        id="srm-menu"
        ref={panel}
        aria-label="Main navigation"
        className="s-menu"
        onClose={() => {
          setOpen(false);
          trigger.current?.focus({ preventScroll: true });
        }}
        onClick={(e) => {
          if (e.target === panel.current) panel.current.close();
        }}
      >
        <div className="s-menu-rail">
          {logo}
          <button
            aria-label="Close menu"
            onClick={() => panel.current?.close()}
          >
            ×
          </button>
        </div>
        <nav className="s-menu-sheet s-lines">
          {navigation.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              aria-current={a.label === current ? "page" : undefined}
              onClick={() => panel.current?.close()}
            >
              {a.label}
            </Link>
          ))}
          <div>
            <a className="yellow-action" href={tourUrl}>
              Virtual tour ↗
            </a>
            {services.map((a) => (
              <Link
                className="yellow-action"
                key={a.href}
                href={a.href}
                aria-current={a.label === current ? "page" : undefined}
                onClick={() => panel.current?.close()}
              >
                {a.label}
              </Link>
            ))}
            <a className="yellow-action" href={srm + "/contact-us/"}>
              Contact SRM ↗
            </a>
          </div>
        </nav>
      </dialog>
    </>
  );
}
