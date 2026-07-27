# Todo

## Done

- M001 S01: pure lib layer — `lib/constants.ts`, `lib/density.ts`, `lib/yearToPixel.ts`, `lib/pixelToYear.ts`, `lib/yearToDisplay.ts`, `lib/filters.ts`
- M001 S01: unit tests (vitest) for density, pixel math, year display, filters, data integrity
- M002 S02 T01: `app/components/TimelineContainer.tsx` — horizontally-scrollable div sized to density-zone totalWidth, era year labels via yearToPixel
- M002 S02 T02: `app/page.tsx` wired to render TimelineContainer; `e2e/timeline-s02.spec.ts` (3 Playwright assertions: scroll container visible, inner width > 10000px, year label visible) — all passing
- Cleaned `.gsd/exec/` from git history; added to `.gitignore`
- Added `install.md`

## Up next

- M002 S02 closeout (slice UAT + completion)
- Parallax engine: era background layers scroll at different speeds
- Show markers placed on the timeline at correct pixel positions
- Filter panel (nuqs-bound): region / genre / platform / accuracy
- `e2e/smoke.spec.ts` needs updating (asserts the removed h1 heading — currently broken)
