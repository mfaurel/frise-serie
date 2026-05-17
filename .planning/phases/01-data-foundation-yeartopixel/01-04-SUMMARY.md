---
phase: 01-data-foundation-yeartopixel
plan: 04
subsystem: data
tags: [typescript, static-data, shows, seed-dataset, historical-timeline]

# Dependency graph
requires:
  - phase: 01-data-foundation-yeartopixel
    provides: Show interface type definition, existing 16-show SHOWS array pattern

provides:
  - SHOWS array with 30 entries spanning -1200 to 2005 AD
  - Bronze Age coverage (troy_fall_of_a_city at -1200)
  - Classical Greece coverage (alexander_making_of_a_god at -334)
  - Cold War / Contemporary coverage (the_americans, deutschland_83, halt_and_catch_fire, chernobyl, the_crown, mad_men)
  - Renaissance coverage (medici at 1429)
  - Early 19th/20th century coverage (ripper_street at 1889, downton_abbey at 1912)

affects:
  - phase-02-parallax-engine (show density needed for visual card validation)
  - phase-03-show-cards (all 9 eras now populated for card placement testing)
  - phase-09-data-completion (baseline dataset established)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "BC dates as negative integers (e.g. -1200 for 1200 BC) — no JS Date objects"
    - "posterUrl: empty string when TMDB hash unverified"
    - "title always has fr, en, original keys even when identical"
    - "flashbacks: [] for shows with no documented flashback sequences"

key-files:
  created: []
  modified:
    - data/shows.ts

key-decisions:
  - "Appended new entries at end of array in chronological order rather than inserting mid-array — array is not required to be sorted, simpler diff"
  - "Used empty string for posterUrl on 13 of 14 new entries where TMDB hash was unverified — prevents broken image loads"
  - "barbarians original title set to 'Barbaren' (German) — the Netflix original production language"

patterns-established:
  - "Entry order: append chronologically at end of array, no mid-array insertions"
  - "Empty posterUrl convention: '' (empty string) when hash unverified, not null or undefined"

requirements-completed:
  - TL-02

# Metrics
duration: 8min
completed: 2026-05-17
---

# Phase 1 Plan 04: Seed Dataset Expansion Summary

**30-show SHOWS array covering all 9 eras from Bronze Age Troy (-1200) to Cold War Berlin Wall (1986), with bilingual historicalContext on every entry**

## Performance

- **Duration:** 8 min
- **Started:** 2026-05-17T00:00:00Z
- **Completed:** 2026-05-17T00:08:00Z
- **Tasks:** 1 completed
- **Files modified:** 1

## Accomplishments

- Expanded data/shows.ts from 16 to 30 entries covering all 9 timeline eras
- Added Bronze Age / Ancient Near East coverage: troy_fall_of_a_city (-1200), alexander_making_of_a_god (-334), barbarians (9 AD)
- Added 11 further entries filling Renaissance, 17th century, 19th century, WWII Pacific, and Cold War/Contemporary gaps
- All 30 entries are TypeScript-clean with bilingual fr/en historicalContext, flashbacks: [], and correct BC negative integer convention

## Task Commits

1. **Task 1: Append 14 new shows to SHOWS array** - `4fd5c53` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `data/shows.ts` - SHOWS array expanded from 16 to 30 entries (+297 lines)

## Decisions Made

- Appended new entries at the end of the array in chronological order rather than inserting mid-array. The array is not required to be sorted; end-append produces a cleaner diff.
- Used `''` (empty string) for posterUrl on 13 of 14 new entries where TMDB hash was not verified in the plan, matching the established convention for unconfirmed CDN URLs.
- Set `original: 'Barbaren'` for barbarians (German Netflix original) to accurately represent the production's source language.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

`npx tsc --noEmit` exits with code 2 due to pre-existing errors in `lib/timeline.ts` (missing exports from `@/data/eras`). These errors are unrelated to data/shows.ts and are expected — they are tracked for resolution in Wave 4. data/shows.ts itself has zero TypeScript errors, as confirmed by filtering the TSC output.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- data/shows.ts has 30 entries spanning -1200 to 2005 AD, sufficient show density across all 9 eras
- Phase 3 (Show Cards) can now validate card placement across the full timeline without blank stretches
- Phase 2 (Parallax Engine) can proceed — the dataset provides adequate era coverage for background layer validation

---
*Phase: 01-data-foundation-yeartopixel*
*Completed: 2026-05-17*
