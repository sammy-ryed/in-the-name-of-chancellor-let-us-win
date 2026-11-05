# News photos

The News route combines the SRM newsroom manifest with the campus features in `src/features/home/content.ts`. Each entry links to its original article. `images.json` records the official photograph URL and byte size for each local newsroom WebP.

`ArticleCarousel` shows the full photo, headline and article link. Visible stories advance every seven seconds. Play/Pause controls playback, and choosing, swiping or stepping to a story pauses it for reading. Both site and OS reduced-motion settings start the carousel paused. On desktop the carousel sits beside the headline list. On phones it follows the newsroom heading.
