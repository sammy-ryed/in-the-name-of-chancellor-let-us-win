import { DirectionFinder } from "@/features/admissions/course-finder/DirectionFinder";

import { degreeOptions } from "@/features/admissions/course-finder/degree-options";

export const metadata = {
  title: "Find your direction",
  description: "Try a few everyday choices, discover course families to explore and choose SRM degrees to compare.",
};
export default function CourseFinderPage() {
  return <DirectionFinder catalog={degreeOptions} />;
}
