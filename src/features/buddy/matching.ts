export const topics = ["Finding classrooms", "Library & study spots", "Hostel life", "Food on campus", "Clubs & societies", "Getting around"] as const;
export const languages = ["English", "Tamil", "Hindi", "Telugu", "Malayalam", "Kannada", "Bengali"] as const;
export const times = ["Monday morning", "Wednesday afternoon", "Saturday morning"] as const;
export const meetingTimes: Record<(typeof times)[number], string> = {
  "Monday morning": "Monday, 10 am", "Wednesday afternoon": "Wednesday, 4 pm", "Saturday morning": "Saturday, 10 am",
};
export type Role = "fresher" | "senior";
export type Topic = (typeof topics)[number];
export type Language = (typeof languages)[number];
export type Slot = (typeof times)[number];
export type Preferences = {
  topics: Topic[];
  languages: Language[];
  times: Slot[];
  sameGender: boolean;
  gender: string;
  year: "" | "Second year" | "Third year";
};
type Sample = {
  id: string;
  name: string;
  gender: string;
  role: Role;
  year: string;
  course: string;
  topics: Topic[];
  languages: Language[];
  times: Slot[];
  note: string;
};
export const samples: Sample[] = [
  { id: "s1", name: "Meera", gender: "Woman", role: "senior", year: "Third year", course: "Architecture", topics: ["Library & study spots", "Finding classrooms", "Getting around"], languages: ["English", "Tamil", "Malayalam"], times: ["Monday morning", "Saturday morning"], note: "I still have the little map I drew before my first studio class. We can make one for your timetable." },
  { id: "s2", name: "Kabir", gender: "Man", role: "senior", year: "Second year", course: "Commerce", topics: ["Clubs & societies", "Food on campus", "Hostel life"], languages: ["English", "Hindi", "Bengali"], times: ["Wednesday afternoon", "Saturday morning"], note: "My first week got easier once I knew where to eat between classes. Happy to do a lunch walk." },
  { id: "s3", name: "Ananya", gender: "Woman", role: "senior", year: "Second year", course: "Computer Science", topics: ["Hostel life", "Food on campus", "Clubs & societies"], languages: ["English", "Hindi", "Telugu"], times: ["Monday morning", "Wednesday afternoon"], note: "I moved here from another city too. Bring the questions you haven't had a chance to ask yet." },
  { id: "s4", name: "Kiran", gender: "Non-binary", role: "senior", year: "Third year", course: "Design", topics: ["Library & study spots", "Clubs & societies", "Finding classrooms"], languages: ["English", "Tamil", "Kannada"], times: ["Wednesday afternoon", "Saturday morning"], note: "I usually end a campus walk at the library. There’s always another shelf to explore." },
  { id: "s5", name: "Vignesh", gender: "Man", role: "senior", year: "Third year", course: "Mechanical Engineering", topics: ["Getting around", "Finding classrooms", "Library & study spots"], languages: ["English", "Tamil", "Telugu"], times: ["Monday morning", "Wednesday afternoon"], note: "Let’s walk through the stops on your timetable together before classes start." },
  { id: "f1", name: "Diya", gender: "Woman", role: "fresher", year: "First year", course: "Biotechnology", topics: ["Getting around", "Library & study spots", "Finding classrooms"], languages: ["English", "Tamil", "Malayalam"], times: ["Monday morning", "Saturday morning"], note: "I'd love to find my first classroom before everyone else already knows the way." },
  { id: "f2", name: "Arjun", gender: "Man", role: "fresher", year: "First year", course: "Commerce", topics: ["Hostel life", "Food on campus", "Clubs & societies"], languages: ["English", "Hindi", "Telugu"], times: ["Wednesday afternoon", "Saturday morning"], note: "I've just moved into a hostel. A walk to find a lunch spot would be a great first afternoon." },
  { id: "f3", name: "Dev", gender: "Non-binary", role: "fresher", year: "First year", course: "Visual Communication", topics: ["Library & study spots", "Clubs & societies", "Food on campus"], languages: ["English", "Kannada", "Tamil"], times: ["Monday morning", "Wednesday afternoon"], note: "I want to find the library and hear how people pick their first club." },
  { id: "f4", name: "Rhea", gender: "Woman", role: "fresher", year: "First year", course: "Psychology", topics: ["Clubs & societies", "Food on campus", "Hostel life"], languages: ["English", "Hindi", "Bengali"], times: ["Wednesday afternoon", "Saturday morning"], note: "I'd like to meet people outside my course and learn how clubs work." },
];
export function emptyPreferences(): Preferences {
  return { topics: [], languages: [], times: [], sameGender: false, gender: "", year: "" };
}
export function findBuddies(role: Role, prefs: Preferences, excluded: string[] = []) {
  const normalize = (value: string) => value.trim().toLowerCase().replace(/[\s-]/g, "");
  return samples
    .filter(p => p.role !== role && !excluded.includes(p.id) && (!prefs.sameGender || normalize(prefs.gender) === normalize(p.gender)))
    .map(person => ({ person,
      times: prefs.times.filter(s => person.times.includes(s)),
      languages: prefs.languages.filter(s => person.languages.includes(s)),
      topics: prefs.topics.filter(s => person.topics.includes(s)),
    }))
    .filter(match => match.times.length && match.languages.length)
    .sort((a, b) => b.times.length - a.times.length || b.languages.length - a.languages.length || b.topics.length - a.topics.length);
}
export type ChecklistItem = { id: string; title: string; done: boolean; actor?: string };
export function firstWeek(): ChecklistItem[] {
  return ["Say hello at Arch Gate", "Visit the Central Library together", "Find a classroom on your timetable", "Check in at the end of the week"].map((title, index) => ({ id: String(index), title, done: false }));
}
