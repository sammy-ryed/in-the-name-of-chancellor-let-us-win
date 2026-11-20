"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { SrmCrest } from "@/components/HomeLogo";
import { navigation, routes } from "@/lib/navigation";
import { Icon } from "./Icons";
import { PageResults, SearchResults } from "./SearchResults";
import { feeAction } from "./feeAction";
import { promptsFor } from "./prompts";
import { chatLimits } from "./types";
import { pageContext, useConversation, usePageMatches, type PageContext, type Turn } from "./useConversation";
import { useKeyboardInset } from "./useKeyboardInset";
import "./panel.css";

const noContext: Turn[] = [];
const defaultShortcuts = [
  routes.programmes, routes.finder, routes.compare,
  { href: routes.students.href, label: "Student services" },
];

type PanelProps = { path: string; open: boolean; onClose: () => void; onNavigate: () => void };

export function SearchPanel(props: PanelProps) {
  const searchParams = useSearchParams();
  const context = pageContext(props.path, searchParams.get("compare"));
  const conversation = useConversation(context);
  // A newly opened page gets its own draft and page suggestions. The student
  // can still continue the previous conversation with its original context.
  return <SearchDialog key={JSON.stringify([context.page, context.compare])} {...props} conversation={conversation} context={context} />;
}

function SearchDialog({ path, open, onClose, onNavigate, conversation, context }: PanelProps & {
  conversation: ReturnType<typeof useConversation>; context: PageContext;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");
  const [reading, setReading] = useState(false);
  const resumeAtReply = useRef(false);
  const { turns, send, stop, reset } = conversation;
  const last = turns.at(-1);
  const query = draft.trim();
  const showResults = reading && !!last;
  const typing = !showResults && query.length >= 2;
  const matches = usePageMatches(query, open && typing, noContext, context);
  const area = navigation.find(item => item.href !== "/" && (item.href === path || path.startsWith(item.href + "/")));
  const shortcuts = (area?.children?.filter(item => item.href !== path && item.href.startsWith("/")).slice(0, 3) ?? defaultShortcuts);
  useKeyboardInset(dialog, open);

  useLayoutEffect(() => {
    if (!open || !dialog.current) return;
    if (!dialog.current.open) dialog.current.showModal();
    if (!showResults) {
      input.current?.focus({ preventScroll: true });
    } else if (resumeAtReply.current) {
      resumeAtReply.current = false;
      dialog.current.querySelector<HTMLTextAreaElement>(".ask-followup-form textarea")?.focus();
    } else {
      dialog.current.querySelector<HTMLElement>(".ask-overview-title")?.focus({ preventScroll: true });
    }
  }, [open, showResults, last?.id]);
  useEffect(() => {
    const back = () => dialog.current?.close();
    window.addEventListener("popstate", back);
    return () => window.removeEventListener("popstate", back);
  }, []);
  useLayoutEffect(() => {
    if (scroller.current && !scroller.current.querySelector(".ask-followup-form :focus")) scroller.current.scrollTop = 0;
  }, [last?.id, typing, showResults]);

  function close() { dialog.current?.close(); }
  function pickPage() {
    close();
    onNavigate();
  }
  function submit(value: string) {
    const text = value.trim();
    if (text.length < 2) return;
    send(text, "new", matches?.query === text ? matches.result : undefined);
    setReading(true);
  }
  function clear() {
    reset();
    setDraft("");
    input.current?.focus();
  }
  function newSearch() {
    setDraft("");
    setReading(false);
  }
  function resume() {
    resumeAtReply.current = true;
    setReading(true);
  }
  function keyboard(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.nativeEvent.isComposing || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) return;
    const items = [input.current, ...Array.from(
      scroller.current?.querySelectorAll<HTMLElement>("[data-ask-page], [data-ask-suggestion]") ?? []
    ).filter(element => element.getClientRects().length > 0)];
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
          {showResults && <button type="button" className="ask-new-search" onClick={newSearch}><Icon name="search" />New search</button>}
          <button type="button" className="ask-close" aria-label="Close search" onClick={close}><Icon name="close" /></button>
        </div>
        {!showResults && <form className="ask-search-field" role="search" aria-label="University search"
          onSubmit={event => { event.preventDefault(); submit(draft); }}>
          <Icon name="search" />
          <input ref={input} type="text" inputMode="search" enterKeyHint="search" aria-label="Search SRM"
            placeholder="Ask a question or find a page…"
            maxLength={chatLimits.question} autoComplete="off" value={draft} onChange={event => setDraft(event.target.value)} />
          {!!draft && <button type="button" className="ask-clear" aria-label="Clear search" onClick={clear}><Icon name="close" /></button>}
          <button className="ask-submit" type="submit" aria-label="Ask SRM" disabled={query.length < 2}>
            <span>Ask</span><Icon name="arrow" />
          </button>
        </form>}
      </header>
      <div ref={scroller} className="ask-scroll">
        {typing ? (
          <>
            <button type="button" className="ask-query-action" data-ask-suggestion onClick={() => submit(query)}>
              <span>Ask SRM</span><strong>{query}</strong><Icon name="arrow" />
            </button>
            <PageResults pages={matches?.result?.sources ?? []} pending={!matches} failed={matches?.failed} onPick={pickPage} />
          </>
        ) : showResults ? (
          <SearchResults key={last.id} turn={last} earlier={turns.slice(0, -1)} pages={last.pages ?? []} pagesPending={!last.pages && !last.pagesFailed}
            pagesFailed={last.pagesFailed} onRetry={() => send(last.question, "retry", last.pages ? { sources: last.pages } : undefined)}
            onStop={stop} onFollowUp={question => send(question, "follow-up")} onPick={pickPage} comparison={feeAction(turns)} />
        ) : (
          <div className="ask-start">
            {last?.result && <button type="button" className="ask-continue" data-ask-suggestion onClick={resume}>
              <span>Continue your last question</span><strong>{last.question}</strong><Icon name="arrow" />
            </button>}
            <h3>Suggested searches</h3>
            <div className="ask-suggestions">
              {promptsFor(path).map(item => (
                <button key={item.question} type="button" data-ask-suggestion onClick={() => submit(item.question)}>
                  <Icon name="search" /><span>{item.question}</span><small>{item.section}</small><span aria-hidden="true" className="ask-insert">↗</span>
                </button>
              ))}
            </div>
            <nav className="ask-shortcuts" aria-label="Quick links">
              {shortcuts.map(item => <Link key={item.href} href={item.href} prefetch={false} onNavigate={pickPage}>{item.label} <span aria-hidden="true">→</span></Link>)}
            </nav>
            <p className="ask-privacy">AI overviews use Groq. Please leave out personal details.</p>
          </div>
        )}
      </div>
    </dialog>
  );
}
