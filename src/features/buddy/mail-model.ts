import type { Role } from "./matching";

export type BuddyMessage = { from: Role; body: string };
export type BuddyMailState = {
  reader: Role;
  messages: BuddyMessage[];
  drafts: Partial<Record<Role, string>>;
  composing: boolean;
};

export function otherRole(role: Role): Role {
  return role === "senior" ? "fresher" : "senior";
}

export function messageDraft(role: Role, yourRole: Role, name: string, time: string, first: boolean) {
  const greeting = role === yourRole ? "Hi " + name + "," : "Hi there,";
  const inSentence = time.replace(", ", " at ");
  if (first) {
    return greeting + "\n\nWelcome to Kattankulathur! Could we meet at Arch Gate on " + inSentence + "? We can walk to the Central Library together and find one of your classrooms. Let me know if that time works for you.\n\nSee you soon,\n" + (yourRole === "senior" ? "Your campus buddy" : name);
  }
  return greeting + "\n\n" + (role === "fresher"
    ? inSentence + " works for me. I’ll meet you at Arch Gate. Could we take a look at my timetable when we reach the library?"
    : "Sounds good. Bring your timetable and we’ll go through it together at the library.");
}

export function initialMail(yourRole: Role, name: string, time: string): BuddyMailState {
  return {
    reader: yourRole, composing: yourRole === "senior", drafts: {},
    messages: yourRole === "fresher" ? [{ from: "senior", body: messageDraft("senior", yourRole, name, time, true) }] : [],
  };
}
export function validMail(mail: BuddyMailState | undefined) {
  if (mail === undefined) return true; // Earlier versions of the demo have no email thread yet.
  const role = (value: unknown) => value === "senior" || value === "fresher";
  return Boolean(mail && role(mail.reader) && typeof mail.composing === "boolean" &&
    mail.drafts && typeof mail.drafts === "object" && Object.entries(mail.drafts).every(([k, v]) => role(k) && typeof v === "string") &&
    Array.isArray(mail.messages) && mail.messages.every(m => m && role(m.from) && typeof m.body === "string"));
}
