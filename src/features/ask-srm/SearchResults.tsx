import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useId, useState, type ReactNode } from "react";
import { Icon } from "./Icons";
import { parseShortlist } from "@/features/explore/shortlist";
import { ReplyText } from "./ReplyText";
import { answerText, type Turn } from "./useConversation";
import { chatLimits, type Source } from "./types";
import "./results.css";

function uniquePages(pages: Source[]) {
  const seen = new Set<string>();
  return pages.filter(({ href }) => {
    if (!href || seen.has(href)) return false;
    seen.add(href);
    return true;
  });
}

function GuideLink({ href, className, children, onPick }: { href: string; className: string; children: ReactNode; onPick: () => void }) {
  const path = usePathname();
  const current = useSearchParams();
  let destination = href;
  let stay = false;
  // Public answer sources use portable URLs. Keep a student's working shortlist
  // and table view when they open the same comparison or one of its degrees.
  if (path === "/programmes/compare" && href.startsWith("/programmes/")) {
    const target = new URL(href, "https://local.invalid");
    const selected = parseShortlist(current.get("compare") ?? "");
    const picks = target.searchParams.get("compare");
    if (target.pathname === path && (!target.search || (picks !== null && target.searchParams.size === 1 && parseShortlist(picks).every((id, i) => id === selected[i])))) {
      const query = current.toString();
      destination = path + (query ? "?" + query : "") + target.hash;
      stay = !target.hash;
    } else if (!target.search && selected.some(id => id && target.pathname === "/programmes/" + id)) {
      const detail = new URLSearchParams();
      for (const key of ["compare", "from", "family", "subject", "view"]) {
        const value = current.get(key);
        if (value !== null) detail.set(key, value);
      }
      destination = target.pathname + (detail.size ? "?" + detail.toString() : "") + target.hash;
    }
  } else if (/^\/programmes\/[a-f0-9]{11}$/.test(path) && href === path && current.size) {
    destination = path + "?" + current.toString();
    stay = true;
  }
  return <Link className={className} data-ask-page href={destination} prefetch={false}
    onNavigate={event => { if (stay) event.preventDefault(); onPick(); }}>{children}</Link>;
}

function Destination({ source, onPick, compact = false }: { source: Source; onPick: () => void; compact?: boolean }) {
  const internal = source.href.startsWith("/") && !source.href.startsWith("//");
  const snippet = source.summary.startsWith(source.title + ". ") ? source.summary.slice(source.title.length + 2) : source.summary;
  const content = <>
    <span className="ask-result-section">{source.section}</span>
    <span className="ask-result-title">{source.title}</span>
    <span aria-hidden="true" className="ask-result-arrow">{internal ? "→" : "↗"}</span>
    {!compact && snippet && <span className="ask-result-summary">{snippet}</span>}
  </>;
  return internal
    ? <GuideLink className="ask-result-link" href={source.href} onPick={onPick}>{content}</GuideLink>
    : <a className="ask-result-link" data-ask-page href={source.href} target="_blank" rel="noopener noreferrer">
        {content}<span className="ask-sr"> (opens in a new tab)</span>
      </a>;
}

type PageResultsProps = {
  pages: Source[]; pending: boolean; failed?: boolean; onPick: () => void; heading?: string;
};
export function PageResults({ pages, pending, failed, onPick, heading = "Matching pages" }: PageResultsProps) {
  const id = useId();
  const items = uniquePages(pages);
  let status = "No matching page yet. You can still ask SRM the full question.";
  if (pending) status = "Finding matching pages…";
  else if (failed) status = "Page search couldn’t load. Try again or submit the question.";
  return <section className="ask-page-results" aria-labelledby={id}>
    <h3 id={id} className="ask-results-heading">{heading}</h3>
    {items.length ? <ol className="ask-page-list" role="list">
      {items.map(source => <li className="ask-page-result" key={source.href}><Destination source={source} onPick={onPick} /></li>)}
    </ol> : <p role="status" className="ask-result-status">{status}</p>}
  </section>;
}

function suggestedQuestions(turn: Turn, earlier: Turn[], sources: Source[]) {
  const result = turn.result;
  if (!result) return [];
  const guide = sources[0]?.href ?? "";
  const topic = turn.context.page;
  const section = sources[0]?.section.toLowerCase();
  const sourceTitle = sources[0]?.title;
  let local: string[] = [];
  if (result.kind === "groq" || result.kind === "guide") {
    if (guide.startsWith("/programmes/compare") && topic === "/programmes/compare" && (turn.context.compare?.split(",").filter(Boolean).length ?? 0) > 1) {
      local = /cost|fee|tuition|cheap|expensive|afford|pay/i.test(turn.question)
        ? ["What can I compare besides tuition?", "Will AI affect campus placements?"]
        : ["Which of my choices has the lowest tuition?", "Will AI affect campus placements?"];
    } else if (/^\/programmes\/[a-f0-9]{11}\b/.test(guide)) {
      local = /\b(eligib\w*|entry|require\w*|subjects?|qualif\w*)\b/i.test(turn.question)
        ? ["How long is this course?", "What is the tuition for this course?"]
        : ["What are the entry requirements for this course?", "How long is this course?"];
    } else if (guide.startsWith("/admissions/course-finder")) {
      local = ["How does the finder suggest a course family?", "How can I compare degrees from my results?"];
    } else if (guide.startsWith("/campus/buddy")) {
      local = /\b(where|place|point|gate)\b/i.test(turn.question) && /\b(meet\w*|walk|buddy)\b/i.test(turn.question)
        ? ["Can I change my buddy preferences?", "What happens after the first campus walk?"]
        : ["Where would I meet my campus buddy?", "Can I change my buddy preferences?"];
    } else if (sourceTitle === "Hostel Wi-Fi") {
      local = ["How do I sign in to academic block Wi-Fi?", "How do I report a Wi-Fi problem to the ITKM service desk?"];
    } else if (sourceTitle === "IAC Connect") {
      local = ["How do I sign in to hostel Wi-Fi?", "How do I report a Wi-Fi problem to the ITKM service desk?"];
    } else if (sourceTitle === "Reset NetID password") {
      local = ["How do I contact the ITKM service desk about my NetID?", "Which student portal should I use after resetting my NetID?"];
    } else if (sourceTitle === "ITKM service desk") {
      local = ["How do I reset my NetID password?", "How do I sign in to academic block Wi-Fi?"];
    } else if (guide === "/admissions#international" || sourceTitle === "International and NRI admissions") {
      local = ["Where can I check the international tuition fee schedule?", "How can I contact the international admissions office?"];
    } else if (/hostel|accommodation/i.test(guide)) {
      local = ["Who can I contact about hostel rooms?", "Where can I check hostel charges?"];
    } else if (/career-centre|deloitte\.com|ilo\.org/.test(guide)) {
      local = ["Whose placement figures are these?", "Will AI affect campus placements?"];
    } else if (guide.startsWith("/admissions/scholarships")) {
      local = ["How do I renew a scholarship?", "Which scholarship documents do I need?"];
    } else if (guide.startsWith("/admissions/campus-visit")) {
      local = ["What should I bring for a campus visit?", "Can I reschedule my campus visit?"];
    } else if (section === "parents" || guide.startsWith("/parents")) {
      local = ["Which parent portal is right for my intake?", "How can a parent check attendance?"];
    } else if (section === "research" || guide.startsWith("/research")) {
      local = ["How can I book research equipment?", "Where can I find research fellowships?"];
    } else if (section === "alumni" || guide.startsWith("/alumni")) {
      local = ["How do I join the alumni network?", "How can I mentor a student?"];
    } else if (guide.startsWith("/admissions")) {
      local = ["How do I contact admissions?", "Where can I check the entry requirements?"];
    } else if (guide.startsWith("/campus")) {
      local = ["How can I arrange a campus visit?", "Where can I find the student clubs?"];
    }
  }
  const key = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const seen = new Set([...earlier, turn].map(t => key(t.question)));
  const suggestions = [...(result.suggestions ?? []), ...local].filter(question => {
    if (typeof question !== "string" || question.trim().length < 2 || question.length > chatLimits.question || seen.has(key(question))) return false;
    seen.add(key(question));
    return true;
  });
  return suggestions.slice(0, Math.min(4, Math.max(2, result.suggestions?.length ?? 0)));
}

type SearchResultsProps = {
  turn: Turn; earlier: Turn[]; pages: Source[]; pagesPending: boolean; pagesFailed?: boolean; comparison?: string;
  onRetry: () => void; onStop: () => void; onFollowUp: (question: string) => void; onPick: () => void;
};

export function SearchResults({ turn, earlier, pages, pagesPending, pagesFailed, comparison, onRetry, onStop, onFollowUp, onPick }: SearchResultsProps) {
  const heading = useId();
  const replyId = useId();
  const [reply, setReply] = useState("");
  const { result, problem } = turn;
  const pending = !result && !problem;
  const label = result?.kind === "groq" ? "AI answer" : result?.kind === "guide" ? "From the SRM guide" : "Ask SRM";
  const text = result && answerText(result);
  const sources = uniquePages(result?.sources ?? []);
  const previews = pending && pages.length > 0;
  const links = previews ? uniquePages(pages).slice(0, 2) : result?.kind === "unanswered" ? [] : sources;
  const shown = links[0]?.section === "Compare courses" ? 4 : 2;
  const linked = new Set(links.map(s => s.href));
  const related = uniquePages([...sources, ...pages]).filter(s => !linked.has(s.href));
  const showPages = related.length > 0 || (!pending && !links.length && (pagesPending || pagesFailed));
  const suggestions = suggestedQuestions(turn, earlier, sources);
  const choosing = result?.kind === "reply" && suggestions.length > 0;
  const quickCompare = comparison && ![...sources, ...pages].some(s => s.href === comparison);
  const past = earlier.filter(t => t.result);
  const linkLabel = previews ? "Matching pages" : result?.kind === "groq" ? "Sources for this answer" : "Open a page";
  const replyText = reply.trim();
  return <div className="ask-search-results">
    <p className="ask-sr" role="status" aria-atomic="true">{result ? label + " ready." : ""}</p>
    <section className="ask-overview" aria-labelledby={heading}>
      <div className="ask-answer-kicker">{label}</div>
      <h3 className="ask-overview-title" id={heading} tabIndex={-1}>{turn.question}</h3>
      {text ? <ReplyText text={text} /> : pending ? (
        <div className="ask-overview-state"><span role="status">{previews ? "Preparing your answer. You can open the matching pages now." : "Looking through SRM guides…"}</span>
          <button type="button" onClick={onStop}>Stop</button>
        </div>
      ) : (
        <div className="ask-overview-state"><span role="status">{problem === "stopped" ? "Search stopped." : "The answer couldn’t load."}</span>
          <button type="button" onClick={onRetry}>Try again</button>
        </div>
      )}
      {links.length > 0 && <nav className="ask-answer-links" aria-label={previews ? "Matching pages" : result?.kind === "groq" ? "Sources for this answer" : "Links for this answer"}>
        <h4>{linkLabel}</h4>
        <ul>{links.slice(0, shown).map(source => <li key={source.href}><Destination source={source} onPick={onPick} compact={!previews} /></li>)}</ul>
        {links.length > shown && <details>
          <summary>{result?.kind === "groq" ? "More sources" : "More pages"} ({links.length - shown})</summary>
          <ul>{links.slice(shown).map(source => <li key={source.href}><Destination source={source} onPick={onPick} compact /></li>)}</ul>
        </details>}
      </nav>}
      {quickCompare && <GuideLink className="ask-compare-link" href={comparison} onPick={onPick}>Compare these courses <span aria-hidden="true">→</span></GuideLink>}
    </section>
    {result && <section className="ask-next" aria-label="Follow up on this answer">
      <h3>{choosing ? "Choose a reply" : "Ask a follow-up"}</h3>
      {suggestions.length > 0 && <div className="ask-next-actions">
        {suggestions.map(question => <button key={question} type="button" data-ask-suggestion onClick={() => onFollowUp(question)}>{question} <span aria-hidden="true">↳</span></button>)}
      </div>}
      <form className="ask-followup-form" aria-label="Follow up on this answer" onSubmit={event => {
        event.preventDefault();
        if (replyText.length >= 2) onFollowUp(replyText);
      }}>
        <label className="ask-sr" htmlFor={replyId}>{choosing ? "Your reply" : "Your follow-up question"}</label>
        <textarea id={replyId} aria-describedby={heading} rows={1} maxLength={chatLimits.question}
          placeholder={choosing ? "Reply in your own words…" : "Write a follow-up about this answer…"}
          value={reply} onChange={event => setReply(event.target.value)}
          onKeyDown={event => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }} />
        <button className="ask-submit" type="submit" aria-label="Send follow-up" disabled={replyText.length < 2}><span>Send</span><Icon name="arrow" /></button>
      </form>
    </section>}
    {showPages && <PageResults pages={related} pending={pagesPending} failed={pagesFailed} onPick={onPick} heading={links.length ? "More matching pages" : "Matching pages"} />}
    {past.length > 0 && <details className="ask-history">
      <summary>Earlier in this search <span>({past.length})</span></summary>
      <ol>{past.map(previous => <li key={previous.id}>
        <h4>{previous.question}</h4><ReplyText text={answerText(previous.result!)} />
        {previous.result!.sources[0] && <Destination source={previous.result!.sources[0]} onPick={onPick} compact />}
      </li>)}</ol>
    </details>}
  </div>;
}
