import type { Course } from "./academic";

type MarketSource = { text: string; url: string };
type MarketEvidence = { pay?: MarketSource; hiring?: MarketSource };
type MarketCourse = Pick<Course, "degree" | "name" | "faculty" | "level">;

const occupations = {
  software: ["Software developer", "Software_Developer", 483009, 353, 2026],
  machineLearning: ["Machine learning engineer", "Machine_Learning_Engineer", 596082, 39, 2026],
  data: ["Data analyst", "Data_Analyst", 413462, 576, 2026],
  security: ["Security analyst", "Security_Analyst", 355069, 55, 2026],
  agriculture: ["Agronomist", "Agronomist", 335000, 8, 2025],
  nurse: ["Registered nurse", "Registered_Nurse_(RN)", 261158, 52, 2026],
  dentist: ["Dentist", "Dentist", 303464, 53, 2026],
  optometrist: ["Optometrist", "Optometrist", 300551, 44, 2026],
  occupational: ["Occupational therapist", "Occupational_Therapist_(OT)", 330000, 22, 2025],
  dietitian: ["Dietitian", "Dietitian", 202261, 40, 2026],
  laboratory: ["Medical laboratory technician", "Medical_Laboratory_Technician", 233492, 41, 2025],
  physio: ["Physiotherapist", "Physiotherapist", 292986, 120, 2026],
  pharmacy: ["Pharmacist", "Pharmacist", 251181, 173, 2026],
  aerospace: ["Aerospace engineer", "Aerospace_Engineer", 714095, 88, 2025],
  robotics: ["Robotics engineer", "Robotics_Engineer", 393054, 27, 2025],
  dialysis: ["Dialysis technician", "Dialysis_Technician", 220000, 19, 2026],
  hearing: ["Audiologist", "Audiologist", 461299, 11, 2026],
  physicianAssistant: ["Physician assistant", "Physician_Assistant_(PA)", 301674, 25, 2025],
  radiography: ["Radiographer", "Radiographer", 276000, 272, 2026],
  perfusion: ["Perfusionist", "Perfusionist", 484790, 11, 2024],
  medicalOfficer: ["Medical officer", "Medical_Officer", 584274, 69, 2025],
  anaesthesia: ["Anaesthesia technician", "Anesthesia_Technician", 302524, 10, 2024],
  civil: ["Civil engineer", "Civil_Engineer", 248084, 511, 2026],
  mechanical: ["Mechanical engineer", "Mechanical_Engineer", 303575, 827, 2026],
  electrical: ["Electrical engineer", "Electrical_Engineer", 307347, 318, 2026],
  electronics: ["Electronics engineer", "Electronics_Engineer", 382876, 118, 2026],
  biomedical: ["Biomedical engineer", "Biomedical_Engineer", 354681, 57, 2025],
  chemical: ["Chemical engineer", "Chemical_Engineer", 435553, 117, 2026],
  food: ["Food technologist", "Food_Technologist", 393883, 37, 2025],
  biotech: ["Biotechnologist", "Biotechnologist", 492168, 44, 2026],
  qc: ["Quality control chemist", "Quality_Control_(QC)_Chemist", 187352, 49, 2026],
  teacher: ["High school teacher", "High_School_Teacher", 297059, 111, 2026],
  editor: ["Film / video editor", "Film_%2F_Video_Editor", 239357, 78, 2026],
  writer: ["Content writer", "Content_Writer", 266278, 75, 2026],
  finance: ["Financial analyst", "Financial_Analyst", 388390, 418, 2026],
  marketing: ["Marketing executive", "Marketing_Executive", 250697, 174, 2026],
  operations: ["Operations analyst", "Operations_Analyst", 344798, 58, 2026],
  fitness: ["Fitness trainer", "Fitness_Trainer", 235832, 14, 2026],
  accountant: ["Accountant", "Accountant", 229155, 247, 2026],
  lawyer: ["Associate attorney", "Associate_Attorney", 360383, 31, 2025],
  hospitality: ["Chef de partie (section chef)", "Chef_de_Partie", 303391, 22, 2024],
  graphic: ["Graphic designer", "Graphic_Designer", 241372, 264, 2026],
  industrial: ["Industrial designer", "Industrial_Designer", 500000, 16, 2025],
  interior: ["Interior designer", "Interior_Designer", 248345, 132, 2026],
  fashion: ["Fashion designer", "Fashion_Designer", 301590, 85, 2025],
  architect: ["Architect", "Architect_(but_not_Landscape_or_Naval)", 225848, 31, 2025],
} as const;

type Occupation = keyof typeof occupations;
const annualReport = "https://www.foundit.in/career-advice/wp-content/uploads/2025/12/foundit-Insights-Tracker-Annual-Trends-2025-1.pdf";
const aiReport = "https://www.foundit.in/career-advice/wp-content/uploads/2026/01/foundit-Insights-Tracker-Dec25-Trends.pdf";
const signals = {
  it: "IT roles rose 30% year on year in foundit’s 2025 India hiring tracker, across experience levels.",
  ai: "Of the AI postings tracked by foundit in India in 2025, 18% asked for zero to three years of experience.",
  engineering: "Engineering and production roles fell 1% year on year in foundit’s 2025 India tracker, across experience levels.",
  design: "Creative roles rose 10% year on year in foundit’s 2025 India hiring tracker, across experience levels.",
  medical: "Medical roles rose 19% year on year in foundit’s 2025 India hiring tracker, across experience levels.",
  finance: "Finance and accounting roles rose 25% year on year in foundit’s 2025 India tracker, across experience levels.",
  marketing: "Marketing and communications roles rose 14% year on year in foundit’s 2025 India tracker, across experience levels.",
  law: "Legal roles rose 12% year on year in foundit’s 2025 India hiring tracker, across experience levels.",
  agriculture: "The Indian agriculture recruitment index on foundit moved from 60 in November 2024 to 68 in November 2025.",
  hospitality: "The travel and tourism recruitment index for India on foundit rose from 164 in November 2024 to 214 in November 2025.",
} as const;

type Signal = keyof typeof signals;

// The first matching subject gets one illustrative occupation. Specific disciplines precede broad
// computing terms so a mechanical or electronics specialisation keeps its own field of practice.
const pathways: ReadonlyArray<readonly [RegExp, Occupation, Signal?]> = [
  [/aerospace|aeronautical/, "aerospace", "engineering"], [/robotics/, "robotics", "engineering"],
  [/dialysis/, "dialysis", "medical"], [/audiology/, "hearing", "medical"],
  [/physician associ|physician assistant/, "physicianAssistant", "medical"],
  [/radiology|medical imaging/, "radiography", "medical"], [/perfusion/, "perfusion", "medical"],
  [/medicine and bachelor of surgery/, "medicalOfficer", "medical"], [/anaesthesia/, "anaesthesia", "medical"],
  [/medical laboratory/, "laboratory", "medical"],
  [/nursing|post basic b\.sc\(n\)/, "nurse", "medical"],
  [/dental surgery/, "dentist", "medical"], [/optometry/, "optometrist", "medical"],
  [/occupational therapy/, "occupational", "medical"], [/dietetics/, "dietitian", "medical"],
  [/physiotherapy/, "physio", "medical"], [/pharmacy|b\.pharm/, "pharmacy", "medical"],
  [/architecture/, "architect"], [/interior design/, "interior", "design"],
  [/industrial design/, "industrial", "design"], [/fashion design/, "fashion", "design"],
  [/hotel|hospitality/, "hospitality", "hospitality"], [/horticulture|agriculture/, "agriculture", "agriculture"],
  [/legum baccalaureus/, "lawyer", "law"],
  [/food technology/, "food"], [/biotechnology/, "biotech"],
  [/biomedical engineering/, "biomedical", "engineering"], [/chemical engineering/, "chemical", "engineering"],
  [/civil engineering/, "civil", "engineering"], [/electrical and electronics/, "electrical", "engineering"],
  [/electronic|semiconductor|instrumentation/, "electronics", "engineering"],
  [/mechanical|mechatronic|automobile/, "mechanical", "engineering"],
  [/cyber security|devsecops/, "security", "it"],
  [/data science|data analytics|business analytics|statistics/, "data", "it"],
  [/machine learning|artificial intelligence|agentic ai|generative ai|ai and blockchain/, "machineLearning", "ai"],
  [/computer science|computer application|information technology|computing|software/, "software", "it"],
  [/film technology/, "editor", "design"], [/visual communication/, "graphic", "design"],
  [/journalism|english$|liberal arts/, "writer", "design"], [/chemistry/, "qc"],
  [/physical education|sports sciences/, "fitness"], [/^education \(/, "teacher"],
  [/banking|capital markets|strategic finance|fintech|economics|computational finance/, "finance", "finance"],
  [/accounting|taxation|commerce|corporate secretaryship/, "accountant", "finance"],
  [/information system and management/, "accountant", "finance"],
  [/digital marketing/, "marketing", "marketing"], [/business administration/, "operations"],
];

export function marketFor(course: MarketCourse): MarketEvidence {
  if (course.level !== "Undergraduate") return {};
  const subject = course.degree === "B.Com" && course.name === "General" ? "general commerce" : course.name.toLowerCase();
  const pathway = pathways.find(([pattern]) => pattern.test(subject));
  if (!pathway) {
    if (course.faculty === "law") return { hiring: hiringSource("law") };
    if (course.faculty === "medicine-health-sciences") return { hiring: hiringSource("medical") };
    if (course.faculty === "engineering") return { hiring: hiringSource("engineering") };
    return {};
  }
  const [, occupation, signal] = pathway;
  const [role, slug, amount, reports, year] = occupations[occupation];
  const experience = occupation === "hospitality" ? "1–4 years’ experience" : "under 1 year of experience";
  const lakhs = (amount / 100000).toFixed(2);
  return {
    pay: {
      text: `${role} · India · ${experience}. ₹${lakhs} lakh per year in average total compensation. Payscale, ${year} (${reports} salary reports${reports < 30 ? ", a small sample" : ""}).`,
      url: "https://www.payscale.com/research/IN/Job%3D" + slug + "/Salary",
    },
    hiring: signal ? hiringSource(signal) : undefined,
  };
}

function hiringSource(signal: Signal): MarketSource {
  return { text: signals[signal], url: signal === "ai" ? aiReport : annualReport };
}
