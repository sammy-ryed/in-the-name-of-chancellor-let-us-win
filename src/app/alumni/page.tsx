import { Action, Guide, Resources, Section } from "@/components/Guide";
import { routes } from "@/lib/navigation";

export const metadata = { title: "Alumni" };

export default function AlumniPage() {
  return (
    <Guide title="Alumni" image="convocation" intro="Remember the walk to class? Find the faces from your batch and the next chance to meet them."
      links={[["Photos & reunions", "memories"], ["Notable alumni", "notable"]]}>
      <Section id="memories" title="Back with your batch">
        <Resources items={[
          { href: routes.photos.href, title: routes.photos.label, note: "Look through chapter meets and campus gatherings in the official photo archive." },
          { href: routes.reunions.href, title: routes.reunions.label, note: "Find reunions and chapter events through the SRMIST Alumni Network." },
        ]} />
      </Section>
      <Section id="notable" title="Notable alumni">
        <p>Ravi Kunduru (Computer Science, 1995) and Srikanth Kodavanti (MBA, 2005) are among SRM’s distinguished alumni award recipients.</p>
        <Action href="https://alumni.srmist.edu.in/newsroom/news/Distinguish-Alumni-Award-winners">Meet the award recipients</Action>
      </Section>
    </Guide>
  );
}
