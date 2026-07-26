---
id: T01
parent: S02
milestone: M001
key_files:
  - (none)
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-07-26T20:22:10.143Z
blocker_discovered: false
---

# T01: Implemented buildDensityZones and lib/constants.ts, computing non-linear contiguous pixel zones from real show/era data with capped px/year density

**Implemented buildDensityZones and lib/constants.ts, computing non-linear contiguous pixel zones from real show/era data with capped px/year density**

## What Happened

Added lib/constants.ts with VIRTUAL_CANVAS_WIDTH (20000, a test-fixture reference width per D001 — buildDensityZones still takes totalWidth as a required argument, no default), MIN_PX_PER_YEAR (1) and MAX_PX_PER_YEAR (20) density caps.

Implemented lib/density.ts's buildDensityZones(shows, eras, totalWidth) following ARCHITECTURE.md lines 148-178: (1) sorts eras by yearStart defensively rather than trusting caller order, (2) buckets each show into an era via Show.narrativeYearStart using a half-open [yearStart, yearEnd) interval per era (last era's yearEnd is inclusive) — per D002, narrativeYearStart is the bucketing field, not broadcastYearStart, (3) computes avgShowCount = totalShows/eraCount guarding against a zero-show dataset, (4) computes baseDensity = totalWidth/totalYears guarding against a zero-span dataset, (5) per era, weight = max(1, showCount/avgShowCount) then pxPerYear = clamp(baseDensity*weight, MIN_PX_PER_YEAR, MAX_PX_PER_YEAR), (6) accumulates pixelStart/pixelEnd offsets sequentially so zones are contiguous.

The "no year zero" BC/AD convention (TECHNICAL.md section 13) is intentionally left to T02 (yearToPixel/pixelToYear), per TECHNICAL.md's own note that yearToPixel handles it internally — T01's era-span arithmetic uses plain yearEnd-yearStart, matching the algorithm as literally specified in ARCHITECTURE.md.</narrative>
<parameter name="verification">Ran npx tsc --noEmit (exit 0, no errors) to confirm both new files type-check against the existing DensityZone/Era/Show types in types/index.ts. Also ran a mirrored-logic Node sanity script against the real data/shows.ts (53 shows) and the 9 real eras to confirm: zones are contiguous (each pixelStart === previous pixelEnd), monotonically increasing, every pxPerYear stays within [MIN_PX_PER_YEAR, MAX_PX_PER_YEAR], and year 793 (Vikings start) resolves to the middle-ages zone with an above-base pxPerYear (5.41 vs ~3.98 base), confirming the density weighting behaves as intended before T02/T03 consume it.

## Verification

Verification evidence recorded: `npx tsc --noEmit` exited 0 (pass); `node sanity script mirroring buildDensityZones against data/shows.ts + data/eras.ts` exited 0 (pass).

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 5966ms |
| 2 | `node sanity script mirroring buildDensityZones against data/shows.ts + data/eras.ts` | 0 | pass | 239ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

None.
