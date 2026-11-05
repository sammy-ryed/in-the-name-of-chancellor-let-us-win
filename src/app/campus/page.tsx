import { Guide, Section, Action, Resources } from "@/components/Guide";
import Clubs from "@/features/explore/Clubs";
import hostels from "@/features/explore/hostels.json";
import { srm, tourUrl } from "@/features/home/content";
export const metadata = { title: "Campus life" };
export default function Page() {
  return (
    <Guide
      title="Campus life"
      section="Campus life"
      image="stage"
      intro="Find a club to try, a place to stay and your way around campus."
      links={[
        ["Find a club", "clubs"],
        ["Housing & dining", "housing"],
        ["Explore campus", "visit"],
      ]}
    >
      <Section id="clubs" title="Find your club">
        <Clubs />
      </Section>
      <Section id="housing" title="Housing & dining">
        <p>
          Compare Kattankulathur hostel blocks. Room allocation, availability
          and charges depend on the intake and booking round.
        </p>
        {Object.entries(hostels).map(([group, rooms]) => (
          <details key={group}>
            <summary>
              {group} · {rooms.length} blocks
            </summary>
            {rooms.map((r) => (
              <div className="room" key={r.name}>
                <strong>{r.name}</strong>
                <p>{r.detail}</p>
              </div>
            ))}
            <a
              href={
                srm +
                "/srm-hostels/" +
                (group === "Men"
                  ? "hostel-for-men"
                  : group === "Women"
                    ? "hostel-for-women"
                    : "international-hostel") +
                "/"
              }
            >
              Block contacts & floor plans ↗
            </a>
          </details>
        ))}
        <div className="action-row">
          <Action href={srm + "/srm-hostels/#hostel-announcement"}>
            Check booking schedule
          </Action>
          <Action href="https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp">
            Open hostel booking
          </Action>
        </div>
        <Resources
          items={[
            {
              title: "Dining & eateries",
              note: "Mess facilities, meals and campus dining.",
              href: srm + "/srm-hostels/dining-eateries/",
            },
            {
              title: "Hostel rules",
              note: "Read the university’s 2026 hostel rules before booking.",
              href: "https://webstor.srmist.edu.in/web_assets/downloads/2026/srm-hostel-rules-2026.pdf",
            },
            {
              title: "Hostel office",
              note: "Ask about your room, fees or allotment.",
              href: srm + "/srm-hostels/#hostels-contact",
            },
          ]}
        />
      </Section>
      <Section id="visit" title="Explore campus">
        <Resources
          items={[
            {
              title: "Campus events",
              note: "See what’s coming up next.",
              href: "/events",
            },
            {
              title: "360° campus tour",
              note: "Look around Kattankulathur before arriving.",
              href: tourUrl,
            },
            {
              title: "Directions and transport",
              note: "Find arrival guidance and campus maps.",
              href: srm + "/visitors/",
            },
            {
              title: "Arts and culture",
              note: "Dance, theatre and campus cultural activities.",
              href: srm + "/life-at-srm/culture/",
            },
            {
              title: "Sports",
              note: "University teams and athletics.",
              href: srm + "/sports/",
            },
            {
              title: "Safety & support",
              note: "Campus safety and housing contacts.",
              href: srm + "/life-at-srm/getting-around-campus-safety/",
            },
          ]}
        />
      </Section>
    </Guide>
  );
}
