export const version = "srm-course-families-v5";
export const noFit = "none-fit";
export const notTried = "not-tried";
export type Answers = Record<string, string[]>;

export type Choice = { id: string; label: string; tile?: number };
type Scene = "corner" | "visit";
export type Question = {
  id: string;
  title: string;
  hint: string;
  tile: number;
  choices: Choice[];
  max?: number;
  signal?: "task" | "followup" | "aversion";
  parentId?: Scene;
};

function option(id: string, label: string): Choice {
  return { id, label };
}

export const stages = [
  option("class-10", "Class 10"), option("class-11", "Class 11"),
  option("class-12", "Class 12"), option("finished", "Finished school"),
];

export const core: Question[] = [
  {
    id: "stage", title: "Where are you in school right now?", tile: 0,
    hint: "This helps us suggest something you can try this year.",
    choices: stages,
  },
  {
    id: "corner", signal: "task", tile: 0,
    title: "A space near home opens on Sundays. What would you try there?",
    hint: "Someone will bring the materials and help you get started.",
    choices: [
      option("lend", "Start a lending shelf. Keep the last item from being promised twice."),
      option("brace", "Try two supports under a shelf. See which takes more books."),
      option("pots", "Grow something edible in two spots. See where it does better."),
      option("welcome", "Move the chairs around and see where people actually choose to sit."),
      option("stories", "Ask neighbours what used to be here. Tell their stories in any language."),
      option("costs", "Price a snack so people can afford it and the ingredients get paid for."),
      option("photos", "Work out whether a folder of old photos marked ‘for Sundays’ was lent or given."),
    ],
  },
  {
    id: "visit", signal: "task", tile: 0,
    title: "Some families are visiting for an afternoon. What would you take care of?",
    hint: "You can spend the afternoon with visitors or quietly sort something out beforehand.",
    choices: [
      option("serve", "Keep a snack fresh and hot for the people arriving last."),
      option("pauses", "Walk with someone who tires easily. Notice what helps them carry on."),
      option("directions", "Draw a map. Change the bit where the first person loses their way."),
      option("fares", "Bus fares have gone up. Keep the outing within everyone’s budget."),
      option("promise", "Look at what two groups were promised before deciding who gets the room."),
      option("handoff", "Try different spots for a loudspeaker until the people at the back can hear."),
    ],
  },
  {
    id: "another-go", signal: "task", tile: 0,
    title: "It needs another go. Which job would you come back to tomorrow?",
    hint: "Think about the part you would still want to do once the first bit of excitement has worn off.",
    choices: [
      option("wobble", "Change one joint on a wobbly stand and test it again with the same weight."),
      option("orders", "Describe the folds without showing the finished paper shape. See which step needs explaining."),
      option("draft", "Read a story aloud. Change the bit where someone lost the thread."),
      option("ripeness", "Change the lining in a grower’s crate. Check what gets bruised on the journey."),
      option("buttons", "Sit with someone who finds buttons difficult. Let them show you which movement catches."),
      option("accounts", "Notice who a rule for taking turns leaves out. Try a fair exception."),
      option("hosting", "Set up a place to stay using what the last overnight guest found missing."),
    ],
  },
  {
    id: "notice", signal: "task", tile: 0,
    title: "Which small thing would make you stop for a second look?",
    hint: "Pick the question you’d want to follow up, even if you don’t know the answer.",
    choices: [
      option("line", "A game has three moves. Would someone’s trick still work if the first move changed?"),
      option("takings", "Why do people return to one stall when the same thing costs less next door?"),
      option("carry", "Two bags weigh the same. Why does only one strap dig into your shoulder?"),
      option("servings", "A newcomer settles into a crowded gathering without asking for help. What made that easy?"),
      option("greens", "After rain, soil washes off one slope but stays on the next. What’s different?"),
      option("cup", "One side of a wall dries hours before the other. How could you find out why?"),
      option("ill", "Several people felt unwell after an outing. What did their days have in common?"),
    ],
  },
  {
    id: "one-hour", signal: "aversion", tile: 0,
    title: "Someone can take one job off your hands. Which would you gladly hand over?",
    hint: "Imagine you know how to do each one. Pick the part you’d least enjoy.",
    choices: [
      option("till", "Checking every receipt against the cash because the totals are a few rupees apart."),
      option("retries", "Trying different names and dates on a booking to catch the mix-ups."),
      option("refit", "Taking a loose part off and fitting it again until it stays put."),
      option("check-in", "Coming back several times to track small changes in how easily someone can move."),
      option("versions", "Reading both accounts of a disagreement and checking which details hold up."),
      option("waiting", "Looking after a group when several people ask for different things at once."),
    ],
  },
  {
    id: "leave-out", signal: "aversion", max: 2, tile: 0,
    title: "What would start to wear you out after a few weeks?",
    hint: "You can choose up to two, even if you like other parts of the activity.",
    choices: [
      option("rounds", "Going back at the same time each day to record even tiny changes."),
      option("redraw", "Reworking something because people use it differently from the way you expected."),
      option("rewrite", "Rewording an account until someone who wasn’t there can follow exactly what happened."),
      option("handover", "Finishing your part just as someone else starts theirs, with little room to change pace."),
      option("accuracy", "Repeating a whole check because one missed detail leaves you unsure of the result."),
      option("listening", "Spending a long time in conversation before someone can put a problem into words."),
    ],
  },
  {
    id: "priorities", max: 2, tile: 0,
    title: "When you look at degrees, what matters most to you?",
    hint: "Pick up to two things you want to check first.",
    choices: [
      option("cost", "How much it costs"), option("duration", "How many years I’ll study"),
      option("earning", "How soon I could start earning"), option("location", "Where I’d have to live or travel"),
      option("options", "Keeping a few career choices open"),
    ],
  },
];

function nextScene(parentId: Scene, trigger: string, title: string, hint: string, choices: Choice[]): Question {
  return { id: "closer-" + trigger, parentId, title, hint, choices, signal: "followup", tile: 0 };
}

// Each follow-up stays inside the scene the student picked. Its three options
// let them change direction or show what actually interested them in that job.
export const closer: Record<string, Question> = {
  lend: nextScene("corner", "lend", "Two people want the last board game. What interests you now?",
    "You’ve heard why both of them want it.", [
      option("clash", "Try a few combinations of names and times to see which clashes your lending system misses."),
      option("exception", "Decide what would make an exception fair, and whether the same rule would work for the next person."),
      option("return", "Make it easier to see what’s available when someone looks at the shelf."),
    ]),
  brace: nextScene("corner", "brace", "The shelf holds a few books. What would you try next?",
    "There’s time for one more change.", [
      option("load", "Move one support and find out where the shelf starts to bend."),
      option("reach", "Ask two people to reach for a book. Try a height both can use comfortably."),
      option("spend", "Compare the cost of another support with the extra space it would give."),
    ]),
  pots: nextScene("corner", "pots", "One of the pots is doing better. What are you curious about?",
    "You can try something next Sunday and come back to see what happens.", [
      option("drain", "Feel the soil in both pots and decide whether to change how often each gets watered."),
      option("test", "Keep the soil and water the same. Change just the light to check your explanation."),
      option("stand", "Try a stand that holds both pots steady and lets extra water escape."),
    ]),
  welcome: nextScene("corner", "welcome", "Some chairs fill up and others stay empty. What would you try?",
    "There’s room to change how people use the space.", [
      option("turn", "Turn one row to face the group. See if the gap people avoid moves with it."),
      option("join", "Welcome someone arriving alone and help them find a group they’d like to sit with."),
      option("rest", "Ask someone who finds getting up difficult what helps. Watch what changes when they try another chair."),
    ]),
  stories: nextScene("corner", "stories", "Two people remember the old place differently. Which bit draws you in?",
    "Both are happy to talk a little more.", [
      option("cut", "Try two openings for the piece and see which makes someone want to hear the rest."),
      option("verify", "Work out which detail they both saw and which claim would need another witness."),
      option("voices", "Keep both voices in the piece so someone listening can hear how differently they remember it."),
    ]),
  costs: nextScene("corner", "costs", "Your snack idea could work. Which detail would you like to settle?",
    "The stall only opens once a week.", [
      option("portion", "See how a smaller portion changes the price people pay and the amount left after costs."),
      option("rush", "Arrange the serving space so two people can get snacks out without getting in each other’s way."),
      option("waste", "See which fruit keeps well between Sundays and which needs picking or buying later."),
    ]),
  photos: nextScene("corner", "photos", "Nobody is sure whether the photos can stay. What would you follow up?",
    "Someone remembers the day the folder was handed over.", [
      option("say", "Compare what was said that day with the words on the note."),
      option("story", "Ask how those photos ended up together. Tell the story behind the collection."),
      option("display", "Try a way to display the photos that lets them go back into the folder unharmed."),
    ]),
  serve: nextScene("visit", "serve", "The last group is running late. What would you pay attention to?",
    "The people who have arrived are ready to eat.", [
      option("batch", "Split the cooking into two batches so both groups get food while it’s hot."),
      option("balance", "Compare the cost of keeping food ready with making a smaller second batch."),
      option("hand", "Someone finds the bowl awkward to hold. Watch where their grip slips and ask what feels easier."),
    ]),
  pauses: nextScene("visit", "pauses", "Your walking companion wants to keep going. What would you help with?",
    "They can tell you what feels comfortable.", [
      option("pattern", "Notice which stretches take more effort and whether resting makes the next one easier."),
      option("seats", "Mark where a seat or a different path would make the walk easier to use."),
      option("invite", "Find somewhere the whole group would enjoy stopping together."),
    ]),
  directions: nextScene("visit", "directions", "Someone using your map missed a turn. What would you change?",
    "They can show you the point where they went wrong.", [
      option("landmark", "Redraw that part around something people can see from both directions."),
      option("sequence", "Try the instructions from different starting points and work out which step sends people the wrong way."),
      option("tell", "Find a few words for the turn that someone will remember after hearing them once."),
    ]),
  fares: nextScene("visit", "fares", "Two people join at the last minute. What would you sort out first?",
    "Some people have already paid for part of the trip.", [
      option("trade", "See which change to the plan saves money without losing the part people care about most."),
      option("share", "Hear what each person was told about paying, and decide what would be fair to ask now."),
      option("rule", "Find a way to update everyone’s share whenever someone joins or leaves, without starting over."),
    ]),
  promise: nextScene("visit", "promise", "Both groups show you their messages about the room. What now?",
    "You can look at the messages in the order they were sent.", [
      option("word", "Check whether each message confirms the room or only says it might be free."),
      option("piece", "Piece together the story so someone who wasn’t there can follow both versions."),
      option("plan", "Find places for both groups where they’ll feel welcome while the room issue gets sorted out."),
    ]),
  handoff: nextScene("visit", "handoff", "People at the back can hear a voice, but not the words. What would you try?",
    "You can ask someone to listen while you try a change.", [
      option("repeat", "Move the loudspeaker, keeping the listener in one spot. See what changes."),
      option("listen", "Listen for the words that run together. Try different pauses when saying them aloud."),
      option("welcome", "Find the people who missed the announcement and help them get where they need to go."),
    ]),
};

export function questionPath(answers: Answers): Question[] {
  const followups: Question[] = [];
  for (const parentId of ["corner", "visit"] as const) {
    const selected = answers[parentId];
    if (selected?.length !== 1 || !Object.hasOwn(closer, selected[0])) continue;
    const question = closer[selected[0]];
    if (question.parentId === parentId) followups.push(question);
  }
  return [...core.slice(0, 3), ...followups, ...core.slice(3)];
}

export function orderedChoices(question: Question, seed: number): Choice[] {
  if (question.id === "stage") return question.choices;
  // Stable in this tab on Back or reload. Each question gets its own shuffle.
  let state = seed >>> 0;
  for (const letter of question.id) state = Math.imul(state ^ letter.charCodeAt(0), 16777619) >>> 0;
  state ||= 1;
  const choices = [...question.choices];
  for (let i = choices.length - 1; i > 0; i--) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const index = Math.floor((state >>> 0) / 4294967296 * (i + 1));
    [choices[i], choices[index]] = [choices[index], choices[i]];
  }
  return choices;
}
