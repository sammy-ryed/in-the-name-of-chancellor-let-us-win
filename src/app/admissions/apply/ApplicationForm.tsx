"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import s from "./apply.module.css";

const exams = ["SRMJEEE", "SRMJEEM", "SRMJEEH", "Others"];

export function ApplicationForm({ exam, onExamChange }: { exam: string; onExamChange: (exam: string) => void }) {
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setOtpSent(true);
  }

  function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setVerified(true);
  }

  if (verified) return <div className={s.registered} role="status">
    <span aria-hidden="true">✓</span>
    <p className={s.kicker}>Mobile verified</p>
    <h2>Registration started.</h2>
    <p>Your application can now continue through academic details, document upload and payment.</p>
    <a href="#journey">See the next five steps ↓</a>
    <button type="button" onClick={() => { setVerified(false); setOtpSent(false); }}>Edit registration</button>
  </div>;

  if (otpSent) return <form className={s.otpForm} onSubmit={verify}>
    <button className={s.editNumber} type="button" onClick={() => setOtpSent(false)}>← Edit mobile number</button>
    <p className={s.kicker}>Verify your mobile</p>
    <h2>Enter the 6-digit OTP</h2>
    <p>Use the code sent to the mobile number you registered with.</p>
    <label>One-time password<input name="otp" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" required placeholder="• • • • • •" /></label>
    <button className={s.registerButton} type="submit">Verify & continue</button>
    <button className={s.resend} type="button">Resend OTP</button>
  </form>;

  return <form className={s.quickForm} onSubmit={register} id="application-form">
    <div className={s.formTitle}><span aria-hidden="true" /><p className={s.kicker}>Admissions 2027–28</p><h2>Apply Now</h2><p>Fill in your details to begin your SRM application.</p></div>
    <div className={s.examTabs} role="group" aria-label="Choose entrance exam">
      {exams.map((item) => <button type="button" key={item} data-active={exam === item} onClick={() => onExamChange(item)}>{item}</button>)}
    </div>
    <input type="hidden" name="exam" value={exam} />
    <label><span>Full name</span><input name="name" autoComplete="name" required placeholder="Full Name *" /></label>
    <label><span>Email address</span><input type="email" name="email" autoComplete="email" required placeholder="Email Address *" /></label>
    <label className={s.mobile}><span>Mobile number</span><b>+91</b><input type="tel" name="mobile" autoComplete="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} required placeholder="Mobile Number *" /></label>
    <label><span>Preferred programme</span><select name="programme" required defaultValue=""><option value="" disabled>Preferred Programme *</option><option>B.Tech in Computer Science and Engineering</option><option>B.Tech in Artificial Intelligence & Machine Learning</option><option>B.Tech in Electronics & Communication Engineering</option><option>B.Tech in Mechanical Engineering</option><option>B.Tech in Biotechnology / Biomedical Engineering</option><option>Other programme</option></select></label>
    <div className={s.statNote}><strong>For statistical purposes only.</strong> This preference does not lock your admission choice. You select your actual course during counselling.</div>
    <label><span>Your query</span><textarea name="query" rows={2} placeholder="Your Query (Optional)" /></label>
    <button className={s.registerButton} type="submit">Register & Get OTP</button>
    <p className={s.login}>Already registered? <a href="mailto:admissions.india@srmist.edu.in?subject=SRMJEEE%20application%20login%20help">Get login help</a></p>
    <Link className={s.programLink} href="/programmes">See all programmes →</Link>
  </form>;
}
