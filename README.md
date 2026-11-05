# SRMIST website redesign

Use Node 22.13 or later and npm. Run `npm ci`, then `npm run dev` and open http://localhost:3000.

## Split the work

| Track | Route | Feature folder |
| --- | --- | --- |
| Homepage and site navigation | / | src/features/home |
| Programme discovery and admissions | /programmes | src/features/programmes |
| Clubs, events and campus exploration | /campus | src/features/campus |
| Timetable, attendance and student services | /students | src/features/students |

Each route starts with working links. Build track-specific components and fixtures inside its feature folder. Compose them in the matching src/app page. Shared UI lives in src/components, navigation in src/lib/navigation.ts, and site colours and layout in src/app/globals.css. Coordinate edits to the shared layout with the homepage owner. Use fictional records for student prototypes.

## Shared components

The root layout renders the homepage navigation on every route. Edit `src/components/SiteNavigation.tsx` for menu behavior, `src/components/chrome.css` for its appearance and `src/lib/navigation.ts` for destinations. The shared Guide provides the default “Scroll for more” target (`#guide-content`). A custom page can use that ID on its first content section or point to an existing anchor in `scrollTargets`.

Reuse `SiteFooter` for the full address and links, `ServiceFooter` for the compact version, and `Breadcrumbs` for parent links. Guide pages share `Section`, `Action` and `Resources`. Use `Disclosure` for expandable questions.

## Collaborate

Publish the initial branches from this checkout:

```sh
git push -u origin main
git push -u origin sammyworks
```

Sammy works on `sammyworks`. Other teammates branch from the published main with `git switch -c <feature-name> origin/main`. Push each feature branch and open a pull request into main.

Before opening a PR, run `npm run lint`, `npm run typecheck` and `npm run build`.

The homepage motion sequence, editing guide and media credits are in [src/features/home/README.md](src/features/home/README.md).
