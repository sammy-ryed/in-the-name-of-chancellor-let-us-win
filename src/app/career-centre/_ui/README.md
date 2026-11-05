# Career Centre — reference-based remake

The `/career-centre` implementation and assets are route-specific. Footer,
fonts and root styles are reused unchanged. The three shared Placements submenu links match the current page sections. There is no sticky page navigation
and no Your Future, Your Way section.

## Setup

From this `_ui` directory run `npm ci --legacy-peer-deps`, then run the main app
from the repository root with `npm run dev`. Route dependencies are kept here to
respect the restriction against editing shared package/configuration files.
Run `npm run styles` from `_ui` after changing prefixed Tailwind classes.

## Sources

The 2026 figures are transcribed from the official Career Centre screenshot
provided by the user: 10,969+ offers, 1,701 roles, 5,499+ high-paying offers,
₹60 LPA highest CTC and ₹7.47 LPA average CTC. The screenshot does not show a
reporting date; the page explicitly states this. Do not label these as the
previous 2025 batch figures or infer a recruiter count from the role count.
Counters animate from zero to the supplied values; reduced motion shows final
values immediately.

`all-recruiters.json` records all 116 company logo entries in the official SRM
Career Centre gallery, including original image URLs. Assets are optimized into
white square WebP canvases with the original logo proportions preserved.

`components/InfiniteMenu.tsx` and `.css` come from React Bits' official repository:
https://github.com/DavidHDev/react-bits/tree/main/src/ts-default/Components/InfiniteMenu
The license is retained in REACT-BITS-LICENSE.md. Ref synchronization was moved
into an effect to satisfy the host application's React rules. Autoplay advances after four idle seconds and has a pause control;
arrow keys and pointer dragging are supported. A complete text directory provides
an alternative to canvas interaction.

Student portraits, short quotes and company placements are from
https://www.srmist.edu.in/career-centre/ . Job titles are not invented.
Offer thresholds are from https://www.srmist.edu.in/placements/catapulting-careers/ .
Training is based on https://www.srmist.edu.in/department/cet-cdc/ and official
Career Centre activities. Original resource links and historical archives remain.
The dated archival statistics are separate from the 2026 snapshot.

The opening texture is a procedural CSS gradient with SVG noise, not a fabricated
photograph. Training and student photographs retain their official SRM provenance.

## Checks

From the root: `npm run typecheck`, `npm run build`, and
`npx eslint src/app/career-centre --ignore-pattern '**/node_modules/**'`.
