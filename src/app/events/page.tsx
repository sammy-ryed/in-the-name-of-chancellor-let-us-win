import { Guide, Section } from "@/components/Guide";
import EventList from "@/features/explore/EventList";
export const metadata = { title: "Events" };
export default function Page() {
  return (
    <Guide
      title="Events"
      image="stage"
      intro="Workshops, conferences and campus gatherings, ordered by the next date."
    >
      <Section title="Campus calendar">
        <EventList />
      </Section>
    </Guide>
  );
}
