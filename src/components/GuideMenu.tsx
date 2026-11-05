"use client";
import Link from "next/link";
import { useRef } from "react";
import { navigation, services } from "@/lib/navigation";
export function Menu() {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        className="guide-menubtn"
        onClick={() => ref.current?.showModal()}
        aria-label="Open menu"
      >
        Menu ☰
      </button>
      <dialog
        className="guide-dialog"
        ref={ref}
        aria-label="Site menu"
        onClick={(e) => {
          if (e.target === ref.current) ref.current.close();
        }}
      >
        <div>
          <button className="guide-close" onClick={() => ref.current?.close()}>
            Close ×
          </button>
          <nav aria-label="Main destinations">
            {navigation.map((a) => (
              <Link
                key={a.href}
                onClick={() => ref.current?.close()}
                href={a.href}
              >
                {a.label}
              </Link>
            ))}
          </nav>
          <div className="guide-utility">
            {services.map((a) => (
              <Link
                key={a.href}
                onClick={() => ref.current?.close()}
                href={a.href}
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
