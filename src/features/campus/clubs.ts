/** SRM student clubs (from https://www.srmist.edu.in/life-at-srm/student-life/clubs/). */
type ClubProfile = {
  name: string;
  type: string;
  description: string;
  social?: { label: string; href: string };
};
export const clubs: ClubProfile[] = [
  {
    name: "Rotaract Club",
    type: "Service",
    description: "Work with local communities on service projects.",
    social: { label: "Rotaract on LinkedIn", href: "https://in.linkedin.com/company/rotaract-club-of-srm-ktr" },
  },
  {
    name: "Astrophilia",
    type: "Science",
    description: "Discuss astronomy, from nearby planets to distant galaxies.",
  },
  {
    name: "Fashion",
    type: "Arts",
    description: "Explore fashion, styling and personal presentation.",
  },
  {
    name: "Music",
    type: "Arts",
    description: "Meet other musicians and develop performance skills together.",
  },
  {
    name: "Literature Club",
    type: "Arts",
    description: "Discuss poems and stories with readers and writers.",
  },
  {
    name: "Festival",
    type: "Culture",
    description: "Organise campus celebrations across cultures.",
  },
  {
    name: "Dance Club",
    type: "Arts",
    description: "Practise choreography and perform with other dancers.",
  },
  {
    name: "Movies and Dramatics",
    type: "Arts",
    description: "Explore storytelling through film and theatre.",
  },
  {
    name: "Sports",
    type: "Sport",
    description: "Take part in sports alongside fellow students.",
  },
  {
    name: "Creative Arts & Media",
    type: "Arts",
    description: "Experiment with creative arts and media.",
  },
  {
    name: "Women Empowerment",
    type: "Service",
    description: "Raise awareness of gender inequality.",
  },
  {
    name: "Self Defense Club",
    type: "Sport",
    description: "Practise basic self-defence techniques.",
  },
  {
    name: "Social Club",
    type: "Community",
    description: "Organise community service and awareness activities.",
    social: { label: "Social Club on Instagram", href: "https://www.instagram.com/srm_socialclub/" },
  },
  {
    name: "Gaming",
    type: "Games",
    description: "Play competitive video games and organise tournaments.",
  },
  {
    name: "Quiz",
    type: "Games",
    description: "Meet other quizzers and practise for competitions.",
  },
];


export const clubContacts = "https://webstor.srmist.edu.in/web_assets/downloads/2023/sa-club-contact-details.pdf";
export const studentAffairs = "https://www.srmist.edu.in/directorate-of-student-affairs/";
export const clubProfiles = "https://www.srmist.edu.in/life-at-srm/student-life/clubs/";
