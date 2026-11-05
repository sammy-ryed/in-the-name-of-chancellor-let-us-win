# Students experience

`StudentsPage` is server rendered and reuses the site navigation, display font,
palette, footer styles, and local WebP assets. Resource URLs and cohort guidance
remain in `services.ts`. SCORE is an unfinished student project; its showcase
must not be presented as an available application.

`StudentMotion` isolates the existing GSAP / ScrollTrigger stack in a client
component. Viewport-triggered text entrances, image clipping,
parallax, a scroll-linked SCORE wordmark, and fine-pointer arrow motion each have
separate timing. Native scrolling and anchor navigation remain intact. The
academic introduction is CSS sticky on desktop and flows normally on mobile.

All motion is opt-in through `prefers-reduced-motion: no-preference`; GSAP's
matchMedia context reverts animations and removes pointer listeners on preference
changes or unmount. Content is visible without JavaScript. Images
use native lazy loading, and image containers reserve layout space.

Validation commands: `npm run lint`, `npm run typecheck`, `npm run build`.
For browser QA, check 320px, 390px, 768px, and desktop widths, section anchors,
the shared menu and Escape/focus return, horizontal overflow, and reduced motion.
