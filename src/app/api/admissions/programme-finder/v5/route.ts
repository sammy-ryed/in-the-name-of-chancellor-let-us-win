import { createFinderRoute } from "@/features/admissions/course-finder/coach-route";
import { core, version } from "@/features/admissions/course-finder/v5/questions";
import { coachPrompts, localCoach, placementSources, recommend, validAnswers } from "@/features/admissions/course-finder/v5/results";

export const { GET, POST } = createFinderRoute({ version, core, coachPrompts, localCoach, recommend, validAnswers,
  reviewedSources: { placements: placementSources },
});
