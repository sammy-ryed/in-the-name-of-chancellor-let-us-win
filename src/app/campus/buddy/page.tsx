import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { CampusBuddy } from "@/features/buddy/CampusBuddy";

export const metadata: Metadata = {
  title: "Campus Buddy",
  description: "Try a first week at Kattankulathur with a student buddy in a local demo.",
};
export default function Page() {
  return <><CampusBuddy /><SiteFooter /></>;
}
