// Illustrative schedules and staffing, not published university information.
export const visitConfig = {
  horizonDays: 90,
  capacity: 25,
  weekdays: [1, 2, 3, 4, 5, 6],
  holidays: ["01-26", "08-15", "10-02", "12-25"],
  exceptions: {} as Record<string, { closed?: boolean; capacity?: number }>,
  times: [
    { start: "10:00", end: "11:00", guide: "Ananya · Student ambassador" },
    { start: "11:30", end: "12:30", guide: "Arjun · Student ambassador" },
    { start: "14:00", end: "15:00", guide: "Ananya · Student ambassador" },
    { start: "15:30", end: "16:30", guide: "Arjun · Student ambassador" },
  ],
  campuses: [
    { id: "78", name: "Kattankulathur", location: "Chennai, Tamil Nadu", image: "/campus/srm-university-lake.webp", imageAlt: "SRM buildings reflected in the campus lake", note: "A first look at life on our Chennai campus.", venue: "Main reception · Visitor meeting point", coordinator: "Demo visit coordination desk", },
    { id: "408", name: "Acharapakkam", location: "Baburayanpettai, Tamil Nadu", image: "/home/subjects/agriculture.webp", imageAlt: "Agricultural learning at SRM", note: "Discover learning with room to grow.", venue: "Campus reception · Visitor meeting point", coordinator: "Demo visit coordination desk", },
    { id: "ramapuram", name: "Ramapuram", location: "Chennai, Tamil Nadu", image: "", imageAlt: "", note: "Explore our Ramapuram campus.", venue: "Campus reception · Visitor meeting point", coordinator: "Demo visit coordination desk", },
    { id: "vadapalani", name: "Vadapalani", location: "Chennai, Tamil Nadu", image: "", imageAlt: "", note: "Discover our Vadapalani campus.", venue: "Campus reception · Visitor meeting point", coordinator: "Demo visit coordination desk", },
    { id: "tiruchirappalli", name: "Tiruchirappalli", location: "Tiruchirappalli, Tamil Nadu", image: "", imageAlt: "", note: "Experience our Tiruchirappalli campus.", venue: "Campus reception · Visitor meeting point", coordinator: "Demo visit coordination desk", },
    { id: "delhi-ncr", name: "Delhi NCR", location: "Modinagar, Ghaziabad, Uttar Pradesh", image: "", imageAlt: "", note: "Get to know our Delhi NCR campus.", venue: "Campus reception · Visitor meeting point", coordinator: "Demo visit coordination desk", },
  ],
};

export const categories = ["Prospective student", "Parent or guardian", "School group", "Other"];
export const purposes = ["Explore programmes", "Experience campus life", "Admissions counselling", "School educational visit"];
export const itinerary = [
  { time: "00–10 min", title: "A warm welcome", text: "Meet your batch at reception, verify your pass and get acquainted with your campus guide." },
  { time: "10–40 min", title: "Walk into possibility", text: "Explore academic spaces, the library and student life with your group. Access to laboratories depends on activity on the day." },
  { time: "40–55 min", title: "Ask the big questions", text: "Make time for programmes, applications and a conversation about what comes next." },
  { time: "55–60 min", title: "Your next chapter", text: "Wrap up with your guide, collect useful information and leave with a clearer picture of SRM." },
];

export function indiaDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
export function addDays(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function prettyDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(`${date}T12:00:00+05:30`));
}
export function prettyTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}
