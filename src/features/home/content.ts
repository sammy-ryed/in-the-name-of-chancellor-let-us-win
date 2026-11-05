import { srm } from "@/lib/navigation";

export const filmId = "S_xAJo_siHA";
export const filmUrl = "https://www.youtube.com/watch?v=" + filmId;
export const community = [
  {
    name: "Student clubs",
    place: "Find your people",
    href: srm + "/life-at-srm/student-life/clubs/",
    image: "students",
  },
  {
    name: "Camber Racing",
    place: "Build / compete",
    href:
      srm +
      "/srmists-team-camber-racing-claims-national-title-at-formula-bharat-2026/",
    image: "racing",
  },
  {
    name: "Art & culture",
    place: "On stage",
    href: srm + "/life-at-srm/culture/",
    image: "stage",
  },
  {
    name: "SRM Sports",
    place: "On the field",
    href: srm + "/sports/",
    image: "athletics",
  },
  {
    name: "Innovation hub",
    place: "In the lab",
    href: srm + "/research/innovation-incubation/",
    image: "research",
  },
];
export const stories = [
  {
    title: "From Kattankulathur to the Steve Jobs Theater",
    category: "Swift Student Challenge / 2026",
    image: "developer",
    alt: "SRM student Shourya Thakur at Apple",
    href:
      srm +
      "/srmist-student-named-distinguished-winner-at-apples-swift-student-challenge-2026/",
  },
  {
    title: "Camber Racing takes the national title",
    category: "Formula Bharat / 2026",
    image: "racing",
    alt: "Team Camber Racing with its competition car",
    href: community[1].href,
  },
  {
    title: "The graduating class takes the stage",
    category: "22nd convocation / 2026",
    image: "convocation",
    alt: "Graduates and university dignitaries at the convocation",
    href: srm + "/srmist-22nd-convocation/",
  },
];
