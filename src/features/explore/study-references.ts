type StudyReference = {
  edition: string;
  focus: string;
  taught?: string;
  elective?: string;
  practical?: string;
  source: string;
  sourceLabel: string;
};

const asset = "https://webstor.srmist.edu.in/web_assets/";
const scienceOverview = asset + "downloads/application/bs-cs/";
const pharmacy: StudyReference = {
  edition: "B.Pharm · Regulations 2017, from the 2017–18 intake. Confirm the regulations in your offer.",
  focus: "Learn how medicines are formulated and how their composition is measured.",
  taught: "The first semester includes pharmaceutical analysis and inorganic chemistry.",
  practical: "A pharmaceutical analysis practical accompanies the theory course. The schedule assigns four practical hours per week.",
  source: "https://www.srmup.in/Uploads/image/339imguf_srm-bpharm-syllabus-regulation-2017.pdf", sourceLabel: "SRMIST pharmacy curriculum",
};
const references: Record<string, StudyReference | undefined> = {
  "230f1c469fa": {
    edition: "Kattankulathur · BBA · Regulations 2024, academic year 2024–25. The three-year exit follows semester six.",
    focus: "Work through how an organisation pays for a project, reaches its customers and delivers the work.",
    taught: "Financial Accounting, Marketing Management and Project Management feature in this curriculum.",
    elective: "Retail Marketing is a semester-six discipline-specific elective.",
    practical: "Students begin their major project in semester five and complete its assessment in semester six.",
    source: "https://webstor.srmist.edu.in/web_assets/downloads/2026/bba-regulations-2024.pdf",
    sourceLabel: "SRM BBA curriculum",
  },
  "ecaa6310de3": {
    edition: "Kattankulathur · three-year BA English · academic year 2020–21. Check the current edition for your intake.",
    focus: "Read closely across literary traditions, trace how a work makes its argument and develop your own writing.",
    taught: "The required papers include American Literature I, Indian Classical Literature and Indian Aesthetic Theory.",
    elective: "Creative Non-Fiction and Environmental Literature are discipline-specific options.",
    practical: "The dissertation is an elective project in this edition.",
    source: "https://www.srmup.in/Uploads/prospectus/35crsfile_Syllabus2.pdf",
    sourceLabel: "SRM BA English curriculum",
  },
  "83388e2d08d": {
    edition: "Kattankulathur · three-year BA Journalism and Mass Communication · Regulations 2020, academic year 2020–21. Confirm the edition for your intake.",
    focus: "Gather evidence, check a source and decide how to report a story in print, audio or a visual format.",
    taught: "Broadcast Journalism, Media Laws and Ethics, and Data Journalism are core papers.",
    elective: "Documentary Making is a discipline-specific elective.",
    practical: "Essentials of Reporting includes four practical hours per week.",
    source: "https://webstor.srmist.edu.in/web_assets/downloads/2023/jmc-ug-syllabus-2020.pdf",
    sourceLabel: "SRM journalism curriculum",
  },
  "896e5ba57df": {
    edition: "Kattankulathur · five-year BBA LL.B (Hons) · academic year 2023–24.",
    focus: "Study how organisations make decisions alongside how the law governs them.",
    taught: "Principles of Management covers planning, staffing and coordination.",
    elective: "Corporate Securitisation is a professional elective.",
    practical: "The syllabus includes a semester-five internship and a final clinical moot court.",
    source: "https://webstor.srmist.edu.in/web_assets/downloads/2024/bba-llb-hons-curriculum-syllabus.pdf",
    sourceLabel: "SRM BBA LL.B curriculum",
  },
  "7b3e277334f": {
    edition: "Kattankulathur · five-year B.Com LL.B (Hons) · academic year 2023–24.",
    focus: "Learn how financial records and costs inform legal questions about companies.",
    taught: "Financial accounting includes bank reconciliation. Semester five includes Cost Accounting and Company Law.",
    elective: "Law and Medicine is a semester-five professional elective.",
    practical: "The clinical assessment includes a moot court and reports from court or lawyers’ chambers.",
    source: "https://webstor.srmist.edu.in/web_assets/downloads/2024/b-com-llb-hons-curriculum-syllabus.pdf",
    sourceLabel: "SRM B.Com LL.B curriculum",
  },
  "afccd862f02": {
    edition: "Kattankulathur · B.Arch · Regulations 2025.",
    focus: "Use drawing, models and studio critiques to work from a site brief to a building design.",
    taught: "The discipline courses include Architectural Graphics, Building Materials & Construction and Theory of Architecture.",
    elective: "Temple Architecture is a heritage and conservation elective.",
    practical: "The first Basic Design Studio allocates 12 hours per week to practical work.",
    source: "https://webstor.srmist.edu.in/web_assets/downloads/2025/b-arch-curriculum-2025.pdf",
    sourceLabel: "SRM architecture curriculum",
  },
  "b51c84f7f04": {
    edition: "Kattankulathur · full-time B.Tech Mechanical Engineering · Regulations 2026.",
    focus: "Predict how materials and moving parts behave, then test those predictions in the workshop and laboratory.",
    taught: "Engineering Thermodynamics and Mechanics of Solids sit in the professional core.",
    elective: "Industrial Robotics is a discipline skill elective.",
    practical: "The Mechanics of Solids Laboratory schedules two practical hours a week.",
    source: "https://webstor.srmist.edu.in/web_assets/downloads/2026/srmist-btech-mechanical-engineering-curriculum-2026.pdf",
    sourceLabel: "SRM mechanical engineering curriculum",
  },
  "61b981b9c53": {
    edition: "Kattankulathur · MBBS · Regulations 2023. Check the edition assigned to your intake.",
    focus: "Connect how the body works with supervised clinical observation and communication with patients.",
    taught: "First-phase study includes anatomy, physiology and biochemistry.",
    elective: "Students complete elective blocks. Research methodology is an example the regulations give. The institution sets the available topics.",
    practical: "Early clinical exposure starts in the first year. Later phases include supervised clinical postings.",
    source: "https://medical.srmist.edu.in/wp-content/uploads/2024/05/MBBS-Regulations-2023.pdf",
    sourceLabel: "SRM Medical College regulations",
  },
  "45f7b939ca2": {
    edition: "Kattankulathur · Bachelor of Physiotherapy · Regulations 2019. Confirm the curriculum for your intake.",
    focus: "Relate joint and muscle movement to the daily tasks a person wants to recover.",
    taught: "Biomechanics I and II and Exercise Therapy I and II appear in the semester schedules.",
    practical: "The third-semester schedule pairs biomechanics and exercise therapy theory with separate practical courses.",
    source: "https://webstor.srmist.edu.in/web_assets/downloads/2023/bpt-regulations-2019.pdf",
    sourceLabel: "SRM physiotherapy curriculum",
  },
  "20fe4cd82ef": {
    edition: "Kattankulathur · BA LL.B (Hons) · Regulations 2023.",
    focus: "Read how a dispute becomes a legal argument, alongside the political and social context of a case.",
    taught: "The core includes torts and constitutional law. The pre-law curriculum includes political thought.",
    elective: "Law and Medicine appears as a professional elective in semester five.",
    practical: "Internship is a practical course. Later clinical courses include dispute resolution and legal drafting.",
    source: asset + "downloads/2024/ba-llb-syllabus-curriculum-syllabus.pdf", sourceLabel: "SRM law curriculum",
  },
  "457c32ab100": {
    edition: "SRM College of Agricultural Sciences · B.Sc (Hons) Horticulture · Regulations 2025. First-semester examinations for the 2025–26 intake.",
    focus: "Focus on raising plants for fruit, vegetable and flower production, including how different crops are managed in a nursery.",
    taught: "The examined subjects include nursery management for fruit and plantation crops, and a separate paper on nurseries for vegetables, flowers and medicinal crops. The schedule does not identify electives.",
    source: "https://webstor.srmist.edu.in/web_assets/downloads/2026/bsc-hons-agriculture-and-horticulture-2025-regulations-february-2026.pdf",
    sourceLabel: "SRM examination schedule",
  },
  cb26a1d8d87: {
    edition: "SRM College of Agricultural Sciences · Regulations 2025, from the 2025–26 intake.",
    focus: "Connect soil and weather with what happens to a crop in the field.",
    taught: "Fundamentals of Agronomy is a core subject. Learn how crop growth, nutrient management and weed control interact.",
    practical: "Field exercises include identifying weeds and estimating yield from sample plants.",
    source: asset + "downloads/2026/bsc-hons-agriculture-curriculum-and-syllabus-2025-regulations.pdf", sourceLabel: "SRM agriculture curriculum",
  },
  "003d7484800": {
    edition: "SRMIST B.Sc Hotel and Hospitality Administration · Regulations 2024. First-year examination schedule for 2024–25 entrants.",
    focus: "Follow a guest’s experience across the kitchen, dining room, reception and accommodation.",
    taught: "The first-year examination schedule covers food production, front-office operations, hospitality communication and hotel accountancy.",
    source: asset + "downloads/2025/bsc-hotel-and-hospitality-administration-2024-regulations-may-2025.pdf", sourceLabel: "SRM examination schedule",
  },
  "9538a8885eb": pharmacy,
  "7fb864cff7a": pharmacy,
  "378f1a45cde": {
    edition: "Kattankulathur · BS (Honours) · 2025 admissions overview. The overview describes topics without assigning core or elective status.",
    focus: "Work with large datasets, predictive models and cloud platforms to answer questions with evidence.",
    source: scienceOverview, sourceLabel: "SRM honours programme overview",
  },
  "6848c06d83a": {
    edition: "Kattankulathur · BS (Honours) · 2025 admissions overview. The overview describes topics without assigning core or elective status.",
    focus: "Design systems that can plan and carry out a task. SRM lists reinforcement learning and interactions between multiple agents.",
    source: scienceOverview, sourceLabel: "SRM honours programme overview",
  },
};

export function studyReferenceFor(id: string) { return references[id]; }
