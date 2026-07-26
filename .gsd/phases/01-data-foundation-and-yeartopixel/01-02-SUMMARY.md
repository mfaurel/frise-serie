---
id: S02
parent: M001
milestone: M001
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - lib/constants.ts
  - lib/density.ts
  - lib/yearToPixel.ts
  - lib/pixelToYear.ts
  - tests/year-to-pixel.test.ts
key_decisions:
  - Historical-to-astronomical year conversion (toAstronomicalYear/fromAstronomicalYear) is applied only to the interpolation fraction inside a zone, not to buildDensityZones' stored pixelStart/pixelEnd/pxPerYear, so era-boundary pixel continuity is preserved exactly while BC/AD round-trips stay exact.
  - Zone lookup for yearToPixel and pixelToYear clamps out-of-range input to the nearest boundary zone instead of throwing — only an empty zones array throws, keeping both functions effectively total.
  - Test oracle for BC/AD boundary zones must use the zone's effective px-per-astronomical-year (pixelSpan/astroSpan), not its raw stored pxPerYear, which differ by ~0.03% for the antiquity zone.
patterns_established:
  - Pure-function density/mapping modules parameterized by an explicit totalWidth argument, with no precomputed data/density.ts until a real consumer (Timeline component) establishes an actual viewport width
  - Internal no-year-zero handling isolated to interpolation fractions, keeping zone boundary math on raw historical years
observability_surfaces:
  - none — pure synchronous functions with no runtime state; failures surface as thrown exceptions or failing Vitest assertions, not as a running system needing log/metric inspection
drill_down_paths:
  - .gsd/phases/01-data-foundation-and-yeartopixel/S02-T01-SUMMARY.md
  - .gsd/phases/01-data-foundation-and-yeartopixel/S02-T02-SUMMARY.md
  - .gsd/phases/01-data-foundation-and-yeartopixel/S02-T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-07-26T20:33:47.106Z
blocker_discovered: false
---

# S02: yearToPixel density algorithm

**Non-linear yearToPixel/pixelToYear mapping driven by real show density, with exact BC-date round-trips proven by a 25-case Vitest suite**

## What Happened

S02 delivered the milestone's critical-path density algorithm across three tasks. T01 implemented buildDensityZones (lib/density.ts) and lib/constants.ts, computing contiguous non-linear pixel zones from real show/era data (data/shows.ts, data/eras.ts) with px/year density capped between MIN_PX_PER_YEAR and MAX_PX_PER_YEAR per ARCHITECTURE.md lines 148-178, bucketing shows by narrativeYearStart per D002. T02 implemented yearToPixel and pixelToYear (lib/yearToPixel.ts, lib/pixelToYear.ts) on top of that zone structure, handling the "no year zero" historical/astronomical year convention internally — the conversion is applied only to the interpolation fraction within a zone, not to the zones' stored pixelStart/pixelEnd/pxPerYear, preserving era-boundary pixel continuity while still round-tripping BC/AD years exactly. Zone lookup clamps out-of-range years to the nearest boundary zone rather than throwing, so both functions are total except for an empty zones array. T03 proved all of this with a 25-case Vitest suite against the real dataset plus synthetic edge-case fixtures, covering linear interpolation, era boundaries, BC dates, density caps, and exact inverse round-trips (including the roadmap's Vikings/793 demo case). One subtle test-oracle bug was caught and fixed during T03: the BC/AD boundary assertion must use the zone's effective px-per-astronomical-year rather than its raw stored pxPerYear, since those differ by ~0.03% for the one zone (antiquity) that straddles year 0.

## Verification

Fresh slice-level verification run at closeout: `npx vitest run tests/year-to-pixel.test.ts` — 1 test file, 25/25 tests passed (exit 0). `npx tsc --noEmit` — clean compile, exit 0, confirming lib/constants.ts, lib/density.ts, lib/yearToPixel.ts, lib/pixelToYear.ts, and tests/year-to-pixel.test.ts all type-check together against types/index.ts and the real data files. This matches and re-confirms the per-task verification evidence recorded in T01/T02/T03 summaries.

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

None. All three tasks executed as planned; the only mid-task correction was fixing the test suite's own BC/AD boundary oracle (T03), not a change to the plan.

## Known Limitations

Branch coverage was verified by manual code tracing rather than an automated coverage tool (@vitest/coverage-v8 is not installed and wasn't required by the slice's verify command). These functions are not yet wired into any component — data/density.ts precomputation and a concrete totalWidth are deferred to the first UI slice that consumes them (per D001), and S03 (yearToDisplay formatting) is still pending.

## Follow-ups

S03 (year display formatting) and later UI slices (Timeline, ShowCardLayer, AxisLayer) will be the first real consumers of buildDensityZones/yearToPixel/pixelToYear and will need to settle on a concrete totalWidth.

## Files Created/Modified

- `lib/constants.ts` — Density caps (MIN/MAX_PX_PER_YEAR) and virtual canvas width constants shared by density.ts and yearToPixel.ts
- `lib/density.ts` — buildDensityZones: computes non-linear contiguous DensityZone[] from show distribution per era, bucketed by narrativeYearStart, capped px/year
- `lib/yearToPixel.ts` — yearToPixel forward mapping with internal no-year-zero (astronomical year) handling for the interpolation fraction
- `lib/pixelToYear.ts` — pixelToYear inverse mapping, exact round-trip with yearToPixel across every era including BC dates
- `tests/year-to-pixel.test.ts` — 25-case Vitest suite covering linear interpolation, era boundaries, BC dates, density caps, and inverse-mapping accuracy against real data/shows.ts + data/eras.ts
