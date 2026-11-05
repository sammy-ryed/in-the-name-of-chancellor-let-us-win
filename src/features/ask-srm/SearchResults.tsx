import Link from "next/link";
import { useId, useRef } from "react";
import { ReplyText } from "./ReplyText";
import { answerText, type Turn } from "./useConversation";
import type { Source } from "./types";
import "./results.css";

function uniquePages(pages: Source[]) {
  const seen = new Set<string>();
  return pages.filter(({ href }) => {
    if (!href || seen.has(href)) return false;
    seen.add(href);
    return true;
  });
}

function PageResult({ source, cited, onPick }: { source: Source; cited: boolean; onPick: () => void }) {
  const internal = source.href.startsWith("/") && !source.href.startsWith("//");
  const snippet = source.summary.startsWith(source.title + ". ")
    ? source.summary.slice(source.title.length + 2) : source.summary;
  const content = <>
    <span className="ask-result-section">{source.section}</span>
    <span className="ask-result-title">{source.title} <span className="ask-result-arrow" aria-hidden="true">{internal ? "→" : "↗"}</span></span>
  </>;
  return (
    <li className="ask-page-result" data-cited={cited || undefined}>
      {internal ? (
        <Link className="ask-result-link" data-ask-page href={source.href} prefetch={false} onClick={onPick}>{content}</Link>
      ) : (
        <a className="ask-result-link" data-ask-page href={source.href} target="_blank" rel="noopener noreferrer">
          {content}<span className="ask-sr"> (opens in a new tab)</span>
        </a>
      )}
      {cited && <span className="ask-result-citation">Overview source</span>}
      {snippet && <p className="ask-result-summary">{snippet}</p>}
    </li>
  );
}

type PageResultsProps = {
  pages: Source[];
  pending: boolean;
  failed?: boolean;
  onPick: () => void;
  cited?: Set<string>;
};

export function PageResults({ pages, pending, failed, onPick, cited }: PageResultsProps) {
  const heading = useId();
  const items = uniquePages(pages);
  let status = "No matching pages. Try a programme, campus or service name.";
  if (pending) status = "Finding matching pages…";
  else if (failed) status = "Page search is unavailable. Try your search again.";
  return (
    <section className="ask-page-results" aria-labelledby={heading}>
      <h3 id={heading} className="ask-results-heading">Matching pages</h3>
      {items.length ? (
        <ol className="ask-page-list" role="list">
          {items.map(source =>
            <PageResult key={source.href} source={source} onPick={onPick} cited={!!cited?.has(source.href)} />
          )}
        </ol>
      ) : <p role="status" className="ask-result-status">{status}</p>}
    </section>
  );
}

type SearchResultsProps = {
  turn: Turn;
  pages: Source[];
  pagesPending: boolean;
  pagesFailed?: boolean;
  comparison?: string;
  onRetry: () => void;
  onStop: () => void;
  onFollowUp: () => void;
  onPick: () => void;
};

export function SearchResults({ turn, pages, pagesPending, pagesFailed, comparison, onRetry, onStop, onFollowUp, onPick }: SearchResultsProps) {
  const heading = useId();
  const root = useRef<HTMLDivElement>(null);
  const { result, problem } = turn;
  const pending = !result && !problem;
  const fallback = result?.kind === "guide";
  const headingText = fallback ? "From the SRM guide"
    : result?.kind === "reply" || result?.kind === "unanswered" ? "Search guidance" : "AI overview";
  const text = result && answerText(result);
  const evidence = result?.kind === "groq" ? result.sources : [];
  const cited = new Set(evidence.map(source => source.href));
  // A citation may come from a second model lookup. Include that destination once,
  // alongside ranked matches, using the exact supporting excerpt.
  const byHref = new Map(evidence.map(source => [source.href, source]));
  const ranked = [...pages.map(page => byHref.get(page.href) ?? page), ...(result?.sources ?? [])];
  const showPages = ranked.length > 0 || pagesPending || pagesFailed;
  const hasComparison = comparison && !ranked.some(source => source.href === comparison);

  function focusFirstSource() {
    root.current?.querySelector<HTMLAnchorElement>("[data-cited] [data-ask-page]")?.focus();
  }

  return (
    <div ref={root} className="ask-search-results">
      <p className="ask-sr" role="status" aria-atomic="true">{result ? headingText + " ready." : ""}</p>
      <section className="ask-overview" aria-labelledby={heading}>
        <div className="ask-overview-head">
          <h3 className="ask-overview-title" id={heading}>{headingText}</h3>
          {cited.size > 0 && <button className="ask-source-jump" type="button" onClick={focusFirstSource}>
            {cited.size} {cited.size === 1 ? "source" : "sources"} <span aria-hidden="true">↓</span>
          </button>}
        </div>
        {text ? <ReplyText text={text} /> : pending ? (
          <div className="ask-overview-state"><span role="status">Looking through SRM guides…</span>
            <button type="button" onClick={onStop}>Stop</button>
          </div>
        ) : (
          <div className="ask-overview-state"><span role="status">{problem === "stopped" ? "Overview stopped." : "The overview couldn’t load."}</span>
            <button type="button" onClick={onRetry}>Try again</button>
          </div>
        )}
        {result && (
          <div className="ask-overview-actions">
            <button type="button" onClick={onFollowUp}>Ask a follow-up <span aria-hidden="true">↳</span></button>
            {hasComparison && <Link href={comparison} prefetch={false} onClick={onPick}>Compare these fees <span aria-hidden="true">→</span></Link>}
          </div>
        )}
      </section>
      {showPages && <PageResults pages={ranked} pending={pagesPending} failed={pagesFailed} onPick={onPick} cited={cited} />}
    </div>
  );
}
