import { useRef, useState } from "react";
import type { Role } from "./matching";
import { messageDraft, otherRole, type BuddyMailState } from "./mail-model";
import styles from "./buddy.module.css";

export function BuddyMail({ name, role, time, mail, update }: {
  name: string; role: Role; time: string; mail: BuddyMailState; update: (next: BuddyMailState) => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const { reader, messages } = mail;
  const first = messages.length === 0;
  const other = otherRole(reader);
  const label = (person: Role) => person === role ? "You" : name;
  const address = (person: Role) => (person === role ? "your." + person : name.toLowerCase()) + "@campus-buddy.example";
  const subject = "Our first campus walk at Arch Gate";
  const draft = mail.drafts[reader] ?? messageDraft(reader, role, name, time, first);
  const lastSender = messages.at(-1)?.from;

  function showReply() {
    setError(""); setStatus("");
    update({ ...mail, composing: true });
    requestAnimationFrame(() => input.current?.focus());
  }
  function openOtherInbox() {
    setError(""); setStatus("");
    update({ ...mail, reader: other, composing: false });
    requestAnimationFrame(() => heading.current?.focus());
  }
  function send(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.trim()) { setError("Write a message before sending it in the demo."); input.current?.focus(); return; }
    update({
      ...mail, composing: false,
      messages: [...messages, { from: reader, body: draft.trim() }],
      drafts: { ...mail.drafts, [reader]: undefined },
    });
    setError(""); setStatus("Message saved to the demo thread.");
    requestAnimationFrame(() => heading.current?.focus());
  }
  return <section className={styles.mail} aria-labelledby="buddy-mail-title">
    <header className={styles.mailHead}>
      <span className={styles.eyebrow}>SRM student email · Demo inbox</span>
      <h2 id="buddy-mail-title" tabIndex={-1} ref={heading}>{first ? "Send the first hello." : "Your email introduction."}</h2>
      <p>{first ? "As the senior, send a short introduction and suggest your first walk." :
        "Use your SRM student mailbox to confirm the walk and arrange your first-week check-in."}</p>
    </header>
    <div className={styles.mailBody}>
      <p className={styles.mailDemo}>These fictional addresses work only in this tab. No email leaves the demo.</p>
      <div className={styles.reader}><strong>{reader === role ? "Your" : name + "’s"} {first ? "draft" : "inbox"}</strong><span>{address(reader)}</span></div>
      <h3 className={styles.mailSubject}>{subject}</h3>
      {messages.length > 0 && <ol className={styles.messages} aria-label="Buddy email thread">
        {messages.map((message, index) => <li key={index}>
          <div className={styles.messageHeader}><strong>{label(message.from)}<small> · {message.from}</small></strong><small>{index === 0 ? "Introduction" : "Reply"}</small></div>
          <p>{message.body}</p>
        </li>)}
      </ol>}
      {mail.composing ? <form className={styles.compose} onSubmit={send}>
        <div className={styles.messageHeader}><strong>{first ? "First email" : "Reply"}</strong><small>Demo draft</small></div>
        <p className={styles.recipient}>To <strong>{other === role ? "your sample address" : name}</strong> · {address(other)}</p>
        <label className={styles.inputLabel} htmlFor="buddy-email-body">{first ? "Your introduction" : "Your reply"}</label>
        <textarea id="buddy-email-body" ref={input} maxLength={1200} rows={first ? 7 : 5} value={draft}
          onChange={e => { setError(""); update({ ...mail, drafts: { ...mail.drafts, [reader]: e.target.value } }); }} />
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <div className={styles.buttons}><button type="submit" className={styles.primary}>{first ? "Send demo introduction" : "Send demo reply"} <span aria-hidden="true">→</span></button>
          {!first && <button type="button" className={styles.secondary} onClick={() => { setError(""); setStatus("Draft saved in this tab."); update({ ...mail, composing: false, drafts: { ...mail.drafts, [reader]: draft } }); requestAnimationFrame(() => heading.current?.focus()); }}>Save draft</button>}
        </div>
      </form> : <div className={styles.buttons}>
        {lastSender !== reader && <button type="button" className={styles.primary} onClick={showReply}>{mail.drafts[reader] !== undefined ? "Continue your draft" : "Reply to " + (other === role ? "the " + role : name)}</button>}
        <button type="button" className={lastSender === reader ? styles.primary : styles.secondary} onClick={openOtherInbox}>{other === role ? "Return to your inbox" : "View " + name + "’s inbox"}</button>
      </div>}
      <p className={styles.mailStatus} role="status">{status}</p>
    </div>
  </section>;
}
