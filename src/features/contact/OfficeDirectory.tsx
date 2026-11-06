"use client";

import { useEffect, useState } from "react";
import { ContactLinks } from "./ContactLinks";
import { contactGroups, contactOffices } from "./directory";
import styles from "@/app/contact/contact.module.css";

const all = "All offices";
function words(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function OfficeDirectory() {
  const [group, setGroup] = useState<string>(all);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function revealLinkedOffice() {
      const id = window.location.hash.slice(1);
      if (!contactOffices.some(office => office.id === id)) return;
      setGroup(all);
      setQuery("");
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    }
    window.addEventListener("hashchange", revealLinkedOffice);
    return () => window.removeEventListener("hashchange", revealLinkedOffice);
  }, []);

  function clearOfficeAnchor() {
    if (contactOffices.some(office => "#" + office.id === window.location.hash)) {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    }
  }

  const terms = words(query).split(" ").filter(Boolean).map(term => term.length > 3 ? term.replace(/s$/, "") : term);
  const visible = contactOffices.filter(office => {
    if (group !== all && office.group !== group) return false;
    const text = words([office.id, office.name, office.group, office.description, office.email, office.phone?.label, office.phone?.href].filter(Boolean).join(" "));
    return terms.every(term => text.includes(term));
  });

  return (
    <section id="directory" aria-labelledby="directory-title" className={styles.directory}>
      <div className={styles.wrap}>
        <div className={styles.directoryHead}>
          <h2 id="directory-title">Office directory<span>.</span></h2>
          <div className={styles.search}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>
            <input type="search" aria-label="Search the office directory" placeholder="Search by office or topic" value={query}
              onChange={event => { clearOfficeAnchor(); setQuery(event.target.value); }} />
          </div>
        </div>
        <div className={styles.groups} role="group" aria-label="Filter offices">
          {[all, ...contactGroups].map(label => (
            <button key={label} type="button" aria-pressed={group === label} onClick={() => {
              clearOfficeAnchor();
              setGroup(label);
            }}>{label}</button>
          ))}
        </div>
        <p className={styles.srOnly} role="status">{visible.length} {visible.length === 1 ? "office" : "offices"} shown</p>
        {visible.length ? <ul className={styles.officeList}>
          {visible.map(office => (
            <li key={office.id} id={office.id} className={styles.office}>
              <div>
                <h3>{office.name}</h3>
                <p>{office.description}</p>
              </div>
              <div className={styles.officeWays}>
                <ContactLinks phone={office.phone} email={office.email} />
                <a className={styles.source} href={office.source.href}>{office.source.label} <span aria-hidden="true">↗</span></a>
              </div>
            </li>
          ))}
        </ul> : <div className={styles.empty}>
          <p>No offices match this search.</p>
          <button type="button" onClick={() => { setQuery(""); setGroup(all); }}>Show all offices <span aria-hidden="true">→</span></button>
        </div>}
      </div>
    </section>
  );
}
