---
id: T02
parent: S03
milestone: M001
key_files:
  - lib/filters.ts
  - tests/filters.test.ts
key_decisions:
  - Implemented D003's predicate composition as small named builders (byRegions, byGenres, byPlatforms, byMinAccuracy) plus a generic combinePredicates(AND) and buildShowFilterPredicate composer, so a future nuqs-bound FilterPanel slice can call filterShows(shows, criteria) directly or reuse individual builders without re-deriving matching logic.
duration: 
verification_result: passed
completed_at: 2026-07-26T20:40:17.714Z
blocker_discovered: false
---

# T02: Added lib/filters.ts with composable region/genre/platform/accuracy show predicates per D003, covered by 25 Vitest cases against the real 53-show dataset.

**Added lib/filters.ts with composable region/genre/platform/accuracy show predicates per D003, covered by 25 Vitest cases against the real 53-show dataset.**

## What Happened

Implemented lib/filters.ts per D003's exact semantics: byRegions/byGenres/byPlatforms each build a predicate that matches when the show's array intersects the criteria array (OR-within-category), treating undefined or empty-array criteria as "no filter" (matches all). byMinAccuracy builds a threshold predicate (historicalAccuracyScore >= minAccuracy, undefined = no filter). combinePredicates ANDs a list of predicates together, and buildShowFilterPredicate composes all four category builders into one predicate consumed by filterShows(shows, criteria). No FilterPanel/nuqs wiring was added — per the slice's Integration Closure section, that binding is explicitly deferred to a future UI slice; this task only establishes the pure predicate/composition contract.

Wrote tests/filters.test.ts against the real data/shows.ts dataset (53 shows, no mocks, consistent with MEM001). Tests cover: each predicate builder individually against two known fixture shows (spartacus: mediterranean/peplum,war/prime_video,other/accuracy 2; rome: mediterranean,europe_west/peplum,biopic/max/accuracy 4) for both match and non-match cases, undefined/empty-array "no filter" behavior, combinePredicates' AND semantics (including the vacuous-AND empty-list case), and integration-level filterShows assertions that cross-check against manual `.filter()` calls over the real dataset for single-category, OR-within-category, AND-across-category, minAccuracy threshold, and an impossible-threshold empty-result case.

## Verification

Ran the task-level and slice-level verification commands via gsd_exec: `npx vitest run tests/filters.test.ts` (25/25 passed), then the full suite `npx vitest run` to confirm no regressions (86/86 passed across data-integrity, year-to-pixel, year-to-display, and filters test files), then `npx tsc --noEmit` (clean, exit 0).

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx vitest run tests/filters.test.ts` | 0 | pass | 3586ms |
| 2 | `npx vitest run` | 0 | pass | 7446ms |
| 3 | `npx tsc --noEmit` | 0 | pass | 7446ms |

## Deviations

None.

## Known Issues

None. FilterPanel UI and nuqs query-state binding remain out of scope per the slice's Integration Closure section, to be built in a future UI slice.

## Files Created/Modified

- `lib/filters.ts`
- `tests/filters.test.ts`
