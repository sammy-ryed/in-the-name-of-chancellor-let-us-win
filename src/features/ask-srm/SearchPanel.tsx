"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { SrmCrest } from "@/components/HomeLogo";
import { routes } from "@/lib/navigation";
import { Icon } from "./Icons";
import { PageResults, SearchResults } from "./SearchResults";
import { feeAction } from "./feeAction";
import { promptsFor } from "./prompts";
import { chatLimits } from "./types";
import { useConversation, usePageMatches, type Turn } from "./useConversation";
import { useKeyboardInset } from "./useKeyboardInset";
import "./panel.css";

const noContext: Turn[] = [];
const shortcuts = [
  { href: routes.programmes.href, label: "Programmes" },
  { href: routes.fees.href, label: "Compare fees" },
  { href: routes.students.href, label: "Student services" },
];

export function SearchPanel({ path, open, onClose }: {
  path: string; open: boolean; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");
  const [refining, setRefining] = useState(false);
  const { turns, send, stop, reset } = useConversation();
  const last = turns.at(-1);
  const query = draft.trim();
  const submitted = !!last && !refining && query === last.question;
  const typing = !submitted && query.length >= 2;
  const showResults = last && (submitted || (refining && !query));
  const matches = usePageMatches(query, open && typing, refining ? turns : noContext);
  useKeyboardInset(dialog, open);

  useLayoutEffect(() => {
    if (!open || dialog.current?.open) return;
    dialog.current?.showModal();
    input.current?.focus({ preventScroll: true });
  }, [open]);
  useEffect(() => {
    const back = () => dialog.current?.close();
    window.addEventListener("popstate", back);
    return () => window.removeEventListener("popstate", back);
  }, []);
  useLayoutEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 0;
  }, [last?.id, typing]);

  function close() { dialog.current?.close(); }
  function submit(value: string) {
    const text = value.trim();
    if (text.length < 2) return;
    if (submitted && text === last?.question) {
      if (last.result || last.problem) send(text, "retry", last.pages);
    } else {
      send(text, refining ? "follow-up" : "new", matches?.query === text ? matches.result?.sources : undefined);
    }
    setDraft(text);
    setRefining(false);
    if (window.matchMedia("(pointer: coarse)").matches) input.current?.blur();
  }
  function clear() {
    reset();
    setDraft("");
    setRefining(false);
    input.current?.focus();
  }
  function followUp() {
    setDraft("");
    setRefining(true);
    input.current?.focus();
  }
  function keyboard(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.nativeEvent.isComposing || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) return;
    const items = [input.current, ...Array.from(
      scroller.current?.querySelectorAll<HTMLElement>("[data-ask-page], [data-ask-suggestion]") ?? []
    )];
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (index < 0 || items.length < 2) return;
    event.preventDefault();
    items[(index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
  }

  return (
    <dialog ref={dialog} className="ask-panel" aria-label="Search SRM" onClose={onClose} onKeyDown={keyboard}
      onClick={event => {
        if (event.target !== dialog.current) return;
        const box = event.currentTarget.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
      }}>
      <header className="ask-search-head">
        <div className="ask-brand-row">
          <SrmCrest />
          <h2>Ask SRM</h2>
          <button type="button" className="ask-close" aria-label="Close search" onClick={close}><Icon name="close" /></button>
        </div>
        <form className="ask-search-field" role="search" aria-label="University search"
          onSubmit={event => { event.preventDefault(); submit(draft); }}>
          <Icon name="search" />
          <input ref={input} type="text" inputMode="search" enterKeyHint="search" aria-label="Search SRM"
            placeholder={refining ? "Ask about this result…" : "Search courses, fees, campus life…"}
            maxLength={chatLimits.question} autoComplete="off" value={draft} onChange={event => setDraft(event.target.value)} />
          {!!draft && <button type="button" className="ask-clear" aria-label="Clear search" onClick={clear}><Icon name="close" /></button>}
          <button className="ask-submit" type="submit" aria-label="Search" disabled={query.length < 2}>
            <span>Search</span><Icon name="arrow" />
          </button>
        </form>
        {refining && last && <div className="ask-refinement">
          <span>Following up on <strong>{last.question}</strong></span>
          <button type="button" onClick={() => { setDraft(last.question); setRefining(false); input.current?.focus(); }}>Cancel</button>
        </div>}
      </header>
      <div ref={scroller} className="ask-scroll">
        {typing ? (
          <PageResults pages={matches?.result?.sources ?? []} pending={!matches} failed={matches?.failed} onPick={close} />
        ) : showResults ? (
          <SearchResults turn={last} pages={last.pages ?? []} pagesPending={!last.pages && !last.pagesFailed}
            pagesFailed={last.pagesFailed} onRetry={() => send(last.question, "retry", last.pages)}
            onStop={stop} onFollowUp={followUp} onPick={close} comparison={feeAction(turns)} />
        ) : (
          <div className="ask-start">
            <h3>Suggested searches</h3>
            <div className="ask-suggestions">
              {promptsFor(path).map(item => (
                <button key={item.question} type="button" data-ask-suggestion onClick={() => submit(item.question)}>
                  <Icon name="search" /><span>{item.question}</span><small>{item.section}</small><span aria-hidden="true" className="ask-insert">↗</span>
                </button>
              ))}
            </div>
            <nav className="ask-shortcuts" aria-label="Quick links">
              {shortcuts.map(item => <Link key={item.href} href={item.href} prefetch={false} onClick={close}>{item.label} <span aria-hidden="true">→</span></Link>)}
            </nav>
            <p className="ask-privacy">AI overviews use Groq. Please leave out personal details.</p>
          </div>
        )}
      </div>
    </dialog>
  );
}
