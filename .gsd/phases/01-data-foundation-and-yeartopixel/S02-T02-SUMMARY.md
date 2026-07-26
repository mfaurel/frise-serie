---
id: T02
parent: S02
milestone: M001
key_files:
  - lib/yearToPixel.ts
  - lib/pixelToYear.ts
key_decisions:
  - Historical-to-astronomical year conversion (toAstronomicalYear/fromAstronomicalYear) is applied only to the interpolation fraction inside the containing zone, not to buildDensityZones' stored pixelStart/pixelEnd/pxPerYear, so era-boundary pixel continuity from T01 is preserved exactly while BC/AD boundary years still round-trip exactly.
  - Zone lookup for both yearToPixel and pixelToYear clamps out-of-range input to the nearest boundary zone rather than throwing, keeping the functions total; only an empty zones array throws.
duration: 
verification_result: passed
completed_at: 2026-07-26T20:27:23.699Z
blocker_discovered: false
---

# T02: Implemented yearToPixel/pixelToYear with internal no-year-zero handling, verified exact round-trip across every era and the Vikings/BC demo cases against real data

**Implemented yearToPixel/pixelToYear with internal no-year-zero handling, verified exact round-trip across every era and the Vikings/BC demo cases against real data**

## What Happened

Implemented lib/yearToPixel.ts and lib/pixelToYear.ts consuming the DensityZone[] shape from T01's lib/density.ts.

yearToPixel(year, zones): finds the containing zone using the same half-open [yearStart, yearEnd) convention as T01's era bucketing (last zone fully inclusive), clamping out-of-range years to the nearest boundary zone instead of throwing (keeps the function total for slightly out-of-range input). Within the zone it interpolates linearly, but converts both the input year and the zone's yearStart/yearEnd to a continuous "astronomical" year (toAstronomicalYear: year>0 ? year-1 : year) before computing the fraction, so the missing historical year zero (TECHNICAL.md section 13: "1 BC -> 1 AD, no year 0") doesn't get double-counted when a zone spans the BC/AD boundary. The fraction is then applied to the zone's actual pixelStart/pixelEnd (as computed by T01), so era-boundary pixel continuity is unaffected.

pixelToYear(px, zones) is the exact structural inverse: same half-open zone lookup on pixelStart/pixelEnd, recovers the interpolation fraction, maps back to an astronomical year, rounds to the nearest integer (years are always integers), then converts back to a historical year with fromAstronomicalYear (astro>=0 ? astro+1 : astro).

Only the "antiquity" era (-3000 to 476) crosses the BC/AD boundary in the real dataset; all other 8 eras are entirely positive-year, where the astronomical conversion is a no-op shift that cancels out in the fraction, so this only meaningfully affects antiquity's zone.

Captured the BC-handling design as MEM006 (architecture) since it's a non-obvious internal detail future slices (S03 yearToDisplay, Timeline component) will need to know is already handled here rather than needing their own adjustment.

## Verification

Ran `npx tsc --noEmit` (exit 0) confirming both files type-check against DensityZone from types/index.ts and T01's lib/density.ts/lib/constants.ts. Ran a Node/tsx sanity script against the real data/shows.ts (53 shows) and data/eras.ts (9 eras) via buildDensityZones, confirming: (1) yearToPixel(793, zones) → pixelToYear(...) round-trips to exactly 793 (Vikings start demo case), (2) BC round-trip for {-3000, -73, -1, 1, 2, 476} all exactly recover the original year, with the 1BC→1AD gap measuring exactly one year's worth of pixels (not two), proving the no-year-zero adjustment is active, (3) antiquity.pixelEnd === middleAges.pixelStart (era boundary contiguity) and yearToPixel(476) lands exactly on that shared boundary pixel, (4) representative year samples (start/midpoint/end-1) across every one of the 9 zones round-trip exactly, (5) yearToPixel is monotonically non-decreasing across the full -3000..2026 range, (6) every zone's pxPerYear still respects the MIN/MAX caps established by T01.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 5605ms |
| 2 | `npx tsc --noEmit (final, after temp script cleanup)` | 0 | pass | 5994ms |
| 3 | `npx tsx scripts-temp-t02-sanity.mjs (real-data sanity: Vikings demo, BC round-trip, era boundary continuity, representative-sample round-trip, monotonicity, density caps)` | 0 | pass | 3861ms |

## Deviations

None — implemented as planned.

## Known Issues

None.

## Files Created/Modified

- `lib/yearToPixel.ts`
- `lib/pixelToYear.ts`
