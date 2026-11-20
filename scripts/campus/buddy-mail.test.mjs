import assert from "node:assert/strict";
import { test } from "node:test";
import { initialMail, messageDraft, validMail } from "../../src/features/buddy/mail-model.ts";

test("a fresher receives the senior’s introduction for the paired walk", () => {
  const mail = initialMail("fresher", "Meera", "Monday, 10 am");
  assert.equal(mail.reader, "fresher");
  assert.equal(mail.composing, false);
  assert.equal(mail.messages.length, 1);
  assert.equal(mail.messages[0].from, "senior");
  assert.match(mail.messages[0].body, /Arch Gate on Monday at 10 am/);
  assert.match(mail.messages[0].body, /Central Library/);
  assert.match(mail.messages[0].body, /Meera$/);
});

test("a senior writes first and the fresher’s reply confirms that meeting", () => {
  const mail = initialMail("senior", "Rhea", "Wednesday, 4 pm");
  assert.equal(mail.composing, true);
  assert.deepEqual(mail.messages, []);
  const first = messageDraft("senior", "senior", "Rhea", "Wednesday, 4 pm", true);
  const reply = messageDraft("fresher", "senior", "Rhea", "Wednesday, 4 pm", false);
  assert.match(first, /^Hi Rhea,/);
  assert.match(reply, /Wednesday at 4 pm works for me/);
  assert.match(reply, /Arch Gate/);
});

test("restore accepts older sessions and current email drafts while rejecting malformed records", () => {
  assert.equal(validMail(undefined), true);
  const paired = initialMail("fresher", "Meera", "Monday, 10 am");
  assert.equal(validMail({ ...paired, drafts: { fresher: "See you there." } }), true);
  assert.equal(validMail({ ...paired, messages: [{ from: "other", body: "unknown" }] }), false);
});
