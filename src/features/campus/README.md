# Find your people

`ClubCards` implements the supplied hover-expand visual reference independently,
using the existing React and CSS stack. No premium package or new library is used.

Seven category panels plus an All interests panel cover every entry in `clubs.ts`. Desktop expands a panel on
mouse hover or click; keyboard users can tab to every category and use arrow keys,
Home, and End. Mobile uses a vertical tap-to-expand gallery. OS reduced motion and
the site's Reduce motion setting disable transitions.

The heading and matching club list stay on the left on desktop; the gallery is on
the right. Hovering, tapping, or using the keyboard to select a panel updates the
left-hand list. All interests shows all 15 clubs; there is no separate search or
filter toolbar. The native dialog retains coordinator contacts,
Student Affairs links, the unconfirmed recruitment status, related clubs, Escape,
focus return, and scroll locking. Existing `#people` and `#clubs` anchors remain.

`club-images.json` records public SRM club image sources. Optimized local WebP
files live in `public/campus`; the opening Service panel uses the existing SRM
campus film still instead of the club-logo thumbnail. Photos illustrate categories
and are not intended as individual portraits or proof of club membership.
