import type { FamilyId } from "@/features/explore/course-families";

type FamilyGuide = {
  description: string; tradeOff: string; tryThis: string; subjects: string; tile: number;
};
export const guides: Record<FamilyId, FamilyGuide> = {
  computing: {
    description: "Use rules, data and code to make a task work reliably.",
    tradeOff: "A small program can take longer to test and fix than it took to write.",
    tryThis: "Write instructions for sorting six playing cards. Ask a friend to follow them exactly and see where a step is missing.",
    subjects: "Compare the maths, programming and statistics modules. Check the Class 12 subject combination for each degree.", tile: 6,
  },
  engineering: {
    description: "Build and test things that have to work in the physical world.",
    tradeOff: "Expect to work through calculations and unsuccessful tests before a prototype works.",
    tryThis: "Span a gap between two books with a sheet of paper. Try two different folds and compare how many coins each can hold.",
    subjects: "Look up the maths and science entry subjects for each branch, then compare the labs and design projects.", tile: 1,
  },
  "architecture-design": {
    description: "Shape objects and spaces around the people who use them.",
    tradeOff: "A design often needs several revisions after people try it or point out a constraint.",
    tryThis: "Sketch your classroom from above. Ask someone where it’s hard to move and redraw that part to suit them.",
    subjects: "Check the entry subjects, drawing or aptitude requirements and studio hours for each route.", tile: 1,
  },
  business: {
    description: "Work out how people, money and decisions fit together in an organisation.",
    tradeOff: "Making a plan involves revisiting costs and listening to people who have competing priorities.",
    tryThis: "Price a one-day snack stall on paper. See what happens to your budget if only half your customers turn up.",
    subjects: "Compare the finance, management and quantitative modules. Check whether a course specifies mathematics or another entry subject.", tile: 4,
  },
  "arts-sciences": {
    description: "Investigate a question, interpret evidence or communicate a story. This family includes several quite different paths.",
    tradeOff: "A promising explanation or a first draft may change once you look at more evidence or hear another reading.",
    tryThis: "Choose a question about your street. Collect three observations and tell the story in a short paragraph or a labelled diagram.",
    subjects: "Choose a subject within this broad family first. Compare the lab, reading or studio work and its specific Class 12 requirements.", tile: 2,
  },
  law: {
    description: "Read a rule closely, weigh different accounts and explain a reasoned position.",
    tradeOff: "An argument usually takes more careful reading, note-taking and rewriting than time spent presenting it.",
    tryThis: "Find a school rule two people read differently. Write the strongest argument for each reading and suggest clearer wording.",
    subjects: "Compare the emphasis on legal reading, writing and the accompanying subjects in each integrated degree. Check its entry route.", tile: 5,
  },
  health: {
    description: "Learn about the body and practise working carefully with people who need support.",
    tradeOff: "People-facing work needs patience, accurate records and repeated practice, including when progress is slow.",
    tryThis: "Ask someone to show you an everyday task they find awkward. Listen first, then draw two changes and ask which would help.",
    subjects: "Check the required science subjects, entrance route and clinical or supervised training for the exact health degree.", tile: 7,
  },
  agriculture: {
    description: "Study how crops, soil, water and growing conditions affect one another.",
    tradeOff: "A result may take weeks and a good plan can still be interrupted by weather or uneven conditions.",
    tryThis: "Put two similar pots in different light. Keep the rest of their care the same and record the change you expect to see.",
    subjects: "Compare the science entry subjects, fieldwork and time spent at the teaching farm for each programme.", tile: 3,
  },
  hospitality: {
    description: "Design and deliver food, service and guest experiences with a team.",
    tradeOff: "The visible event depends on preparation, cleaning and working to a timetable while people are waiting.",
    tryThis: "Plan tea for four people. Work backwards from serving time, try your timetable and note what you would prepare earlier.",
    subjects: "Compare practical kitchens, service training, placements and the stated school qualification for each route.", tile: 4,
  },
};
export const practical: Record<string, string> = {
  cost: "Compare tuition for the same period and campus. Check which compulsory charges are extra.",
  duration: "Look at the full duration, including any required internship or supervised training.",
  earning: "Compare when supervised training ends and what a first role involves. Read the cohort and year on every placement figure.",
  location: "Pick a campus you could travel to or live at, then check which degrees it actually offers.",
  options: "Look for a shared first year, optional modules and the requirements for further study.",
};
