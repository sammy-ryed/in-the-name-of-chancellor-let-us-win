import type { FamilyId } from "@/features/explore/course-families";

export const version = "srm-course-families-v4";
export const notTried = "not-tried";
export const noFit = "none-fit";
export type Answers = Record<string, string[]>;

export type Choice = {
  id: string;
  label: string;
  families: FamilyId[];
  observation?: string;
  tile?: number;
};
export type Question = {
  id: string;
  title: string;
  hint: string;
  tile: number;
  choices: Choice[];
  max?: number;
  signal?: "interest" | "task" | "followup";
};

function choice(id: string, label: string): Choice {
  return { id, label, families: [] };
}
function task(id: string, label: string, family: FamilyId, observation: string, tile?: number): Choice {
  return { id, label, families: [family], observation, tile };
}
function interest(id: FamilyId, label: string, observation: string): Choice {
  return task(id, label, id, observation);
}

export const stages = [
  choice("class-10", "Class 10"), choice("class-11", "Class 11"),
  choice("class-12", "Class 12"), choice("finished", "Finished school"),
];

export const core: Question[] = [
  {
    id: "stage", title: "Where are you in school right now?", tile: 0,
    hint: "This helps us suggest a next step you can try this year.",
    choices: stages,
  },
  {
    id: "interests", signal: "interest", title: "What would you like to learn more about?", tile: 0, max: 2,
    hint: "Pick up to two. You can be curious about something you’ve never studied.",
    choices: [
      interest("computing", "Computers, coding or data", "you said you were curious about computers, coding or data"),
      interest("engineering", "How machines and structures work", "you picked machines and structures as an interest"),
      interest("architecture-design", "Designing spaces or everyday objects", "you said you wanted to explore how spaces or objects are designed"),
      interest("business", "Customers, teams and how a business makes money", "you picked customers and how businesses run as an interest"),
      interest("arts-sciences", "Stories, films, people, maths or science", "you chose a group of subjects that includes the arts, humanities and sciences"),
      interest("law", "Rights, rules and how disputes get settled", "you said you wanted to understand rights and disputes"),
      interest("health", "The human body and caring for people", "you said you were curious about the body and caring for people"),
      interest("agriculture", "Growing food and looking after crops", "you picked growing food as something to explore"),
      interest("hospitality", "Food, guests and running a kitchen or hotel", "you picked food and guest service as interests"),
    ],
  },
  {
    id: "afternoon", signal: "task", title: "You have a free afternoon. What would you try?", tile: 1,
    hint: "Imagine someone brings everything you need and shows you how to begin.",
    choices: [
      task("bridge", "Fold a paper bridge and see how many coins it holds", "engineering", "engineers test small models to see how a change in shape affects the weight a structure can carry", 1),
      task("snack-service", "Plan a snack menu and serve it to a few guests", "hospitality", "serving guests means deciding what to prepare and noticing what people need once they arrive", 4),
      task("seedlings", "Find out why two pots of the same plant grew differently", "agriculture", "growers compare light, soil and water to work out what might help the next crop", 3),
      task("skit", "Turn a funny incident into a short play", "arts-sciences", "a playwright decides whose version of an incident to tell and which details an audience needs", 2),
      task("price", "Work out what a snack stall should charge to cover its costs", "business", "in a small business, knowing the cost of each portion helps you set a price"),
      task("fair-rule", "Hear two sides of a disagreement and see which rule applies", "law", "legal reasoning starts with checking which details of a disagreement matter under a particular rule", 5),
    ],
  },
  {
    id: "sports-day", signal: "task", title: "There’s a sports day in your area. Which job would you take?", tile: 0,
    hint: "You can help behind the scenes. You don’t need to play a sport.",
    choices: [
      task("fixtures", "Write rules for a timetable so nobody has two matches at once", "computing", "finding clashes means turning a real problem into rules a computer could follow"),
      task("layout", "Draw where the stalls and paths should go so people can move easily", "architecture-design", "designers use paths on a drawing to spot where a crowd might get stuck"),
      task("first-aid", "Sit with the first-aid team and learn what they check", "health", "in health work, noticing a change and describing it clearly can help the team decide what to check next"),
      task("budget", "Set the equipment budget and keep track of spending", "business", "a budget helps someone running an event decide what they can still afford when prices change"),
      task("drinks", "Organise the drinks counter so everyone gets served during the break", "hospitality", "people running a service have to spot the slowest step before a queue builds up"),
      task("match-report", "Speak to the players and write the match report in any language", "arts-sciences", "reporters put different people’s accounts together so a reader can follow what happened"),
    ],
  },
  {
    id: "at-home", signal: "task", title: "Which everyday question would you like someone to explain?", tile: 3,
    hint: "Pick the one you would ask another question about.",
    choices: [
      task("hinge", "Why does a cupboard door hang crooked, and what would make it fit?", "engineering", "a small change to one moving part can affect a whole mechanism, a common puzzle in engineering"),
      task("spoon", "Why does a steel spoon feel colder than a wooden one in the same room?", "arts-sciences", "a science investigation can start with an everyday observation and a way to test possible explanations"),
      task("pulse", "What can a nurse learn by checking someone’s pulse?", "health", "nurses use observations like a pulse alongside what a person tells them about how they feel"),
      task("coriander", "How can you tell when a coriander plant needs water?", "agriculture", "deciding when to water a crop means reading signs in both the plant and the soil"),
      task("sort-names", "How does a computer sort names that start with the same letters?", "computing", "sorting names means working out what a computer should do when its first check ends in a tie"),
    ],
  },
  {
    id: "stick-with", signal: "task", title: "Which job would you stick with if it took a few tries?", tile: 2,
    hint: "Think about the bit you would still want to do on the second day.",
    choices: [
      task("debug-score", "Find the step that makes a game give the wrong score", "computing", "programmers test a game with a score they already know, then trace where the result changes"),
      task("accounts", "Read two accounts of a dispute and mark where they disagree", "law", "a lawyer uses points of disagreement to decide which facts need more evidence"),
      task("sales", "Find out why the money in a shop’s cash box doesn’t match its sales book", "business", "checking two records against each other is a way to spot an accounting mistake"),
      task("recovery", "Track small changes in someone’s movement alongside a physiotherapist", "health", "a physiotherapist looks for small changes over several visits to understand what is getting easier"),
      task("redraw", "Change a bag design after someone shows you where the strap digs in", "architecture-design", "a designer can use the spot where a strap hurts to decide how its width or shape should change"),
    ],
  },
  {
    id: "shadow", signal: "task", title: "You can spend an hour with someone at work. What would you watch?", tile: 7,
    hint: "Imagine they have time to show you what they’re doing and answer questions.",
    choices: [
      task("repair", "A cycle mechanic finding out why a wheel keeps rubbing", "engineering", "finding where two moving parts touch helps an engineer explain why a wheel slows down"),
      task("floor-plan", "A designer turning a family’s needs into a floor plan", "architecture-design", "planning a home starts with everyday habits, like who needs quiet space and who needs room to move"),
      task("case-file", "A lawyer deciding which facts matter in a case", "law", "building a case means choosing evidence that supports an argument and explaining why it matters"),
      task("harvest", "A grower checking whether a crop is ready to pick", "agriculture", "judging when to pick a crop affects its quality and how long it will stay fresh"),
      task("kitchen", "A kitchen team getting different dishes ready at the same time", "hospitality", "in a busy kitchen, the dish that takes longest can decide when the whole team needs to start"),
    ],
  },
  {
    id: "priorities", title: "When you look at degrees, what matters most to you?", tile: 0, max: 2,
    hint: "Pick up to two things you want to check first.",
    choices: [
      choice("cost", "How much it costs"), choice("duration", "How many years I’ll study"),
      choice("earning", "How soon I could start earning"), choice("location", "Where I’d have to live or travel"),
      choice("options", "Keeping a few career choices open"),
    ],
  },
];

// A follow-up asks which part of a stated interest appeals. Choosing a different
// kind of work here is allowed. Opening a follow-up carries no signal on its own.
export const closer: Record<string, Question> = {
  computing: {
    id: "closer-computing", signal: "followup", title: "A shop wants a simpler way to handle orders. What would you work on?", tile: 0,
    hint: "You can try any of these on paper first.",
    choices: [
      task("instructions", "Write the steps for a system that keeps each order with the right name", "computing", "building software means making the steps clear enough to work even when two customers have the same name"),
      task("data", "Use the order records to find and check patterns in busy times", "computing", "checking whether a rush repeats over several days is the kind of question a data analyst asks"),
      task("cost", "Work out whether a new ordering system is worth the money", "business", "a business decision can turn on how much time or money a new tool would actually save"),
    ],
  },
  engineering: {
    id: "closer-engineering", signal: "followup", title: "A torch keeps going off. What would you want to figure out?", tile: 1,
    hint: "Imagine a repairer is showing you the torch and its parts.",
    choices: [
      task("mechanism", "How the switch makes the light come on", "engineering", "understanding an electrical product starts with knowing what each part does when it connects to the others"),
      task("test", "Which part stops working when the torch is moved", "engineering", "a fault that comes and goes gives an engineer a chance to change one thing and test it again"),
      task("grip", "How to shape the handle so it’s easier to hold", "architecture-design", "product designers consider how the shape of a handle fits different hands before settling on a design"),
    ],
  },
  "architecture-design": {
    id: "closer-architecture-design", signal: "followup", title: "A neighbour wants to change a small room. What would you try?", tile: 1,
    hint: "You have the sizes of the room and furniture. A rough sketch is enough.",
    choices: [
      task("plan", "Draw two layouts and ask which feels easier to move around in", "architecture-design", "comparing two drawings with the person who uses a room can reveal a problem before any furniture moves"),
      task("shelf", "Sketch a shelf to fit an awkward corner", "architecture-design", "a designer turns limits such as the corner’s width and height into choices about shape and size"),
      task("budget", "Compare the cost of reusing furniture with buying replacements", "business", "comparing repair and replacement costs helps a business decide how to use a limited budget"),
    ],
  },
  business: {
    id: "closer-business", signal: "followup", title: "Someone wants to start a tiffin service. What would you help with?", tile: 4,
    hint: "They’re planning their first week and want a second opinion.",
    choices: [
      task("margin", "Work out what would be left after paying for each meal", "business", "a busy tiffin service can still lose money if its price leaves too little after each meal’s costs"),
      task("demand", "Find out what customers would order and what they would pay", "business", "asking customers what they want helps a business decide how much to prepare before spending on supplies"),
      task("service", "Plan when to cook and pack each dish so the meals arrive fresh", "hospitality", "in food service, the time between cooking and delivery matters to the person who will eat the meal"),
    ],
  },
  "arts-sciences": {
    id: "closer-arts-sciences", signal: "followup", title: "Which of these would you like to spend a day exploring?", tile: 6,
    hint: "Stories, people, maths and science lead to quite different subjects. Pick the bit that interests you.",
    choices: [
      task("writing", "Interview someone and write their story in a language you like", "arts-sciences", "a writer chooses which details to keep while making sure the speaker’s meaning comes through"),
      task("film", "Plan the scenes for a short film or play", "arts-sciences", "a filmmaker or playwright uses the order of scenes to decide what the audience learns and when"),
      task("science", "Test how a shadow changes when you move a light", "arts-sciences", "changing one thing at a time helps a scientist see whether an explanation holds up"),
      task("maths", "Explain why a pattern in numbers keeps repeating", "arts-sciences", "mathematicians look for a reason a pattern will continue beyond the examples they have checked"),
      task("people", "Explore why two people remember the same event differently", "arts-sciences", "psychologists ask how attention and experience can shape what someone later remembers"),
      task("object", "Sketch a new way for a bag to open and try it with someone", "architecture-design", "watching someone try a fastening can show a designer which part needs another sketch"),
    ],
  },
  law: {
    id: "closer-law", signal: "followup", title: "Two people read the same rule differently. What would you like to do?", tile: 5,
    hint: "You get to hear both people explain what happened.",
    choices: [
      task("wording", "Compare the words in the rule with each person’s reading", "law", "in law, even a small change in wording can affect who a rule covers"),
      task("evidence", "Ask what evidence would help decide between the two accounts", "law", "a lawyer asks which piece of evidence could help someone tell two competing explanations apart"),
      task("report", "Write a report so other people can understand both sides", "arts-sciences", "a reporter has to make clear who said what and which details still need checking"),
    ],
  },
  health: {
    id: "closer-health", signal: "followup", title: "Someone is learning to write again after a wrist injury. What interests you?", tile: 7,
    hint: "Imagine they and their therapist are happy to tell you about it.",
    choices: [
      task("movement", "How the therapist checks which movements are still difficult", "health", "seeing which part of an everyday movement is difficult helps a therapist choose what to assess next"),
      task("progress", "How the person and therapist decide whether the exercises are helping", "health", "rehabilitation involves agreeing on a useful goal and checking whether everyday tasks are getting easier"),
      task("pen", "How a different pen shape could make writing easier", "architecture-design", "designers can change the width, weight or shape of a tool to suit the person using it"),
    ],
  },
  agriculture: {
    id: "closer-agriculture", signal: "followup", title: "A grower is planning the next spinach crop. What would you like to work on?", tile: 3,
    hint: "Imagine the grower can show you the field and talk you through each job.",
    choices: [
      task("growing", "Plan when to sow each patch so the whole crop isn’t ready on the same day", "agriculture", "a grower can stagger planting dates to spread the work of picking and selling a crop"),
      task("leaves", "Look for marks on the leaves that might tell you how the plants are doing", "agriculture", "changes in leaves can give a grower an early clue about which plants to inspect more closely"),
      task("irrigation", "Design a simple device that gives each patch the same amount of water", "engineering", "an engineer can compare how much water reaches each patch to see whether a device works as intended"),
    ],
  },
  hospitality: {
    id: "closer-hospitality", signal: "followup", title: "There’s a lunch for a big group. Which part would you like to handle?", tile: 4,
    hint: "You can work with the cooks, the guests or the person looking after the money.",
    choices: [
      task("guests", "Ask guests what they can eat and help them find the right dishes", "hospitality", "good guest service means knowing what is in each dish and helping someone find a meal that suits them"),
      task("timing", "Work backwards from lunchtime so the dishes are ready together", "hospitality", "working back from serving time helps a kitchen team decide which dishes to start first"),
      task("cost", "Compare food bills and decide what the group can afford", "business", "a spending limit gives a business a way to choose between several workable menus"),
    ],
  },
};

export function questionPath(answers: Answers): Question[] {
  const selected = new Set(answers.interests ?? []);
  const followups = [...selected]
    .filter(id => Object.hasOwn(closer, id))
    .slice(0, 2)
    .map(id => closer[id]);
  return [...core.slice(0, 3), ...followups, ...core.slice(3)];
}

export function orderedChoices(question: Question, seed: number): Choice[] {
  if (question.id === "stage") return question.choices;
  const count = question.choices.length;
  const start = (seed + [...question.id].reduce((sum, letter) => sum + letter.charCodeAt(0), 0)) % count;
  return [...question.choices.slice(start), ...question.choices.slice(0, start)];
}
