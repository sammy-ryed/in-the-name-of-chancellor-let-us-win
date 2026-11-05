import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import s from "./research.module.css";

export function ResearchHero() {
  return (
    <header id="overview" className={s.hero}>
      <div className={s.heroCopy}>
        <Breadcrumbs className={s.crumbs} parents={[{ href: "/", label: "Home" }]} current="Research" />
        <h1>Research <em>at SRMIST.</em></h1>
        <p className={s.heroIntro}>From electric mobility to gene editing, step inside the labs and projects where our researchers work.</p>
        <div className={s.heroActions}>
          <a className={s.button} href="#projects">Explore funded projects <span aria-hidden="true">↓</span></a>
          <a className={s.textLink} href="#centres">Find a centre <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <div className={s.heroPhoto}>
        <Image src="/research/laboratory.webp" alt="A researcher at a microscope in an SRMIST laboratory" fill preload sizes="(max-width: 720px) 100vw, 50vw" />
      </div>
    </header>
  );
}
