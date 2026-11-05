import { facilities } from "./content";
import { ResearchGallery } from "./ResearchGallery";

export function ResearchFacilities() {
  return <ResearchGallery noun="facility" items={facilities} />;
}
