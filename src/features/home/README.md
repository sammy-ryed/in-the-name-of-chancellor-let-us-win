# Homepage: film and scroll

Run `npm ci` and `npm run dev`, then open [localhost:3000](http://localhost:3000) on `sammyworks`.

| Scene | Scroll and interaction | Team editing point |
| --- | --- | --- |
| Opening | One headline crosses three colour and film layers. The diagonal aperture opens, then a diagonal wipe brings in academics from the right. On phones the film opens vertically below the shared header. | `src/app/page.tsx`, `src/features/home/Choreography.tsx`, `src/app/home.css` |
| Campus film | The muted preview plays in the aperture. Click the follow-cursor control to start the reel with sound, then click to pause/resume. Close restores the preview. A poster and direct link cover blocked players. | `src/features/home/Film.tsx` |
| Find your way | The illustrated campus map settles from a slight zoom and tilt beside the heading, tour link and editorial copy. | `src/app/home-scenes.css` |
| Community | A cut-out opens, five headline lines rise through masks, and the linked roster moves over the pinned title. Hover or focus a row to preview its photo. | `src/features/home/content.ts` |
| News and destinations | Swipe or drag the news strip, use its arrow buttons, or tab through the stories. The three closing bands lead into the other teammates’ routes. | `src/features/home/NewsReel.tsx`, `src/features/home/content.ts` |

The [Monument homepage](https://monument.tv/) is the motion and layout reference. The copy, destinations and implementation are written for SRM. Motion follows native page scrolling. Reduced-motion mode presents the scenes in reading order with no pinned choreography or automatic film playback.

## Media sources

- **Opening film**: [official SRM YouTube video](https://www.youtube.com/watch?v=S_xAJo_siHA), using YouTube’s privacy-enhanced embedded player. The [thumbnail](https://i.ytimg.com/vi/S_xAJo_siHA/maxresdefault.jpg) is stored locally.
- **Logo**: the [white SRM homepage SVG](https://www.srmist.edu.in/wp-content/uploads/2022/01/srm-logo-white.svg), stored unchanged.
- **Campus**: [SRM Kattankulathur panorama](https://www.srmist.edu.in/wp-content/uploads/2022/01/Panroma_pic3_100_0106_20211022192347_Croped.jpg).
- **Campus map**: illustrated transit-style map supplied by the team (`public/home/campus-map.webp`); its baked-in checkerboard background was removed to make it transparent. Illustrative, not to scale.
- **People and stories**: the [SRM homepage](https://www.srmist.edu.in/) supplies the official photographs. Story records in `content.ts` link to their original articles. Photos are stored as WebP in `public/home`.
- **Display type**: [Anton](https://github.com/google/fonts/tree/main/ofl/anton), bundled under the SIL Open Font License at `public/home/OFL.txt`.
