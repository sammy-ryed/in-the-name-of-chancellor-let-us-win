import { createFinderRoute } from "@/features/admissions/course-finder/coach-route";
import { core, version } from "@/features/admissions/course-finder/questions";
import { coachPrompts, localCoach, recommend, validAnswers } from "@/features/admissions/course-finder/results";

export const { GET, POST } = createFinderRoute({ version, core, coachPrompts, localCoach, recommend, validAnswers });
