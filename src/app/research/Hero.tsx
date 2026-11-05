"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import s from "./research.module.css";

export function ResearchHero() {
  const reduced = useReducedMotion();
  const px = useMotionValue(24), py = useMotionValue(42);
  const x = useSpring(px, { stiffness: 65, damping: 22 });
  const y = useSpring(py, { stiffness: 65, damping: 22 });
  const background = useMotionTemplate`radial-gradient(ellipse at ${x}% ${y}%, rgba(246,209,74,.65), rgba(255,228,137,.3) 26%, transparent 58%)`;
  return <header id="overview" className={s.hero} onPointerMove={event => {
    if (reduced || event.pointerType !== "mouse" || document.documentElement.hasAttribute("data-quiet-motion")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width * 100);
    py.set((event.clientY - rect.top) / rect.height * 100);
  }} onPointerLeave={() => { px.set(24); py.set(42); }}>
    <div className={s.texture} aria-hidden="true" />
    <motion.div className={s.glow} aria-hidden="true" style={{ background: reduced ? "radial-gradient(ellipse at 24% 42%, #f6d14a70, transparent 58%)" : background }} />
    <div className={s.heroCopy}>
      <Breadcrumbs className={s.crumbs} parents={[{ href: "/", label: "Home" }]} current="Research" />
      <p className={s.eyebrow}>01 / Research & Innovation</p>
      <h1>Advancing research.<br />Creating impact.</h1>
      <p className={s.heroIntro}>Research across engineering, sciences, medicine and the spaces between.</p>
      <div className={s.heroActions}><a className={s.button} href="#centres">Explore Research Centres <span aria-hidden="true">↓</span></a><a className={s.textLink} href="#projects">View Funded Projects <span aria-hidden="true">↗</span></a></div>
    </div>
    <div className={s.heroPhoto}><Image src="/research/laboratory.webp" alt="A researcher using microscopy equipment in an SRMIST laboratory" fill priority sizes="(max-width: 700px) 100vw, 45vw" /></div>
  </header>;
}
