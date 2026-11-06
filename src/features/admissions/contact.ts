export const admissionsEmails = {
  domestic: "admissions.india@srmist.edu.in",
  international: "admissions.ir@srmist.edu.in",
};

export function enquiryMailto(context: string, question = "") {
  const subject = encodeURIComponent("Programme enquiry: " + context);
  const body = encodeURIComponent(context + "\n\n" + question);
  return `mailto:${admissionsEmails.domestic}?subject=${subject}&body=${body}`;
}
