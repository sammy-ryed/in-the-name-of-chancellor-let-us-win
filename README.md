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

## Collaborate

Publish the initial branches from this checkout:

```sh
git push -u origin main
git push -u origin sammyworks
```

Sammy works on `sammyworks`. Other teammates branch from the published main with `git switch -c <feature-name> origin/main`. Push each feature branch and open a pull request into main.

Before opening a PR, run `npm run lint`, `npm run typecheck` and `npm run build`.
