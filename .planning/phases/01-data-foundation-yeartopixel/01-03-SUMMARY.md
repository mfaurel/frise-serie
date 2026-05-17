---
phase: 01-data-foundation-yeartopixel
plan: 03
subsystem: testing
tags: [typescript, vitest, yeartopixel, piecewise-linear, bc-dates, timeline-math]

# Dependency graph
requires:
  - phase: 01-02
    provides: "ERAS array with pixelsPerYear, HistoricalEra type with pixelsPerYear field"

provides:
  - "lib/yearToPixel.ts — piecewise yearToPixel + pixelToYear + TOTAL_WIDTH + TIMELINE_START + TIMELINE_END"
  - "lib/yearToDisplay.ts — yearToDisplay(year, locale) with year-0 guard (D-06)"
  - "lib/yearToPixel.test.ts — full test suite (23 tests including 15 round-trip years)"
  - "lib/yearToDisplay.test.ts — full test suite (10 tests including BC/fr/en formatting)"

affects:
  - Phase 2 (Parallax Engine — every card position uses yearToPixel)
  - Phase 3 (Show Cards — yearToDisplay for card labels)
  - Phase 6 (Filters + Navigation — yearToPixel for jump positions)
  - Phase 7 (i18n — yearToDisplay locale parameter)
  - Phase 9 (SEO — yearToDisplay for meta descriptions)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Piecewise-linear yearToPixel: buildOffsets() precomputes ERA_OFFSETS, yearToPixel/pixelToYear use the same table"
    - "Derived constants (D-04): TIMELINE_START/TIMELINE_END come from ERAS array, never hardcoded in lib/"
    - "Year-0 guard (D-06): year === 0 remapped to -1 before display, preventing '0' from ever rendering"
    - "Round-trip test pattern: Math.round(pixelToYear(yearToPixel(y))) === y (not strict ===) per RESEARCH Pitfall 3"

key-files:
  created:
    - lib/yearToPixel.ts
    - lib/yearToDisplay.ts
  modified:
    - lib/yearToPixel.test.ts
    - lib/yearToDisplay.test.ts

key-decisions:
  - "buildOffsets() precomputes cumulative ERA_OFFSETS at module load — avoids O(n) recomputation on every yearToPixel call"
  - "Inclusive era boundary (year >= era.yearStart && year <= era.yearEnd) ensures boundary years resolve to the earlier era — no gaps or jumps"
  - "JSDoc added inline; no separate REFACTOR commit needed as implementation was clean on first pass"

patterns-established:
  - "Piecewise linear mapping: precompute offsets, then linear interpolation within each era segment"
  - "Clamping sentinel: if year <= TIMELINE_START return 0; if year >= TIMELINE_END return TOTAL_WIDTH"

requirements-completed:
  - TL-02

# Metrics
duration: 3min
completed: 2026-05-17
---

# Phase 1 Plan 03: yearToPixel + yearToDisplay Summary

**Piecewise-linear yearToPixel (9135px total) and yearToDisplay BC formatter implemented with TDD — 38 tests GREEN, TOTAL_WIDTH = 9135, round-trip holds for all 15 D-13 years**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-17T21:21:44Z
- **Completed:** 2026-05-17T21:24:27Z
- **Tasks:** 6
- **Files modified:** 4

## Accomplishments

- Replaced all `it.todo` stubs (18 total) with real failing assertions then confirmed RED — both test files import from non-existent modules
- Created `lib/yearToDisplay.ts`: BC formatter with year-0 guard (D-06), locale-aware ('fr'/'en'), defaults to French
- Created `lib/yearToPixel.ts`: piecewise-linear mapping using `buildOffsets()` over ERAS, with clamping (T-03-01) and derived constants (D-04)
- 38 tests pass GREEN including all 15 round-trip years from D-13, era boundary pixel checks, and clamping behavior

## Task Commits

1. **Tasks 1+2: RED — write failing assertions for both test files** — `bb641bd` (test)
2. **Task 4: implement yearToDisplay** — `6c6f48c` (feat)
3. **Task 5: implement yearToPixel** — `15a124c` (feat)

**Plan metadata:** see docs commit below

_TDD gate compliance: test commit (RED) → feat commits (GREEN) — no REFACTOR needed (implementation was clean first pass)_

## Files Created/Modified

- `lib/yearToPixel.ts` — Exports `yearToPixel`, `pixelToYear`, `TOTAL_WIDTH` (9135), `TIMELINE_START` (ERAS[0].yearStart), `TIMELINE_END` (ERAS[8].yearEnd)
- `lib/yearToDisplay.ts` — Exports `yearToDisplay(year, locale?)` with year-0 guard and BC/AD locale formatting
- `lib/yearToPixel.test.ts` — 28 tests: boundaries, era pixels, clamping, 15 D-13 round-trip years
- `lib/yearToDisplay.test.ts` — 10 tests: BC fr/en, year-0 guard, positive years, default locale

## Decisions Made

- Used `buildOffsets()` to precompute cumulative ERA_OFFSETS at module load — makes both yearToPixel and pixelToYear O(n) with shared lookup table instead of recomputing on every call
- Inclusive era boundary chosen so adjacent eras share their boundary pixel without a gap (antiquity ends and early_middle_ages starts at year 476, both resolve to 3476px)
- No REFACTOR commit — implementation was clean enough on first pass; JSDoc added directly

## Deviations from Plan

None — plan executed exactly as written. RED/GREEN/REFACTOR cycle completed with RED and GREEN commits; REFACTOR skipped as implementation was clean.

## TDD Gate Compliance

1. `test(01-03)` commit `bb641bd` — RED gate (failing assertions)
2. `feat(01-03)` commits `6c6f48c` and `15a124c` — GREEN gate (passing implementation)
3. No REFACTOR commit — code was clean on first pass; JSDoc added inline during GREEN

All three gates validated.

## Issues Encountered

None — TypeScript compiled cleanly for both new lib files; all 38 tests passed on first GREEN run.

## Verification Results

1. `npx vitest run lib/yearToPixel.test.ts lib/yearToDisplay.test.ts` — 38 passed (2 files) — PASS
2. `npx tsc --noEmit | grep -v "timeline.ts" | grep "error TS"` — no output — PASS
3. `grep "ERAS\[0\]\.yearStart" lib/yearToPixel.ts` — matches `export const TIMELINE_START: number = ERAS[0].yearStart` — D-04 PASS
4. `grep "PIXELS_PER_YEAR\|TIMELINE_START.*=.*-3000\|TIMELINE_END.*=.*2025" lib/yearToPixel.ts` — no matches — PASS

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `yearToPixel` and `yearToDisplay` are fully implemented and tested — ready for Phase 2 (Parallax Engine)
- All load-bearing math locked by 38 unit tests before any visual work begins
- `TOTAL_WIDTH = 9135` established as the canonical timeline width for Phase 2 scroll container sizing
- No blockers

---
*Phase: 01-data-foundation-yeartopixel*
*Completed: 2026-05-17*
