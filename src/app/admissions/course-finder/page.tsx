import { routes } from "@/lib/navigation";
import { DirectionFinder } from "@/features/admissions/course-finder/DirectionFinder";

import { degreeOptions } from "@/features/admissions/course-finder/degree-options";

export const metadata = {
  title: routes.finder.label,
  description: "Explore what to study after Class 12. Choose what you’d pick up or hand over in everyday situations, see what fits and compare SRM degrees.",
};
export default function CourseFinderPage() {
  return <DirectionFinder catalog={degreeOptions} />;
}
