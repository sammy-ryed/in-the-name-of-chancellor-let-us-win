import type { Course } from "./academic";
import { familyFor } from "./course-families";

type CareerProfile = {
  occupation: string;
  role: string;
  work: string;
  skills: string;
  next: string;
  project: string;
  assist: string;
  judgement: string;
  practice: string;
};

// Examples describe work that a student can investigate, not SRM placement outcomes.
const profiles = {
  software: {
    occupation: "15-1252.00", role: "Junior software developer", work: "Turn a feature request into a small change, test it and explain the result in a code review.",
    skills: "Programming, debugging, version control and clear test cases.", next: "Move towards product engineering, systems work or postgraduate computing.",
    project: "Build a library reservation tool that handles two students asking for the last copy.",
    assist: "Suggest a first set of tests.", judgement: "Decide which failures would affect a real user.", practice: "Explain an edge case and write a test for it.",
  },
  ai: {
    occupation: "15-2051.00", role: "Machine-learning engineer trainee", work: "Prepare examples, train a baseline and inspect the cases a model gets wrong.",
    skills: "Python, statistics, model evaluation and careful lab notes.", next: "Explore applied ML engineering or more mathematical postgraduate study.",
    project: "Train a model to classify handwritten digits, then catalogue the mistakes.",
    assist: "Draft a training script.", judgement: "Check whether the test set reflects the people who will use the model.", practice: "Compare a model with a simple baseline.",
  },
  data: {
    occupation: "15-2051.01", role: "Junior data analyst", work: "Clean a dataset, check how it was collected and explain a change in the numbers.",
    skills: "SQL, statistics, charts and explaining uncertainty.", next: "Build towards analytics engineering, business intelligence or postgraduate statistics.",
    project: "Use a week of canteen queues to test whether a second counter shortens the wait.",
    assist: "Produce a first chart.", judgement: "Spot a misleading sample before a team acts on it.", practice: "Tell a colleague what the data cannot answer.",
  },
  civil: {
    occupation: "17-2051.00", role: "Graduate civil engineer", work: "Read drawings, check measurements on site and record discrepancies for a supervisor.",
    skills: "Technical drawing, measurement and site communication.", next: "Specialise in structures, construction management or transport.",
    project: "Compare two footbridge layouts for span, access and material use.",
    assist: "Summarise a set of site notes.", judgement: "Verify a measurement before a drawing changes.", practice: "Keep a traceable measurement log.",
  },
  electronics: {
    occupation: "17-3023.00", role: "Electronics test engineer trainee", work: "Set up a bench test, measure a signal and trace a fault against a schematic.",
    skills: "Circuit reading, instrumentation and recording test conditions.", next: "Explore embedded systems, energy systems or chip design.",
    project: "Build a sensor logger and measure how its readings drift over time.",
    assist: "Suggest candidate tests from a specification.", judgement: "Check that a test is safe and measures the intended behaviour.", practice: "Explain a noisy measurement with a second test.",
  },
  mechanical: {
    occupation: "17-2141.00", role: "Graduate design or test engineer", work: "Compare a prototype with its drawing, record a test and suggest a change.",
    skills: "CAD, materials, tolerances and practical testing.", next: "Explore design, manufacturing, controls or a specialist engineering master’s.",
    project: "Build a folding stand and test how its load limit changes with the joint design.",
    assist: "Draft test notes from readings.", judgement: "Check that a part is fit for the expected load.", practice: "Document what failed and repeat the test.",
  },
  process: {
    occupation: "51-9061.00", role: "Process or quality trainee", work: "Monitor a production run, inspect variation and record where a process leaves specification.",
    skills: "Measurement, process diagrams and working within safety procedures.", next: "Explore manufacturing quality, materials research or postgraduate engineering.",
    project: "Trace where a small production process wastes water and propose one measurable change.",
    assist: "Highlight unusual measurements.", judgement: "Distinguish a faulty reading from an actual process change.", practice: "Repeat a measurement under controlled conditions.",
  },
  life: {
    occupation: "19-4021.00", role: "Laboratory or research assistant", work: "Prepare materials, label samples and document observations so someone else can repeat the work.",
    skills: "Careful handling, quality checks and recording methods.", next: "A subject-specific master’s can lead into specialised research.",
    project: "Compare how seedlings respond to different light levels and record each observation.",
    assist: "Organise observations into a first table.", judgement: "Identify a sample mix-up or an uncontrolled condition.", practice: "Write a reproducible method.",
  },
  architecture: {
    occupation: "17-3011.00", role: "Architecture studio assistant", work: "Measure a site and turn a brief into drawings for review by the project architect.",
    skills: "Scale drawing, spatial reasoning, materials and listening to a client.", next: "Check the Council of Architecture’s registration requirements before practising as an architect.",
    project: "Redraw a library entrance so a wheelchair user can reach the desk.",
    assist: "Generate alternative layouts for review.", judgement: "Check clearances, access and what the site actually allows.", practice: "Take a measured survey and defend one design choice.",
  },
  design: {
    occupation: "27-1021.00", role: "Junior designer or studio assistant", work: "Interpret a brief, prototype alternatives and revise one after observing how people use it.",
    skills: "Sketching, material choices and communicating with a maker.", next: "Build a portfolio for a specialist studio or postgraduate design.",
    project: "Make two prototypes of a reading corner, a garment or a tool and let someone try them.",
    assist: "Generate variations on a rough sketch.", judgement: "Choose a design someone can use and a maker can produce.", practice: "Record what changes after a prototype test.",
  },
  business: {
    occupation: "13-1111.00", role: "Business operations associate", work: "Follow an order through a team, spot a delay and prepare a short report for the manager.",
    skills: "Spreadsheets, concise writing and interpreting operating costs.", next: "Gain experience in operations, marketing or further management study.",
    project: "Plan a school café for a day and compare your forecast with actual sales.",
    assist: "Draft a weekly summary.", judgement: "Check which conclusion the underlying figures support.", practice: "Explain a variance without hiding assumptions.",
  },
  accounting: {
    occupation: "43-3031.00", role: "Accounts or audit assistant", work: "Reconcile entries against invoices and raise exceptions with the person responsible.",
    skills: "Bookkeeping, spreadsheets, attention to detail and documentation.", next: "Professional accounting qualifications have their own exams and training requirements.",
    project: "Build a cashbook for an event and reconcile its closing balance.",
    assist: "Group similar transactions.", judgement: "Check original documents before accepting an entry.", practice: "Trace a discrepancy back to its source.",
  },
  media: {
    occupation: "27-3041.00", role: "Editorial or production assistant", work: "Research a brief, organise material and revise an edit against the editor’s feedback.",
    skills: "Story structure, editing, checking rights and verifying sources.", next: "Build a portfolio for reporting, production, publishing or postgraduate media work.",
    project: "Produce a one-minute portrait of someone who works at your school.",
    assist: "Transcribe recorded material.", judgement: "Check permission, accuracy and whether an edit changes someone’s meaning.", practice: "Fact-check a quote against the original recording.",
  },
  research: {
    occupation: "19-4061.00", role: "Research or project assistant", work: "Gather material, compare sources and turn evidence into a short, readable finding.",
    skills: "Research methods, critical reading and writing for a specific audience.", next: "Investigate postgraduate study in your subject or research support roles.",
    project: "Investigate a claim about your neighbourhood using two independent sources.",
    assist: "Group notes by topic.", judgement: "Decide what counts as reliable evidence for the question.", practice: "Trace every important claim to its source.",
  },
  education: {
    occupation: "25-9042.00", role: "Teaching or learning-support trainee", work: "Plan an activity, observe how a learner approaches it and adjust the next explanation.",
    skills: "Lesson design, observation and accessible communication.", next: "School teaching posts can require additional eligibility tests or subject qualifications.",
    project: "Teach a ten-minute skill and revise the exercise after watching a learner try it.",
    assist: "Draft practice questions.", judgement: "Decide whether an activity meets this learner’s needs.", practice: "Ask a learner to explain their reasoning.",
  },
  science: {
    occupation: "19-4031.00", role: "Technical or research assistant", work: "Run a controlled measurement, compare it with a prediction and document the uncertainty.",
    skills: "Experimental design, quantitative reasoning and clear records.", next: "Specialist research roles often involve a subject-specific master’s or doctorate.",
    project: "Test how the temperature of water changes through two different insulating materials.",
    assist: "Organise readings and suggest a graph.", judgement: "Check whether the instrument and method support the conclusion.", practice: "Estimate how much a repeated measurement could vary.",
  },
  law: {
    occupation: "23-2011.00", role: "Legal research or compliance assistant", work: "Find the current rule, check the original text and prepare a note explaining its application.",
    skills: "Close reading, source checking, structured argument and drafting.", next: "For legal practice, check degree recognition and enrolment requirements with the Bar Council.",
    project: "Write both sides of a mock dispute using the same evidence.",
    assist: "Suggest a first outline for a case note.", judgement: "Verify the authority, jurisdiction and every citation.", practice: "Read a judgment and separate its ruling from the background.",
  },
  justice: {
    occupation: "19-4061.00", role: "Policy or justice research assistant", work: "Review case material and compare policy options against the available evidence.",
    skills: "Research, careful interpretation and concise policy writing.", next: "Explore postgraduate criminology, policy or legal studies. This BA is distinct from an LL.B.",
    project: "Compare two approaches to a local safety issue using published evidence.",
    assist: "Group policy documents by topic.", judgement: "Check whether a policy conclusion follows from the evidence.", practice: "Verify each source and date.",
  },
  clinical: {
    occupation: "31-9092.00", role: "Supervised clinical trainee in the named discipline", work: "Prepare for a supervised session, check equipment and record observations for the clinical team.",
    skills: "Patient communication, accurate records and working within clinical protocols.", next: "Check the professional registration, internship and supervision rules for this exact qualification.",
    project: "Make a patient-friendly guide to what happens during a first appointment.",
    assist: "Draft general appointment instructions.", judgement: "Check clinical accuracy, privacy and what the patient has understood.", practice: "Explain an unfamiliar procedure in everyday language.",
  },
  nursing: {
    occupation: "29-1141.00", role: "Staff nurse after registration", work: "Observe a patient, document changes and hand over priorities to the next shift.",
    skills: "Patient communication, observation and reliable handovers.", next: "Check State Nursing Council registration and requirements for the role.",
    project: "Design a shift handover sheet using a fictional patient case.",
    assist: "Structure a draft handover.", judgement: "Verify observations and decide what needs escalation.", practice: "Give a concise supervised handover.",
  },
  pharmacy: {
    occupation: "29-2052.00", role: "Pharmacy trainee", work: "Check records, identify discrepancies and explain approved medicine instructions under supervision.",
    skills: "Accuracy, professional communication and medicine information.", next: "Check the registration route for pharmacist roles and the requirements of clinical or industrial roles.",
    project: "Test whether a fictional medicine label can be read correctly at a glance.",
    assist: "Draft a plain-language information sheet.", judgement: "Verify all medicine information against approved references.", practice: "Explain an instruction and check how it was understood.",
  },
  agri: {
    occupation: "19-4012.00", role: "Field or horticulture assistant", work: "Inspect a plot, record crop conditions and discuss changes with growers.",
    skills: "Field observation, practical trials and communicating local conditions.", next: "Explore extension, nursery management, agribusiness or postgraduate crop science.",
    project: "Compare growth from two watering schedules in a small trial plot.",
    assist: "Summarise field observations.", judgement: "Inspect a plant and check soil and weather before advising a grower.", practice: "Keep a field notebook across several weeks.",
  },
  hotel: {
    occupation: "43-4081.00", role: "Hotel operations trainee", work: "Coordinate arrivals, check room readiness and help resolve a guest’s request across departments.",
    skills: "Service recovery, teamwork, scheduling and clear communication.", next: "Move into rooms, food and beverage, events or a management traineeship.",
    project: "Plan a breakfast service for 30 guests with two staff and a short turnaround.",
    assist: "Draft a shift plan from expected bookings.", judgement: "Adapt it when a guest needs extra help or a room is delayed.", practice: "Handle a service problem and follow up with the guest.",
  },
  medicine: {
    occupation: "29-1215.00", role: "Medical intern, then a junior medical officer", work: "Take a history under supervision, prepare a case summary and hand over questions for the next round.",
    skills: "Listening, clinical reasoning and accurate patient records.", next: "Check the internship and registration requirements before independent practice.",
    project: "Use a fictional case to write and present a one-minute handover.",
    assist: "Arrange fictional notes into a handover template.", judgement: "Verify every detail against the original record and raise uncertainty with the supervising clinician.", practice: "Explain what is known and which question remains open.",
  },
  dental: {
    occupation: "29-1021.00", role: "Dental intern, then a general dentist", work: "Record a patient’s dental history, assist in a supervised clinic and explain follow-up instructions.",
    skills: "Manual precision, observation and clear communication.", next: "Check internship and registration requirements for dental practice or explore postgraduate specialities.",
    project: "Design an illustrated guide to a first dental visit.",
    assist: "Draft plain-language wording for an appointment leaflet.", judgement: "Check the explanation against the clinician’s instructions and the patient’s questions.", practice: "Explain a supervised procedure without jargon.",
  },
  clinicalLab: {
    occupation: "29-2011.00", role: "Medical laboratory technologist", work: "Track a specimen through the laboratory, check labels and record a result for review.",
    skills: "Specimen identification, quality control and careful documentation.", next: "Compare clinical postings, supervised practice and registration requirements for the specific degree.",
    project: "Build a mock tracking sheet using fictional specimen IDs and find a labelling error.",
    assist: "Flag a missing field in a batch of records.", judgement: "Resolve the discrepancy with the original record before releasing a result.", practice: "Create a quality-control log that another person can follow.",
  },
  imaging: {
    occupation: "29-2034.00", role: "Radiography or imaging technologist", work: "Prepare an examination room, check the imaging request with the team and document image quality.",
    skills: "Patient positioning, imaging equipment and safety checks.", next: "Compare supervised imaging placements and training for individual modalities.",
    project: "Plan a mock imaging-room workflow with a handover at every safety check.",
    assist: "Sort image-quality notes into categories.", judgement: "Verify identity, instructions and the quality of the acquisition with the supervising team.", practice: "Explain a quality check in language a patient would understand.",
  },
  physio: {
    occupation: "29-1123.00", role: "Physiotherapy trainee", work: "Observe movement with a supervisor, record a baseline and track a patient’s progress over several sessions.",
    skills: "Movement observation, communication and consistent measurement.", next: "Explore supervised rotations and later specialisation in rehabilitation, sport or neurology.",
    project: "Use a fictional case to design a clear weekly progress record.",
    assist: "Put progress measurements into a simple chart.", judgement: "Check whether the comparison is fair and ask what the patient finds difficult.", practice: "Document a change clearly enough for the next therapist to follow.",
  },
  occupational: {
    occupation: "29-1122.00", role: "Occupational therapy trainee", work: "Observe an everyday activity and discuss with a supervisor how the task or setting could be adapted.",
    skills: "Task analysis, accessible design and collaborative goal-setting.", next: "Compare placements in rehabilitation, community practice and daily-living support.",
    project: "Redesign a school desk setup around a fictional student’s daily routine.",
    assist: "Generate alternative layouts from a design brief.", judgement: "Ask the person whether the proposed change supports their own goals.", practice: "Test a simple adaptation and document the feedback.",
  },
  eye: {
    occupation: "29-1041.00", role: "Optometry trainee", work: "Prepare vision-testing equipment, record observations and explain the next step under supervision.",
    skills: "Optical measurement, consistency and clear patient instructions.", next: "Check clinical internship expectations and further training in vision care.",
    project: "Design a clear instruction card for a mock vision screening station.",
    assist: "Draft alternative wording for instructions.", judgement: "Verify that the wording supports the correct procedure and the person understands it.", practice: "Practise giving consistent instructions.",
  },
  speech: {
    occupation: "29-1127.00", role: "Audiology or speech-language trainee", work: "Take part in supervised communication assessments, prepare materials and record observations.",
    skills: "Listening, accurate transcription and adapting instructions.", next: "Check recognised qualifications and registration for the scope of practice you want.",
    project: "Create a pictorial communication board for a fictional school activity.",
    assist: "Suggest alternative visual prompts for the same activity.", judgement: "Check cultural and language fit with the person using the prompts.", practice: "Listen for what someone is trying to communicate and confirm your interpretation.",
  },
  dietitian: {
    occupation: "29-1031.00", role: "Dietetics trainee", work: "Gather a food history with a supervisor, review a menu and explain agreed changes in everyday language.",
    skills: "Interviewing, food composition and careful interpretation.", next: "Compare supervised training and the qualifications employers request for clinical roles.",
    project: "Analyse the variety and cost of a fictional canteen menu.",
    assist: "Summarise a sample menu into food categories.", judgement: "Check quantities, missing information and the practical realities of the household.", practice: "Compare two menus within the same budget.",
  },
  perioperative: {
    occupation: "29-2055.00", role: "Operating theatre technologist trainee", work: "Help check a theatre setup, record equipment counts and communicate a discrepancy to a supervisor.",
    skills: "Team communication, equipment identification and following protocols.", next: "Compare theatre and anaesthesia postings and supervised training for the named qualification.",
    project: "Design a paper checklist for a fictional theatre equipment handover.",
    assist: "Turn a draft inventory into a checklist.", judgement: "Verify every item physically with the team before signing the record.", practice: "Give an accurate handover under supervision.",
  },
  cardiac: {
    occupation: "29-2031.00", role: "Cardiovascular technology trainee", work: "Prepare equipment and record measurements for a supervising cardiovascular team.",
    skills: "Instrumentation, accurate timing and team communication.", next: "Compare the different clinical rotations for cardiac care and perfusion before choosing a course.",
    project: "Build a log that keeps fictional equipment readings tied to the correct time.",
    assist: "Highlight unusual variation in a set of example readings.", judgement: "Check the equipment and context with the supervisor before interpreting a change.", practice: "Keep a complete and traceable record.",
  },
  physicianAssistant: {
    occupation: "29-1071.00", role: "Physician associate trainee", work: "Prepare a case history for the supervising clinician and help the team track follow-up questions.",
    skills: "Observation, medical documentation and clear handovers.", next: "Check the supervised role description and internship for each employer or department.",
    project: "Arrange a fictional patient history into a clear timeline.",
    assist: "Suggest an outline for a case summary.", judgement: "Verify the original history and identify questions that need a clinician’s review.", practice: "Summarise the patient’s own concern accurately.",
  },
  respiratory: {
    occupation: "29-1126.00", role: "Respiratory technology trainee", work: "Prepare respiratory equipment under supervision, collect observations and document them for review.",
    skills: "Equipment checks, observation and teamwork.", next: "Review supervised respiratory-care rotations and the qualification listed by each employer.",
    project: "Draw a mock equipment handover with named checks and responsibilities.",
    assist: "Organise maintenance records for review.", judgement: "Confirm the actual equipment status with the responsible clinical team.", practice: "Record and communicate an unresolved check.",
  },
  paramedic: {
    occupation: "29-2043.00", role: "Emergency medical technology trainee", work: "Support a supervised emergency team, prepare equipment and give a concise case handover.",
    skills: "Situational awareness, communication and accurate recording.", next: "Compare supervised ambulance and emergency department placements.",
    project: "Design a timed handover exercise using a fictional incident report.",
    assist: "Organise a fictional incident timeline.", judgement: "Verify the sequence with the crew before entering it into the record.", practice: "Communicate changes clearly under time pressure.",
  },
  publicHealth: {
    occupation: "19-1041.00", role: "Public health project assistant", work: "Check a survey for missing information and help a team explain differences between communities.",
    skills: "Data quality, population measures and communication.", next: "Compare the integrated MPH field placement and quantitative methods modules.",
    project: "Investigate how the choice of survey respondents changes a result.",
    assist: "Suggest a first chart from anonymous example data.", judgement: "Decide whether a difference reflects sampling, missing data or a real pattern.", practice: "Explain a limitation before reporting a finding.",
  },
} satisfies Record<string, CareerProfile>;

function profileKey(c: Course): keyof typeof profiles | null {
  if (c.level !== "Undergraduate") return null;
  const name = c.name.toLowerCase();
  switch (familyFor(c)) {
    case "computing":
      if (/data science|data analytics|big data/.test(name)) return "data";
      if (/artificial intelligence|machine learning|agentic ai|generative ai|^ai /.test(name)) return "ai";
      return "software";
    case "engineering":
      if (/^civil/.test(name)) return "civil";
      if (/^biotech/.test(name)) return "life";
      if (/electr|semiconductor|instrumentation|renewable energy/i.test(name)) return "electronics";
      if (/chemical|nano|quantum/i.test(name)) return "process";
      return "mechanical";
    case "architecture-design": return /arch/i.test(c.degree) ? "architecture" : "design";
    case "business": return /b\.?com/i.test(c.degree) ? "accounting" : /data science/i.test(name) ? "data" : "business";
    case "arts-sciences":
      if (/journalism|film|visual comm|english/.test(name)) return "media";
      if (/biomed|biotech/.test(name)) return "life";
      if (/^education|physical education/.test(name)) return "education";
      if (/math|statistics/.test(name)) return "data";
      if (/physic|chemistry/.test(name)) return "science";
      return "research";
    case "law": return /criminology|technology and law/i.test(name) ? "justice" : "law";
    case "health":
      if (/nursing|b\.sc\(n\)/i.test(name)) return "nursing";
      if (/pharm/i.test(c.degree + name)) return "pharmacy";
      if (/medicine and bachelor of surgery/.test(name)) return "medicine";
      if (/dental surgery/.test(name)) return "dental";
      if (/laboratory/.test(name)) return "clinicalLab";
      if (/radiology|imaging/.test(name)) return "imaging";
      if (/physiotherapy/.test(name)) return "physio";
      if (/occupational therapy/.test(name)) return "occupational";
      if (/optometry/.test(name)) return "eye";
      if (/audiology/.test(name)) return "speech";
      if (/nutrition|dietetics/.test(name)) return "dietitian";
      if (/operation theatre|anaesthesia/.test(name)) return "perioperative";
      if (/cardiac|perfusion/.test(name)) return "cardiac";
      if (/physician assist|physician associ/.test(name)) return "physicianAssistant";
      if (/respiratory/.test(name)) return "respiratory";
      if (/paramedic/.test(name)) return "paramedic";
      if (/mph|public health/.test(name)) return "publicHealth";
      return "clinical";
    case "agriculture": return "agri";
    case "hospitality": return "hotel";
    default: return null;
  }
}
export function careerFor(c: Course) {
  const key = profileKey(c);
  if (!key) return null;
  const { occupation, ...profile } = profiles[key];
  return {
    ...profile,
    roleSource: { label: "Related tasks · US O*NET, 2026", href: "https://www.onetonline.org/link/summary/" + occupation },
  };
}
