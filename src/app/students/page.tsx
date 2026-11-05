import { Directory } from "@/components/Directory";
import { content } from "@/features/students/content";

export const metadata = { title: content.title };
export default function Page() {
  return <Directory {...content} />;
}
