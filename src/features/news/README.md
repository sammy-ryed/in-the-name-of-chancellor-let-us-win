# Newsroom / Drift Wall

The News page retains the shared Guide navigation, cover, footer, and all existing
newsroom and featured-story links. Desktop uses equal-width editorial and visual
columns; the visual stays sticky alongside the list. Mobile shows the newsroom
heading, wall, then the article list.

`DriftWall.tsx` adapts the user-supplied React Bits implementation to TypeScript
and plain CSS; no Tailwind or new runtime dependencies are required. Attribution
and the existing React Bits license are retained. The original configurable
perspective, column drift, variance, pointer parallax, and hover lift are supported.

Motion pauses using the visible toggle. Offscreen and hidden-document frames skip
DOM updates. The animation frame and both observers are cleaned up on unmount.
OS reduced motion and the site's Reduce motion control replace the moving wall
with a static, keyboard-accessible image grid. Repeated moving tiles are omitted
from the accessibility tree; equivalent article links appear in the newsroom and
In focus sections. The wall does not intercept scrolling or replace the cursor.

`images.json` records each article and the original public SRM image URL.
`public/news` contains optimized WebP copies (720px wide, quality 80). These are
article photographs, not stock images. Existing featured images live in
`public/home`. Update the image manifest when updating the curated headline data.
