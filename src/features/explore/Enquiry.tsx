"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { admissionsEmails, enquiryMailto } from "@/features/admissions/contact";

export default function Enquiry({ context, courseId }: { context: string; courseId?: string }) {
  const [draft, setDraft] = useState("");
  const directEmail = enquiryMailto(context);

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = new FormData(event.currentTarget).get("question");
    if (typeof question === "string") setDraft(enquiryMailto(context, question));
  }

  return (
    <div className="enquiry">
      <p>
        <strong>{context}</strong> ·{" "}
        <Link href="/programmes">{courseId ? "Change course" : "Choose a course"}</Link>
      </p>
      <form className="enquiry-compose" onSubmit={prepareEmail} action={directEmail} method="post" encType="text/plain">
        <label>
          Your question
          <textarea name="question" required minLength={5} maxLength={1200} rows={3}
            placeholder="What would you like to confirm?" onChange={() => setDraft("")} />
        </label>
        <button type="submit" className="guide-action yellow-action">Prepare email ↗</button>
        {draft && (
          <p role="status">
            Your draft is ready. <a href={draft}>Open your email app</a> to review and send it to SRM admissions.
          </p>
        )}
      </form>
      <p><a href={directEmail}>Email {admissionsEmails.domestic} directly</a></p>
    </div>
  );
}
