/** Incubation application: fields, steps and validation shared by the form and the API route. */

export type Option = { value: string; label: string; hint?: string };
export type Field = {
  name: string;
  label: string;
  kind: "text" | "email" | "tel" | "url" | "number" | "textarea" | "select" | "radio" | "checks" | "file" | "consent";
  required?: boolean;
  hint?: string;
  placeholder?: string;
  autoComplete?: string;
  max?: number;
  options?: Option[];
  /** Only shown (and validated) when another field has one of these values. */
  when?: { field: string; is: string[] };
  /** File rules. */
  accept?: string;
  maxFiles?: number;
  maxMb?: number;
  wide?: boolean;
};
export type Step = { id: string; title: string; intro: string; fields: Field[] };

const yesNo: Option[] = [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }];

export const steps: Step[] = [
  {
    id: "you", title: "About you", intro: "So we know who to contact.",
    fields: [
      { name: "fullName", label: "Your name", kind: "text", required: true, autoComplete: "name" },
      { name: "email", label: "Email", kind: "email", required: true, autoComplete: "email" },
      { name: "phone", label: "Phone", kind: "tel", required: true, autoComplete: "tel", placeholder: "+91 98765 43210" },
      { name: "affiliation", label: "Are you from SRM?", kind: "radio", required: true, wide: true, options: [
        { value: "student", label: "Student" },
        { value: "faculty", label: "Faculty or staff" },
        { value: "alumni", label: "Alumni" },
        { value: "external", label: "Not from SRM" },
      ] },
      { name: "registerNo", label: "Register number", kind: "text", required: true, placeholder: "e.g. RA2111003010001",
        when: { field: "affiliation", is: ["student"] } },
      { name: "employeeId", label: "Employee number", kind: "text", required: true,
        when: { field: "affiliation", is: ["faculty"] } },
    ],
  },
  {
    id: "startup", title: "Your startup", intro: "A quick picture of what you're building.",
    fields: [
      { name: "startupName", label: "Startup name", kind: "text", required: true, autoComplete: "organization" },
      { name: "sector", label: "Sector", kind: "select", required: true, options: [
        "E-mobility", "Health & med tech", "Biotech", "Hardware & deep tech", "Defence", "Climate & energy",
        "Agri & food", "Education", "Fintech", "Consumer", "Software & AI", "Other",
      ].map(v => ({ value: v, label: v })) },
      { name: "pitch", label: "What does it do, in one line?", kind: "text", required: true, max: 140, wide: true,
        placeholder: "e.g. We turn old scooters into electric ones" },
      { name: "problem", label: "What problem does it solve?", kind: "textarea", required: true, max: 500, wide: true },
      { name: "stage", label: "How far along are you?", kind: "radio", required: true, wide: true, options: [
        { value: "idea", label: "Just an idea" },
        { value: "prototype", label: "Have a prototype" },
        { value: "customers", label: "Have customers" },
        { value: "scaling", label: "Growing fast" },
      ] },
      { name: "incorporated", label: "Is it a registered company?", kind: "radio", required: true, options: [
        { value: "yes", label: "Yes" }, { value: "no", label: "Not yet" },
      ] },
      { name: "dpiit", label: "Is it DPIIT recognised?", kind: "radio", required: true, when: { field: "incorporated", is: ["yes"] },
        options: [...yesNo, { value: "applied", label: "Applied" }] },
    ],
  },
  {
    id: "team", title: "Team & needs", intro: "Who's on board and how we can help.",
    fields: [
      { name: "teamSize", label: "How many people are on the team?", kind: "number", required: true },
      { name: "fullTime", label: "Is anyone working on it full time?", kind: "radio", required: true, options: yesNo },
      { name: "funding", label: "Money raised so far", kind: "select", required: true, options: [
        "None yet", "Grants only", "Under ₹25 lakh", "₹25 lakh – ₹1 Cr", "Over ₹1 Cr",
      ].map(v => ({ value: v, label: v })) },
      { name: "support", label: "What do you need from us?", kind: "checks", required: true, wide: true, hint: "Pick all that apply.", options: [
        "Workspace", "Funding", "Mentors", "FabLab", "BioNEST lab", "Patents & IP", "Investor intros", "Customers & pilots",
      ].map(v => ({ value: v, label: v })) },
    ],
  },
  {
    id: "deck", title: "Pitch deck", intro: "Your deck tells us the rest.",
    fields: [
      { name: "deck", label: "Pitch deck", kind: "file", required: true, accept: ".pdf,application/pdf", maxFiles: 1, maxMb: 10, wide: true,
        hint: "PDF, up to 10 MB." },
      { name: "video", label: "Demo video link", kind: "url", wide: true, placeholder: "YouTube or Google Drive link" },
    ],
  },
  {
    id: "review", title: "Review", intro: "Check your answers and send.",
    fields: [
      { name: "consent", label: "My answers are accurate, and DEI may contact me about this application.",
        kind: "consent", required: true, wide: true },
    ],
  },
];

export type Values = Record<string, string | string[]>;

export const isVisible = (field: Field, values: Values) =>
  !field.when || field.when.is.includes(String(values[field.when.field] ?? ""));

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[\d\s()-]{8,18}$/;

/** Returns an error message for a non-file field, or null when valid. */
export function checkValue(field: Field, raw: string | string[] | undefined): string | null {
  const value = Array.isArray(raw) ? raw : (raw ?? "").trim();
  const empty = Array.isArray(value) ? value.length === 0 : value === "";
  if (empty) return field.required ? (field.kind === "checks" ? "Pick at least one." : field.kind === "consent" ? "Please tick the box to continue."
    : field.kind === "radio" || field.kind === "select" ? "Please choose an option." : "Please fill this in.") : null;
  if (Array.isArray(value)) {
    return field.options && value.some(v => !field.options!.some(o => o.value === v)) ? "Choose from the list." : null;
  }
  if (field.max && value.length > field.max) return `Keep it under ${field.max} characters.`;
  switch (field.kind) {
    case "email": return emailPattern.test(value) ? null : "Enter an email address like name@example.com.";
    case "tel": return phonePattern.test(value) ? null : "Enter a phone number with 10 digits, e.g. +91 98765 43210.";
    case "url": try { const u = new URL(value); return /^https?:$/.test(u.protocol) ? null : "Enter a link starting with https://"; } catch { return "Enter a link starting with https://"; }
    case "number": { const n = Number(value); return Number.isInteger(n) && n > 0 && n < 1000 ? null : "Enter a whole number."; }
    case "select": case "radio": return field.options?.some(o => o.value === value) ? null : "Choose from the list.";
    default: return null;
  }
}

export type FileLike = { name: string; size: number; type: string };

export function checkFiles(field: Field, files: FileLike[]): string | null {
  if (files.length === 0) return field.required ? "Please upload a file." : null;
  if (field.maxFiles && files.length > field.maxFiles) return `Upload up to ${field.maxFiles} file${field.maxFiles > 1 ? "s" : ""}.`;
  const accepted = (field.accept ?? "").split(",").map(s => s.trim()).filter(Boolean);
  for (const f of files) {
    if (field.maxMb && f.size > field.maxMb * 1024 * 1024) return `${f.name} is over ${field.maxMb} MB.`;
    const ext = "." + (f.name.split(".").pop() ?? "").toLowerCase();
    const ok = accepted.some(a => a.startsWith(".") ? a === ext : a.endsWith("/*") ? f.type.startsWith(a.slice(0, -1)) : a === f.type);
    if (!ok) return `${f.name} isn't an accepted file type.`;
  }
  return null;
}

export const allFields = steps.flatMap(s => s.fields);
