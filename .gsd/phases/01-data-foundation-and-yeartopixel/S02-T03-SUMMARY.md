---
id: T03
parent: S02
milestone: M001
key_files:
  - tests/year-to-pixel.test.ts
key_decisions:
  - The BC/AD boundary test must compare against the zone's effective px-per-astronomical-year (pixelSpan/astroSpan), not its stored raw pxPerYear, because T02's no-year-zero adjustment makes those two rates differ by ~0.03% for any zone crossing the BC/AD boundary — asserting equality to raw pxPerYear is a subtly wrong oracle that looks correct until you compute it precisely.
duration: 
verification_result: mixed
completed_at: 2026-07-26T20:32:14.452Z
blocker_discovered: false
---

# T03: Added a 25-case Vitest suite in tests/year-to-pixel.test.ts proving buildDensityZones/yearToPixel/pixelToYear correctness against real show/era data and synthetic edge-case fixtures

**Added a 25-case Vitest suite in tests/year-to-pixel.test.ts proving buildDensityZones/yearToPixel/pixelToYear correctness against real show/era data and synthetic edge-case fixtures**

## What Happened

Wrote tests/year-to-pixel.test.ts covering the three pure functions from T01/T02 (lib/density.ts, lib/yearToPixel.ts, lib/pixelToYear.ts).

buildDensityZones: verified real-data zones are contiguous with no gaps/overlaps and every pxPerYear stays within MIN/MAX_PX_PER_YEAR; used constructed 2-era fixtures to prove the weight formula (max(1, showCount/avgShowCount)) produces a strictly higher pxPerYear for an above-average-density era than a below-average one, with exact expected pixelStart/pixelEnd values computed by hand; constructed fixtures that specifically force baseDensity*weight below MIN_PX_PER_YEAR and above MAX_PX_PER_YEAR to prove both clamp directions actually clamp (not just stay in range incidentally); verified the shows.length===0 branch (avgShowCount falls back to 0, weight defaults to 1) and that eras are sorted by yearStart regardless of input order.

yearToPixel/pixelToYear: verified the roadmap demo case directly (yearToPixel(793, zones) lands in the middle-ages zone matching a hand-computed pixelStart + pxPerYear*(793-yearStart) interpolation, and pixelToYear inverts it back to 793); verified a BC narrative year (Spartacus, -73) maps into the antiquity zone and round-trips exactly; verified the BC/AD transition is treated as exactly one year apart by computing the zone's actual effective px-per-astronomical-year (pixelSpan/astroSpan, since T02's astro-adjustment makes this slightly different from the zone's raw pxPerYear — my first draft of this test asserted equality to the raw pxPerYear and failed by ~0.03%, which is exactly the perturbation MEM006 documents; fixed by deriving the expected rate from toAstronomicalYear directly instead of assuming it equals pxPerYear); verified era-boundary continuity (year 476 lands exactly on the shared antiquity/middle-ages pixel boundary); verified the last zone's yearEnd is inclusive; verified out-of-range years/pixels (before the first zone, after the last zone) extrapolate linearly using the nearest boundary zone's rate rather than clamping to a fixed value, and still round-trip exactly; verified degenerate zero-year-span and zero-pixel-span zones hit the fraction-is-0 branch instead of dividing by zero; verified pixelToYear rounds a fractional astronomical year to the nearest integer with a hand-computed exact expected value; verified both functions throw on an empty zones array.

Round-trip coverage: pixelToYear(yearToPixel(year, zones), zones) === year asserted for start/midpoint/end-1 of every one of the 9 real eras, for every one of the 53 real shows' narrativeYearStart (including all BC values), and at the final zone's inclusive boundary.

Traced every branch in yearToPixel/pixelToYear by hand against the test cases (zone-loop match, last-zone-inclusive match, before-range fallback, after-range fallback, zero-span degenerate fraction) to confirm full branch coverage; did not add @vitest/coverage-v8 as a new dependency since it wasn't installed and isn't required by the slice's verify command.

## Verification

Ran `npx vitest run tests/year-to-pixel.test.ts && npx tsc --noEmit` — all 25 tests passed and the project type-checks cleanly. One test (BC/AD transition) initially failed with a 0.03% discrepancy; root-caused to the astro-year vs raw-year span mismatch already documented in MEM006, and fixed by computing the expected effective rate from toAstronomicalYear directly instead of assuming equality with the zone's raw pxPerYear.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx vitest run tests/year-to-pixel.test.ts` | 1 | fail (1/25 - BC/AD transition test used wrong expected rate) | 3346ms |
| 2 | `npx vitest run tests/year-to-pixel.test.ts && npx tsc --noEmit` | 0 | pass (25/25, tsc clean) | 8092ms |

## Deviations

None.

## Known Issues

None. Branch coverage was verified by manual code tracing rather than an automated coverage tool, since @vitest/coverage-v8 is not currently an installed dependency and adding it wasn't required by the slice's verify command.

## Files Created/Modified

- `tests/year-to-pixel.test.ts`
