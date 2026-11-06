# Homepage: film and scroll

Run `npm ci` and `npm run dev`, then open [localhost:3000](http://localhost:3000) on `sammyworks`.

| Scene | Scroll and interaction | Team editing point |
| --- | --- | --- |
| Opening | The headline and motto sit in the left panel. The film aperture expands as you scroll, then gives way to academics. | `src/app/page.tsx`, `src/features/home/Choreography.tsx`, `src/app/home.css` |
| Campus film | The muted nine-second excerpt plays in view on desktop. Fast phones play a 540p copy after the page loads; other phones start with the poster and a Play preview control. The full-film control opens the original reel. | `src/features/home/Film.tsx` |
| Find your way | An 18-second film visits the campus lake, Arch Gate, Central Library and T.P. Ganesan Auditorium. It plays once in view when motion and connection preferences allow. Visitors can also play or replay it, enter the full tour or open the illustrated map. | `src/features/home/journeys.css` |
| Community | On desktop the names roll past the center and select a portrait. Phones and tablets get swipeable cards. Reduced motion presents all five links in a directory. | `src/features/home/TeamRoll.tsx`, `src/features/home/content.ts` |
| News and destinations | Swipe or drag the news strip, use its arrow buttons, or tab through the stories. The three closing bands lead into the other teammates’ routes. | `src/features/home/NewsReel.tsx`, `src/features/home/content.ts` |

The [Monument homepage](https://monument.tv/) is the motion and layout reference. The copy, destinations and implementation are written for SRM. Motion follows native page scrolling. Reduced-motion mode presents the scenes in reading order with no pinned choreography or automatic film playback.

## Media sources

- **Opening preview**: a locally encoded 1080p excerpt from the [official SRMIST campus film](https://www.youtube.com/watch?v=4c7Ob4pDYMQ), also featured on [SRM’s B.Tech admissions page](https://applications.srmist.edu.in/btech). Watch film opens the full video on demand.
- **Subject previews**: five photos are from [SRM’s faculty cards](https://www.srmist.edu.in/). Humanities uses the [English department’s theatre workshop](https://www.srmist.edu.in/department/department-of-english/), and Sciences uses a microscopy frame from the campus film. Each local WebP loads when a subject receives hover or keyboard focus.
- **Tour preview**: four camera pans rendered from the Kattankulathur panoramas in the [official virtual tour](https://webstor.srmist.edu.in/web_assets/srmist-virtual-tour-vo/index.htm). Only the local poster and preview are used on the homepage.
- **Motto**: “Learn. Leap. Lead.” follows the [official university homepage](https://www.srmist.edu.in/).
- **Logo**: the [white SRM homepage SVG](https://www.srmist.edu.in/wp-content/uploads/2022/01/srm-logo-white.svg), stored unchanged.
- **Campus**: [SRM Kattankulathur panorama](https://www.srmist.edu.in/wp-content/uploads/2022/01/Panroma_pic3_100_0106_20211022192347_Croped.jpg).
- **Campus map**: illustrated transit-style map supplied by the team (`public/home/campus-map.webp`); its baked-in checkerboard background was removed to make it transparent. Illustrative, not to scale.
- **People and stories**: the [SRM homepage](https://www.srmist.edu.in/) supplies the official photographs. Story records in `content.ts` link to their original articles. Photos are stored as WebP in `public/home`.
- **Display type**: [Anton](https://github.com/google/fonts/tree/main/ofl/anton), bundled under the SIL Open Font License at `public/home/OFL.txt`.
