---
id: S03
parent: M001
milestone: M001
provides:
  - lib/yearToDisplay.ts: BC/AD FR/EN year formatting
  - lib/filters.ts: composable region/genre/platform/accuracy show filter predicates
requires:
  - slice: S01
    provides: types/index.ts (Show, Region, Genre, Platform) and data/shows.ts real dataset used by filter tests
affects:
  - future milestone: filter-selection component + query-state binding, axis/label rendering via yearToDisplay
key_files:
  - lib/yearToDisplay.ts
  - lib/filters.ts
  - tests/year-to-display.test.ts
  - tests/filters.test.ts
key_decisions:
  - Local Locale = "fr" | "en" union type defined in lib/yearToDisplay.ts since no shared Locale type exists in types/index.ts yet
  - D003 filter composition implemented as small named predicate builders (byRegions, byGenres, byPlatforms, byMinAccuracy) plus generic combinePredicates(AND) and buildShowFilterPredicate composer
patterns_established:
  - Composable predicate-builder pattern for pure filter logic, reusable by a future filter-selection component without re-deriving matching logic
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-07-26T20:42:23.229Z
blocker_discovered: false
---

# S03: Year display formatting and filter utilities

**Added lib/yearToDisplay.ts (BC/AD FR/EN formatting incl. year-0 century edge case) and lib/filters.ts (composable region/genre/platform/accuracy predicates per D003), completing M001's pure-function contract layer with 36 new Vitest cases and zero regressions.**

## What Happened

S03 closed out M001's pure-function layer alongside S01 (types/data) and S02 (yearToPixel/pixelToYear). T01 added lib/yearToDisplay.ts, which formats historical years for display in French and English per TECHNICAL.md section 13: positive years pass through unchanged, negative (BC) years render as "N av. J.-C." (fr) / "N BC" (en), and year 0 gets the special-cased "Ier s." / "1st c." century label. It defines a local Locale = "fr" | "en" union since no shared Locale type exists yet in types/index.ts. 11 Vitest cases cover this, including the exact roadmap demo assertions (yearToDisplay(-73, "fr") === "73 av. J.-C." and yearToDisplay(-73, "en") === "73 BC").

T02 added lib/filters.ts, implementing D003's filter semantics (AND across categories, OR within a category, empty-means-no-filter) as small named predicate builders — byRegions, byGenres, byPlatforms, byMinAccuracy — composed via a generic combinePredicates(AND) helper and a top-level buildShowFilterPredicate/filterShows composer. 25 Vitest cases exercise this against the real 53-show dataset in data/shows.ts, not mocks, so the predicate logic is proven against actual data shape and distribution rather than synthetic fixtures.

Both tasks are pure functions with no consumer wiring yet: no filter-selection component or query-state binding exists, matching S02's posture before any timeline-rendering component existed. That wiring is explicitly deferred to a future milestone.

## Verification

Ran the full project verification via gsd_exec: `npx vitest run && npx tsc --noEmit`. All 4 test files passed — 86/86 tests total (11 year-to-display + 25 filters + 25 year-to-pixel + 25 data-integrity), confirming no regressions to prior slices. `npx tsc --noEmit` completed with exit 0 in strict mode. Separately confirmed the roadmap's literal demo assertions are present and passing in tests/year-to-display.test.ts: yearToDisplay(-73, "fr") === "73 av. J.-C." and yearToDisplay(-73, "en") === "73 BC".

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

Filter-selection component and query-state binding remain out of scope — no consumer of yearToDisplay or filters.ts exists yet in the rendering layer. This mirrors S02's posture before any timeline-rendering component existed.

## Follow-ups

A future slice must build the filter-selection component, bind query state to filters.ts's criteria shape, and call yearToDisplay from axis/label rendering.

## Files Created/Modified

None.
