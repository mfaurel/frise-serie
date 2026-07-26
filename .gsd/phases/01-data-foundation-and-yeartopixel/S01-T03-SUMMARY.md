---
id: T03
parent: S01
milestone: M001
key_files:
  - (none)
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-07-26T20:10:34.039Z
blocker_discovered: false
---

# T03: Populated data/shows.ts (53 shows), data/eras.ts (9 eras), and data/events.ts (34 events) with real historical TV series data spanning Antiquity to Contemporary, fully typed against types/index.ts.

**Populated data/shows.ts (53 shows), data/eras.ts (9 eras), and data/events.ts (34 events) with real historical TV series data spanning Antiquity to Contemporary, fully typed against types/index.ts.**

## What Happened

Created the three static data files required by the slice plan. `data/eras.ts` defines 9 eras (Antiquity, Middle Ages, Renaissance, Early Modern/Baroque, Age of Revolutions, 19th Century, World Wars, Cold War, Contemporary) sourced from ERA-ILLUSTRATION-PROMPTS.md, reusing its exact year ranges and color-anchor hex codes for `colorPalette`. `data/events.ts` defines 34 real historical events (year + bilingual name), each tagged with an `eraId` via a local `TimelineEvent` interface that extends `HistoricalEvent`; `data/eras.ts` imports `events` and derives each era's required `keyEvents` field by filtering on `eraId`, so era/event data stays single-sourced. `data/shows.ts` defines 53 real TV series (Spartacus, Rome, Vikings, The Tudors, Versailles, Peaky Blinders, The Crown, Chernobyl, Homeland, etc.) covering all 9 eras, each with full bilingual title/context, narrative and broadcast year ranges (including BC dates as plain negative numbers, e.g. Spartacus narrativeYearStart: -73), historicalAccuracyScore, genres/regions/platforms drawn strictly from the fixed union types in types/index.ts, real historicalFigures and wikipediaUrl where applicable, and empty flashbacks/historicalFigures arrays where the show centers on fictional characters. Poster URLs follow the TMDB CDN path convention (documented in a file-level comment) but use placeholder hashes pending real TMDB API lookup — flagged in Known Issues below, matching the Phase 2 TMDB enrichment path already noted in TECHNICAL.md section 8.</narrative>
<parameter name="verification">Ran `npx tsc --noEmit` twice (before and after an ad-hoc runtime check) with exit code 0 both times, confirming all three new data files satisfy the Show/Era/HistoricalEvent types with zero compile errors. To verify the data actually imports and behaves correctly at runtime (not just type-checks), I wrote a temporary Vitest file (`tests/_tmp-t03-verify.test.ts`, deleted after the run — not the T04 deliverable) asserting: shows.length >= 50 with required fields populated on every show, eras.length >= 6 with contiguous year ranges (each era's yearStart equals the previous era's yearEnd), events.length >= 20 with every eraId matching a real era id, every era's keyEvents drawn correctly from events.ts, and BC dates (e.g. Spartacus at -73, Great Pyramid event at -2560) preserved as plain negative numbers. All 5 assertions passed.

## Verification

Verification evidence recorded: `npx tsc --noEmit` exited 0 (pass); `npx vitest run tests/_tmp-t03-verify.test.ts (temporary, deleted after run)` exited 0 (pass); `npx tsc --noEmit (final, post-cleanup)` exited 0 (pass).

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 5799ms |
| 2 | `npx vitest run tests/_tmp-t03-verify.test.ts (temporary, deleted after run)` | 0 | pass | 3652ms |
| 3 | `npx tsc --noEmit (final, post-cleanup)` | 0 | pass | 4298ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

None.
