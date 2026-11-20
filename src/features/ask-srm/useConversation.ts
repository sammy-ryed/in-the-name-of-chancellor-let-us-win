"use client";

import { useEffect, useRef, useState } from "react";
import { chatLimits, type Source, type SearchResponse } from "./types";

export type PageContext = { page: string; compare?: string };

export function pageContext(path: string, compare: string | null): PageContext {
  const page = path.split(/[?#]/, 1)[0];
  if (page !== "/programmes/compare" || compare === null || compare.length > 35) return { page };
  const ids = compare.split(",");
  if (ids.length > 3 || ids.some(id => id && !/^[a-f0-9]{11}$/.test(id))) return { page };
  return { page, compare };
}

export type Turn = {
  context: PageContext;
  id: number;
  question: string;
  result?: SearchResponse;
  problem?: "stopped" | "failed";
  pages?: Source[];
  pagesFailed?: boolean;
};

export function answerText(result: SearchResponse) {
  return result.answer?.trim() ||
    (result.kind === "guide" ? result.sources[0]?.summary : "") ||
    "This detail isn't covered in the SRM guide.";
}

function historyOf(turns: Turn[]) {
  return turns.slice(-Math.floor(chatLimits.history / 2)).flatMap(turn => {
    if (!turn.result) return [];
    return [
      { role: "user", content: turn.question },
      { role: "assistant", content: answerText(turn.result).slice(0, chatLimits.answer) },
    ];
  });
}

async function queryGuide(query: string, mode: "ask" | "search", turns: Turn[], context: PageContext, signal: AbortSignal) {
  const response = await fetch("/api/ask-srm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, mode, history: historyOf(turns), ...context }),
    signal,
  });
  if (!response.ok) throw new Error("Search unavailable");
  return await response.json() as SearchResponse;
}

export function useConversation(page: PageContext) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const active = useRef<{ overview: AbortController; pages: AbortController } | null>(null);
  const sequence = useRef(0);

  function cancelRequests() {
    active.current?.overview.abort();
    active.current?.pages.abort();
  }
  useEffect(() => cancelRequests, []);

  function send(query: string, mode: "new" | "follow-up" | "retry", match?: Pick<SearchResponse, "sources" | "resolved">) {
    const text = query.trim();
    if (text.length < 2 || text.length > chatLimits.question) return;
    cancelRequests();

    const past = mode === "new" ? [] : mode === "retry" ? turns.slice(0, -1) : turns;
    const context = mode === "new" ? page : turns.at(-1)?.context ?? page;
    const id = ++sequence.current;
    const cachedPages = match?.sources;
    if (mode === "new" && match?.resolved) {
      // Only explicit submission promotes a matching guide preview into an answer.
      // No provider request is needed for an answer already resolved by the guide.
      active.current = null;
      setTurns([{ id, question: text, context, pages: cachedPages, result: { ...match.resolved, sources: match.sources } }]);
      return;
    }
    const overview = new AbortController();
    const pages = new AbortController();
    active.current = { overview, pages };
    setTurns([...past, { id, question: text, context, pages: cachedPages }]);

    function update(changes: Partial<Turn>) {
      setTurns(current => current.map(turn => turn.id === id ? { ...turn, ...changes } : turn));
    }

    // Page results can be read or opened while the AI overview is still being prepared.
    if (!cachedPages) {
      void queryGuide(text, "search", past, context, pages.signal)
        .then(result => { if (!pages.signal.aborted) update({ pages: result.sources }); })
        .catch(() => { if (!pages.signal.aborted) update({ pagesFailed: true }); });
    }
    void queryGuide(text, "ask", past, context, overview.signal)
      .then(result => { if (!overview.signal.aborted) update({ result }); })
      .catch(() => { if (!overview.signal.aborted) update({ problem: "failed" }); });
  }

  function stop() {
    active.current?.overview.abort();
    setTurns(current => current.map(turn =>
      !turn.result && !turn.problem ? { ...turn, problem: "stopped" } : turn));
  }

  function reset() {
    cancelRequests();
    setTurns([]);
  }

  return { turns, send, stop, reset };
}

type Matches = PageContext & { query: string; topic?: number; result?: SearchResponse; failed?: true };

export function usePageMatches(query: string, active: boolean, turns: Turn[], context: PageContext) {
  const [matches, setMatches] = useState<Matches | null>(null);
  const value = query.trim();
  const topic = turns.at(-1)?.id;
  const { page, compare } = context;
  useEffect(() => {
    if (!active || value.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const result = await queryGuide(value, "search", turns, { page, compare }, controller.signal);
        if (!controller.signal.aborted) setMatches({ query: value, topic, page, compare, result });
      } catch {
        if (!controller.signal.aborted) setMatches({ query: value, topic, page, compare, failed: true });
      }
    }, 180);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, active, topic, turns, page, compare]);
  return active && value === matches?.query && topic === matches.topic && page === matches.page && compare === matches.compare ? matches : null;
}
