import { projects } from "./content";
import { ResearchGallery } from "./ResearchGallery";

const entries = projects.map(project => ({
  title: project.title,
  image: project.image,
  alt: project.alt,
  description: project.description,
  field: project.field,
  href: project.source,
  linkLabel: "Read the project source",
  facts: [
    { label: "Funded by", value: project.agency },
    { label: "Published funding", value: project.funding },
    { label: "Reported in", value: project.year },
  ],
  note: project.fundingNote,
}));

export function ProjectStack() {
  return <ResearchGallery noun="project" items={entries} />;
}
