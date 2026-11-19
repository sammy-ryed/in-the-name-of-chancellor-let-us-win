import { applicantCounts } from "@/features/programmes/finder/applicants";
import { courseByProgrammeId } from "./course-matches";

// The disclosure counts a programme at Kattankulathur. Only a single,
// unambiguous campus listing can inherit that count in the course picker.
const applications = new Map<string, number>();
for (const [programmeId, count] of applicantCounts) {
  const course = courseByProgrammeId.get(programmeId);
  if (course?.campus === "Kattankulathur" && !course.shift) applications.set(course.id, count);
}

export const reportedApplications = (courseId: string) => applications.get(courseId);
export function byApplications(a: { applications?: number }, b: { applications?: number }) {
  return (b.applications ?? -1) - (a.applications ?? -1);
}
