export const placementsQuestion = "Will AI affect campus placements?";

export const hiringEvidence = {
  label: "Deloitte India campus survey · August 2026",
  href: "https://www.deloitte.com/in/en/about/press-room/india-s-campus-talent-landscape-pivots-to-skill-based-hiring-as-86-percent-of-employers-adopt-ai-in-recruitment--deloitte-india.html",
  summary: "Yes, some employers are already changing what they hire freshers to do. In Deloitte India’s August 2026 campus survey of 257 employers, 35% said AI was creating entry-level roles or changing the skills they needed.",
};

export const taskEvidence = {
  label: "ILO task-level study · May 2025",
  href: "https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure",
  summary: "The ILO’s May 2025 study found that most jobs still contain tasks that need a person, even when AI can handle part of the work.",
};

export const placementScope = "The evidence does not show how many offers AI will add or take away for a particular SRM course or campus.";
export const preparationTip = "For an interview, bring a project and be ready to show one decision you made and how you checked your work.";
export const placementOverview = [hiringEvidence.summary, taskEvidence.summary, placementScope, preparationTip].join(" ");
export const placementSources = [hiringEvidence, taskEvidence].map(({ label, href }) => ({ label, href }));
