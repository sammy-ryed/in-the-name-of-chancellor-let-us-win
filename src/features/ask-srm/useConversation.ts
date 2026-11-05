"use client";

import { useEffect, useRef, useState } from "react";
import { chatLimits, type Source, type SearchResponse } from "./types";

export type Turn = {
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

async function queryGuide(query: string, mode: "ask" | "search", turns: Turn[], signal: AbortSignal) {
  const response = await fetch("/api/ask-srm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, mode, history: historyOf(turns) }),
    signal,
  });
  if (!response.ok) throw new Error("Search unavailable");
  return await response.json() as SearchResponse;
}

export function useConversation() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const active = useRef<{ overview: AbortController; pages: AbortController } | null>(null);
  const sequence = useRef(0);

  function cancelRequests() {
    active.current?.overview.abort();
    active.current?.pages.abort();
  }
  useEffect(() => cancelRequests, []);

  function send(query: string, mode: "new" | "follow-up" | "retry", cachedPages?: Source[]) {
    const text = query.trim();
    if (text.length < 2 || text.length > chatLimits.question) return;
    cancelRequests();

    const past = mode === "new" ? [] : mode === "retry" ? turns.slice(0, -1) : turns;
    const id = ++sequence.current;
    const overview = new AbortController();
    const pages = new AbortController();
    active.current = { overview, pages };
    setTurns([...past, { id, question: text, pages: cachedPages }]);

    function update(changes: Partial<Turn>) {
      setTurns(current => current.map(turn => turn.id === id ? { ...turn, ...changes } : turn));
    }

    // Page results can be read or opened while the AI overview is still being prepared.
    if (!cachedPages) {
      void queryGuide(text, "search", past, pages.signal)
        .then(result => { if (!pages.signal.aborted) update({ pages: result.sources }); })
        .catch(() => { if (!pages.signal.aborted) update({ pagesFailed: true }); });
    }
    void queryGuide(text, "ask", past, overview.signal)
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

type Matches = { query: string; topic?: number; result?: SearchResponse; failed?: true };

export function usePageMatches(query: string, active: boolean, turns: Turn[]) {
  const [matches, setMatches] = useState<Matches | null>(null);
  const value = query.trim();
  const topic = turns.at(-1)?.id;
  useEffect(() => {
    if (!active || value.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const result = await queryGuide(value, "search", turns, controller.signal);
        if (!controller.signal.aborted) setMatches({ query: value, topic, result });
      } catch {
        if (!controller.signal.aborted) setMatches({ query: value, topic, failed: true });
      }
    }, 180);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, active, topic, turns]);
  return active && value === matches?.query && topic === matches.topic ? matches : null;
}
