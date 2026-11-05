# Homepage: film and scroll

Run `npm ci` and `npm run dev`, then open [localhost:3000](http://localhost:3000) on `sammyworks`.

| Scene | Scroll and interaction | Team editing point |
| --- | --- | --- |
| Opening | The headline and motto sit in the left panel. The film aperture expands as you scroll, then gives way to academics. | `src/app/page.tsx`, `src/features/home/Choreography.tsx`, `src/app/home.css` |
| Campus film | The muted local HD excerpt plays in view. Watch film opens the original reel with native YouTube controls. | `src/features/home/Film.tsx` |
| Find your way | A five-second pan across the official tour’s lake panorama plays once. Visitors can replay it, enter the full tour or open the illustrated map. | `src/features/home/journeys.css` |
| Community | Five linked portraits sit beside the headline on desktop and below it on phones. The photographs stay inside their own rows. | `src/features/home/content.ts` |
| News and destinations | Swipe or drag the news strip, use its arrow buttons, or tab through the stories. The three closing bands lead into the other teammates’ routes. | `src/features/home/NewsReel.tsx`, `src/features/home/content.ts` |

The [Monument homepage](https://monument.tv/) is the motion and layout reference. The copy, destinations and implementation are written for SRM. Motion follows native page scrolling. Reduced-motion mode presents the scenes in reading order with no pinned choreography or automatic film playback.

## Media sources

- **Opening preview**: eight-second excerpt from [SRM’s 1920×1080 landing film](https://www.srmist.edu.in/wp-content/uploads/2022/09/srmist-landing-video.webm). The WebM retains the original VP9 stream. A 1080p MP4 provides a fallback. The [full reel](https://www.youtube.com/watch?v=S_xAJo_siHA) loads on request.
- **Tour preview**: five-second camera pan rendered from the opening SRMIST lake panorama in the [official virtual tour](https://webstor.srmist.edu.in/web_assets/srmist-virtual-tour-vo/index.htm). Only the local poster and preview are used on the homepage.
- **Motto**: “Learn. Leap. Lead.” follows the [official university homepage](https://www.srmist.edu.in/).
- **Logo**: the [white SRM homepage SVG](https://www.srmist.edu.in/wp-content/uploads/2022/01/srm-logo-white.svg), stored unchanged.
- **Campus**: [SRM Kattankulathur panorama](https://www.srmist.edu.in/wp-content/uploads/2022/01/Panroma_pic3_100_0106_20211022192347_Croped.jpg).
- **Campus map**: illustrated transit-style map supplied by the team (`public/home/campus-map.webp`); its baked-in checkerboard background was removed to make it transparent. Illustrative, not to scale.
- **People and stories**: the [SRM homepage](https://www.srmist.edu.in/) supplies the official photographs. Story records in `content.ts` link to their original articles. Photos are stored as WebP in `public/home`.
- **Display type**: [Anton](https://github.com/google/fonts/tree/main/ofl/anton), bundled under the SIL Open Font License at `public/home/OFL.txt`.
