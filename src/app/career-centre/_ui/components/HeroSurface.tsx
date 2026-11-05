"use client";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useCareerReducedMotion } from "./Motion";
import s from "../remake.module.css";

export function HeroSurface({ children }: { children: ReactNode }) {
  const reduced = useCareerReducedMotion();
  const px = useMotionValue(24), py = useMotionValue(42);
  const x = useSpring(px, { stiffness: 65, damping: 22 });
  const y = useSpring(py, { stiffness: 65, damping: 22 });
  const background = useMotionTemplate`radial-gradient(ellipse at ${x}% ${y}%, rgba(246, 209, 74, .65) 0%, rgba(255, 228, 137, .3) 26%, transparent 58%)`;
  return <header className={s.hero} onPointerMove={event => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width * 100);
    py.set((event.clientY - rect.top) / rect.height * 100);
  }} onPointerLeave={() => { px.set(24); py.set(42); }}>
    <div className={s.texture} aria-hidden="true" />
    <motion.div className={s.heroGlow} aria-hidden="true" style={{ background: reduced ? "radial-gradient(ellipse at 24% 42%, #f6d14a70, transparent 58%)" : background }} />
    <div className={s.heroCopy}>{children}</div>
    <div className={s.heroPortrait}><Image src="/career-centre/shourya.webp" alt="Shourya at Apple" fill priority sizes="(max-width: 600px) 100vw, 44vw" /></div>
  </header>;
}

export function HeroTitle() {
  return <h1 className={s.heroTitle}>CAREER CENTRE</h1>;
}
