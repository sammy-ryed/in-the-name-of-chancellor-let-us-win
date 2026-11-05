"use client";
import Link from "next/link";
import { useState } from "react";
export default function Enquiry({
  context,
  courseId,
}: {
  context: string;
  courseId?: string;
}) {
  const [draft, setDraft] = useState("");
  return (
    <form
      className="enquiry"
      key={context}
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        setDraft(
          "mailto:admissions.india@srmist.edu.in?subject=" +
            encodeURIComponent("Programme enquiry: " + context) +
            "&body=" +
            encodeURIComponent(context + "\n\n" + d.get("question")),
        );
      }}
    >
      <p>
        <strong>{context}</strong> ·{" "}
        <Link href="/programmes">
          {courseId ? "Change course" : "Choose a course"}
        </Link>
      </p>
      <label>
        Your question
        <textarea
          name="question"
          required
          minLength={5}
          maxLength={1200}
          rows={3}
          placeholder="What would you like to confirm?"
          onChange={() => setDraft("")}
        />
      </label>
      <button className="guide-action yellow-action">Prepare email ↗</button>
      {draft && (
        <p role="status">
          Your draft is ready. <a href={draft}>Open your email app</a> to review
          and send it to SRM admissions.
        </p>
      )}
    </form>
  );
}
