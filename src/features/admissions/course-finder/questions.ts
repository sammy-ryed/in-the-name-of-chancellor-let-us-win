import type { FamilyId } from "@/features/explore/course-families";

export const version = "srm-course-families-v3";
export const notTried = "not-tried";
export type Answers = Record<string, string[]>;
export type Choice = {
  id: string; label: string; families: FamilyId[]; observation?: string; tile?: number;
};
export type Question = {
  id: string; title: string; hint: string; tile: number; choices: Choice[]; max?: number;
};
const pick = (id: string, label: string, families: FamilyId[] = [], observation?: string, tile?: number): Choice =>
  ({ id, label, families, observation, tile });

export const stages = [
  pick("class-10", "Class 10"), pick("class-11", "Class 11"),
  pick("class-12", "Class 12"), pick("finished", "Finished school"),
];

export const core: Question[] = [
  { id: "stage", title: "Where are you in school right now?", hint: "We’ll use this to suggest a next step that makes sense for you.", tile: 0, choices: stages },
  { id: "lunch", title: "The lunch queue takes half the break. What would you try first?", hint: "Imagine you can change one thing tomorrow.", tile: 4, choices: [
    pick("time-queue", "Time where the queue slows down", ["computing", "engineering", "arts-sciences"], "you wanted to measure a problem before changing it"),
    pick("move-counter", "Rearrange the counter and try it again", ["engineering", "architecture-design", "hospitality"], "you wanted to test how a different layout works"),
    pick("ask-servers", "Ask the people serving what gets in the way", ["health", "business", "hospitality"], "you started with the experience of the people doing the work"),
    pick("sketch-signs", "Sketch clearer signs for the counter", ["architecture-design", "arts-sciences"], "you wanted a visual explanation that people could follow"),
    pick("fair-turn", "Work out a fair rule for joining the line", ["law", "business"], "you looked for a rule that works fairly for everyone"),
    pick("food-waste", "Track which food gets left over", ["agriculture", "hospitality"], "you were curious about how food is used and wasted"),
  ] },
  { id: "afternoon", title: "You have one free afternoon. What would you actually show up for?", hint: "Pick up to two. Imagine someone will show you how to start.", tile: 1, max: 2, choices: [
    pick("cafe", "Plan a café menu", ["hospitality", "business"], "you chose to plan something people would come to eat", 4),
    pick("case", "Argue a mock case", ["law"], "you chose to build a case from competing accounts", 5),
    pick("bridge", "Test a model bridge", ["engineering", "architecture-design"], "you chose to explore how a structure holds up", 1),
    pick("film", "Edit a short film", ["arts-sciences", "computing"], "you chose to shape a story from pieces of footage", 6),
    pick("seedlings", "Investigate why seedlings grow differently", ["agriculture", "arts-sciences"], "you chose to investigate differences between living things", 3),
    pick("teach", "Help someone learn a skill", ["health", "arts-sciences"], "you chose to work alongside a person learning something new", 7),
  ] },
  { id: "notice", title: "Your school has an empty room. What do you want to know first?", hint: "Pick the question you would enjoy finding an answer to.", tile: 0, choices: [
    pick("access", "Who finds the room hard to use, and why?", ["health", "architecture-design", "law"], "you noticed whose needs a space might leave out"),
    pick("cost", "What could we run here with the money we have?", ["business", "hospitality"], "you wanted to make a workable plan within a budget"),
    pick("light", "How much light do plants get by each window?", ["agriculture", "arts-sciences"], "you wanted to compare growing conditions in different spots"),
    pick("booking", "How could people book it without clashing?", ["computing", "business"], "you wanted to design rules for a booking system"),
    pick("sound", "Can we stop sound travelling through the walls?", ["engineering", "architecture-design"], "you wanted to test a physical change to a room"),
  ] },
  { id: "practice", title: "Which part would you still enjoy after the exciting bit is over?", hint: "Think about what you could spend a second afternoon doing.", tile: 2, choices: [
    pick("practise", "Practise a technique until it feels natural", ["health", "hospitality", "engineering"], "you were willing to repeat a practical technique to improve it"),
    pick("results", "Check messy results and look for a pattern", ["computing", "agriculture", "arts-sciences"], "you were willing to check imperfect evidence carefully"),
    pick("revise", "Revise a design after someone tries it", ["architecture-design", "engineering", "computing"], "you wanted to refine a design after seeing it in use"),
    pick("questions", "Work through someone’s questions with them", ["law", "health", "arts-sciences"], "you were willing to listen and explain an idea patiently"),
    pick("arrange", "Work out the details that make a plan run smoothly", ["business", "hospitality"], "you were willing to organise the small details behind a plan"),
  ] },
  { id: "show", title: "What would you like to bring to the school fair?", hint: "You can borrow materials and work with a friend.", tile: 3, choices: [
    pick("game", "A paper game with rules you worked out", ["computing", "law"], "you wanted to make a set of rules work in practice"),
    pick("prototype", "A working model people can take apart", ["engineering", "architecture-design"], "you wanted people to learn by handling something you built"),
    pick("plot", "Two pots that show what helped a plant grow", ["agriculture", "arts-sciences"], "you wanted to share an observation that others could check"),
    pick("stall", "A small food stall that covers its costs", ["hospitality", "business"], "you wanted to combine serving people with balancing costs"),
    pick("guide", "An illustrated guide to making a daily task easier", ["health", "arts-sciences", "architecture-design"], "you wanted to make an everyday task easier to understand"),
  ] },
  { id: "read", title: "Which story would make you keep reading?", hint: "Choose the headline you’d open on the bus home.", tile: 6, choices: [
    pick("bus", "How the bus app guesses when your ride will arrive", ["computing", "engineering"], "you were curious about how a system makes predictions"),
    pick("court", "The small detail that changed a court decision", ["law", "arts-sciences"], "you were curious about how a piece of evidence changes an argument"),
    pick("market", "How a neighbourhood kitchen feeds a crowd", ["business", "hospitality"], "you wanted to understand how a service operates at scale"),
    pick("garden", "Why one community garden stayed green all summer", ["agriculture", "architecture-design"], "you wanted to understand how growing conditions and a place fit together"),
    pick("recover", "What it takes to relearn a daily task after an injury", ["health"], "you were curious about the patient work behind someone’s recovery"),
  ] },
  { id: "priorities", title: "What should we keep in mind when you explore degrees?", hint: "Pick up to two. These shape the advice you see afterwards.", tile: 0, max: 2, choices: [
    pick("cost", "What it costs"), pick("duration", "Time spent studying"), pick("earning", "Starting to earn sooner"),
    pick("location", "Where I’d live"), pick("options", "Keeping my options open"),
  ] },
];

// A closer look can change the interpretation of an activity. Each option adds
// evidence for its own kind of work, independently of the original choice.
export const closer: Record<string, Question> = {
  film: { id: "closer-film", title: "You picked the film. Which part sounds worth doing again?", hint: "Imagine a second short film with a different team.", tile: 6, choices: [
    pick("story", "Find the story in the footage", ["arts-sciences"], "you were drawn to finding the story in a film"),
    pick("shoot", "Plan the shoot", ["business"], "you liked planning how the film team would use its time"),
    pick("edit", "Figure out how to make the cuts work", ["computing", "arts-sciences"], "you wanted to experiment with the technical side of editing"),
    pick("screen", "Organise the screening", ["hospitality", "business"], "you wanted to organise an experience for an audience"),
  ] },
  bridge: { id: "closer-bridge", title: "You picked the model bridge. What would you change next?", hint: "Picture a bridge made with folded paper and tape.", tile: 1, choices: [
    pick("load", "Test how much weight each shape can hold", ["engineering", "arts-sciences"], "you wanted to compare the strength of different shapes"),
    pick("access", "Make it easier for everyone to cross", ["architecture-design", "health"], "you wanted to design around how different people cross a bridge"),
    pick("record", "Make a table of results to predict the next test", ["computing"], "you wanted to use recorded results to predict what comes next"),
    pick("price", "Find the strongest design within a budget", ["engineering", "business"], "you wanted to balance how well a structure works against its cost"),
  ] },
  case: { id: "closer-case", title: "You picked the mock case. Which job would you take?", hint: "Both sides have a different account of the same event.", tile: 5, choices: [
    pick("rule", "Read the rule and check how it applies", ["law"], "you wanted to work through what a written rule means"),
    pick("witness", "Help a nervous witness explain what happened", ["health", "law"], "you wanted to help someone give a clear account"),
    pick("timeline", "Rebuild the timeline from the evidence", ["computing", "arts-sciences"], "you wanted to piece together a sequence from evidence"),
  ] },
  seedlings: { id: "closer-seedlings", title: "One seedling grew taller. What would you try next?", hint: "You have a few pots, a windowsill and a notebook.", tile: 3, choices: [
    pick("light", "Give two pots different amounts of light", ["agriculture", "arts-sciences"], "you wanted to test one growing condition at a time"),
    pick("measure", "Make a chart of their heights each week", ["computing", "agriculture"], "you wanted to track change over time"),
    pick("water", "Make a device that waters each pot equally", ["engineering"], "you wanted to build something that makes a test fair"),
  ] },
  cafe: { id: "closer-cafe", title: "Your café has one table. What do you want to get right?", hint: "A few friends will be your first guests.", tile: 4, choices: [
    pick("taste", "Try the same dish twice and adjust the recipe", ["hospitality"], "you wanted to refine a recipe through practice"),
    pick("price", "Price a menu people can afford", ["business", "hospitality"], "you wanted to balance costs with what people can pay"),
    pick("layout", "Sketch a layout that feels welcoming", ["architecture-design"], "you wanted to shape the experience of a small space"),
    pick("grow", "Find out what ingredients grow nearby", ["agriculture"], "you were interested in where ingredients come from"),
  ] },
  teach: { id: "closer-teach", title: "Your friend is stuck. What would you like to try?", hint: "Imagine helping them with a skill you already enjoy.", tile: 7, choices: [
    pick("listen", "Listen to what feels difficult for them", ["health", "arts-sciences"], "you wanted to understand a learner’s own experience"),
    pick("draw", "Draw the steps in a different way", ["architecture-design", "arts-sciences"], "you wanted to explain an idea visually"),
    pick("steps", "Break the task into a sequence they can repeat", ["computing", "engineering"], "you wanted to turn a task into repeatable steps"),
  ] },
};

export function questionPath(answers: Answers): Question[] {
  const followups = (answers.afternoon ?? []).flatMap(id => Object.hasOwn(closer, id) ? [closer[id]] : []).slice(0, 2);
  return [...core.slice(0, 3), ...followups, ...core.slice(3)];
}

export function orderedChoices(question: Question, seed: number): Choice[] {
  if (question.id === "stage") return question.choices;
  const offset = (seed + [...question.id].reduce((sum, c) => sum + c.charCodeAt(0), 0)) % question.choices.length;
  return [...question.choices.slice(offset), ...question.choices.slice(0, offset)];
}
