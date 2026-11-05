function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}

// Render only text, emphasis and lists. Navigation always comes from the source index.
export function ReplyText({ text }: { text: string }) {
  const blocks: { kind: "p" | "ul" | "ol"; lines: string[] }[] = [];
  for (const raw of text.split(/\n+/)) {
    const line = raw.trim();
    if (!line) continue;
    const item = line.match(/^(?:([-*•])|(\d+)[.)])\s+(.+)$/);
    const kind = item ? item[1] ? "ul" : "ol" : "p";
    const previous = blocks.at(-1);
    if (item && previous?.kind === kind) previous.lines.push(item[3]);
    else blocks.push({ kind, lines: [item ? item[3] : line] });
  }
  return <div className="ask-prose">{blocks.map(({ kind: Tag, lines }, i) =>
    Tag === "p" ? <p key={i}>{inline(lines[0])}</p>
      : <Tag key={i}>{lines.map((line, j) => <li key={j}>{inline(line)}</li>)}</Tag>
  )}</div>;
}
