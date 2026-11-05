"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { promptsFor } from "./prompts";
import { Icon } from "./Icons";
import type { SearchResponse, Source } from "./types";

function ResultLink({
  source,
  onPick,
  preview,
}: {
  source: Source;
  preview: boolean;
  onPick: () => void;
}) {
  const content = (
    <>
      <span className="ask-result-text">
        <small>{source.section}</small>
        <strong>{source.title}</strong>
        {preview && <span className="ask-excerpt">{source.summary}</span>}
      </span>
      <span className="ask-out" aria-hidden="true">
        {source.href.startsWith("/") ? "→" : "↗"}
      </span>
    </>
  );
  return source.href.startsWith("/") ? (
    <Link
      className="ask-row"
      data-ask-row
      href={source.href}
      prefetch={false}
      onClick={onPick}
    >
      {content}
    </Link>
  ) : (
    <a className="ask-row" data-ask-row href={source.href} onClick={onPick}>
      {content}
    </a>
  );
}

type Phase = "idle" | "searching" | "asking" | "done" | "error";

export function SearchPanel({
  path,
  onClose,
}: {
  path: string;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const pending = useRef<AbortController | null>(null);
  const debounce = useRef<number | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [previous, setPrevious] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<SearchResponse>({
    kind: "matches",
    sources: [],
  });
  const close = () => dialog.current?.close();

  useLayoutEffect(() => {
    const panel = dialog.current;
    if (!panel?.open) panel?.showModal();
    input.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    const back = () => dialog.current?.close();
    window.addEventListener("popstate", back);
    return () => {
      clearTimeout(debounce.current);
      pending.current?.abort();
      window.removeEventListener("popstate", back);
    };
  }, []);

  function cancel() {
    clearTimeout(debounce.current);
    pending.current?.abort();
  }
  async function request(
    value: string,
    mode: "search" | "ask",
    context: string,
  ) {
    cancel();
    const controller = new AbortController();
    pending.current = controller;
    setPhase(mode === "ask" ? "asking" : "searching");
    try {
      const response = await fetch("/api/ask-srm", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value, mode, previous: context }),
      });
      if (!response.ok) throw new Error("Search unavailable");
      const payload: SearchResponse = await response.json();
      if (controller.signal.aborted) return;
      setResult(payload);
      setPhase(mode === "ask" ? "done" : "idle");
    } catch {
      if (!controller.signal.aborted) setPhase("error");
    }
  }
  function type(value: string, context = previous) {
    cancel();
    setQuery(value);
    setResult({ kind: "matches", sources: [] });
    if (value.trim().length < 2) {
      setPhase("idle");
      return;
    }
    setPhase("searching");
    debounce.current = window.setTimeout(
      () => void request(value.trim(), "search", context),
      180,
    );
  }
  function ask(value: string) {
    const text = value.trim();
    if (text.length < 2) return;
    setQuery(text);
    void request(text, "ask", previous);
  }
  function followUp() {
    setPrevious([previous, query].filter(Boolean).join(" — ").slice(-300));
    type("");
    input.current?.focus();
  }
  function move(e: KeyboardEvent<HTMLElement>) {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = [
      input.current,
      ...Array.from(
        dialog.current?.querySelectorAll<HTMLElement>("[data-ask-row]") ?? [],
      ),
    ];
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (index < 0 || items.length < 2) return;
    e.preventDefault();
    items[
      (index + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length
    ]?.focus();
  }

  const sources = result.sources;
  const answered = phase === "done";
  const shortQuery = query.trim().length < 2;
  const busy = phase === "asking" || phase === "searching";
  const guideExcerpt = result.kind === "guide" ? sources[0]?.summary : "";
  return (
    <dialog
      ref={dialog}
      className="ask-panel"
      aria-label="Ask SRM"
      onClose={onClose}
      onKeyDown={move}
      onClick={(event) => {
        if (event.target !== dialog.current) return;
        const bounds = dialog.current!.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          close();
      }}
    >
      <div className="ask-mast">
        <h2 className="ask-brand">
          Ask <span>SRM</span>
        </h2>
      </div>
      <button
        className="ask-close"
        aria-label="Close search"
        type="button"
        onClick={close}
      >
        <Icon name="close" />
      </button>

      <div className="ask-main">
        {previous && (
          <div className="ask-context">
            <span>
              Following up on <strong>{previous}</strong>
            </span>
            <button
              type="button"
              aria-label="Start a new topic"
              onClick={() => {
                setPrevious("");
                type(query, "");
                input.current?.focus();
              }}
            >
              <Icon name="close" />
            </button>
          </div>
        )}
        <form
          role="search"
          aria-label="Ask about SRM"
          className="ask-field"
          onSubmit={(event) => {
            event.preventDefault();
            if (phase !== "asking") ask(query);
          }}
        >
          <Icon name="search" />
          <input
            ref={input}
            type="search"
            aria-label="Your SRM question"
            placeholder={
              previous ? "Ask a follow-up…" : "Search or ask a question"
            }
            value={query}
            maxLength={300}
            autoComplete="off"
            onChange={(e) => type(e.target.value)}
          />
          <button
            className="ask-send"
            type="submit"
            aria-label="Get answer"
            disabled={shortQuery || phase === "asking"}
          >
            <span>Ask</span>
            <Icon name="arrow" />
          </button>
        </form>
        <div className="ask-content">
          {shortQuery && !previous && (
            <>
              <h2 className="ask-label">Suggested searches</h2>
              <div className="ask-rows">
                {promptsFor(path).map((item) => (
                  <button
                    className="ask-row"
                    key={item.question}
                    type="button"
                    data-ask-row
                    onClick={() => ask(item.question)}
                  >
                    <span className="ask-result-text">
                      <small>{item.section}</small>
                      <strong>{item.question}</strong>
                    </span>
                    <span className="ask-out" aria-hidden="true">
                      ↗
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
          {shortQuery && previous && (
            <p className="ask-note">Ask another question about this topic.</p>
          )}
          {busy && (
            <p role="status" className="ask-status">
              <span aria-hidden="true" />
              {phase === "asking"
                ? "Looking through SRM sources…"
                : "Finding matching pages…"}
            </p>
          )}
          {phase === "error" && (
            <p role="status" className="ask-note">
              Search couldn’t connect.{" "}
              <button type="button" onClick={() => ask(query)}>
                Try again
              </button>
            </p>
          )}
          {answered && (result.answer || guideExcerpt) && (
            <section
              className="ask-answer"
              aria-label="Search answer"
              aria-live="polite"
            >
              <h2 className="ask-label">
                {result.kind === "groq" ? "Answer" : "From the SRM guide"}
              </h2>
              <p>{result.answer || guideExcerpt}</p>
              <button type="button" className="ask-follow" onClick={followUp}>
                Ask a follow-up <span aria-hidden="true">↳</span>
              </button>
            </section>
          )}
          {!busy &&
            phase !== "error" &&
            !shortQuery &&
            (result.kind === "unanswered" || !sources.length) && (
              <div className="ask-note" role="status">
                {answered
                  ? "The guide doesn’t cover that question yet."
                  : "No direct page match. Select Ask to check the university guide."}
                {answered && (
                  <div className="ask-recovery">
                    <Link href="/students" onClick={close}>
                      Student services →
                    </Link>
                    <Link href="/admissions#enquiry" onClick={close}>
                      Ask admissions →
                    </Link>
                  </div>
                )}
              </div>
            )}
          {!!sources.length && (
            <>
              <h2 className="ask-label">
                {answered
                  ? result.kind === "groq"
                    ? "Sources"
                    : "Related pages"
                  : "Matching pages"}
              </h2>
              <div className="ask-rows">
                {sources.map((source, index) => (
                  <ResultLink
                    key={source.href}
                    source={source}
                    onPick={close}
                    preview={!answered && index === 0}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
