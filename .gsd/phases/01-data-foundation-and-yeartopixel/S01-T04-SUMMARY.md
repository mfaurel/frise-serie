---
id: T04
parent: S01
milestone: M001
key_files:
  - tests/data-integrity.test.ts
key_decisions:
  - Tests read real static data (shows/eras/events) directly rather than mocking, per the 'no mocks outside test files, build through the real surface' rule — these are the real surface for a data-only slice.
  - Negative tests reuse the same validator logic (isValidScore, isValidRange, eraIds.has) against both contrived bad inputs and the full real dataset, so the guard is proven to catch bad data, not just assert the real data happens to be fine.
  - Verified era contiguity (sorted eras' yearStart == previous yearEnd) as an implicit integrity constraint, since ARCHITECTURE.md implies a continuous timeline with no era gaps.
duration: 
verification_result: passed
completed_at: 2026-07-26T20:12:27.069Z
blocker_discovered: false
---

# T04: Added 25 Vitest data-integrity tests covering quantity thresholds, referential integrity, BC-date handling, and negative/malformed-input guards for shows/eras/events.

**Added 25 Vitest data-integrity tests covering quantity thresholds, referential integrity, BC-date handling, and negative/malformed-input guards for shows/eras/events.**

## What Happened

Read the T01-T03 outputs (types/index.ts, data/shows.ts, data/eras.ts, data/events.ts) to understand the real shapes: Show, Era, and the TimelineEvent (HistoricalEvent + eraId) types, plus how eras.ts derives keyEvents by filtering events.ts on eraId. Wrote tests/data-integrity.test.ts with 25 tests across six describe blocks: (1) quantity requirements — shows>=50, eras>=6, events>=20; (2) show field completeness — unique ids, localized title/context non-empty, historicalAccuracyScore in 1-5, at least one genre/region/platform each drawn from the known enum unions, non-empty languages/countryAvailability/wikipediaUrl/posterUrl, historicalFigures/flashbacks are arrays; (3) BC date handling — negative narrativeYearStart/End render as plain numbers (not NaN) using Spartacus (-73/-71) as a concrete fixture, at least one show/era/event has a negative year, narrativeYearEnd/broadcastYearEnd are >= their start when non-null, and null is allowed for ongoing shows; (4) era integrity — unique ids, yearStart < yearEnd, non-empty palette/asset/description, and eras are chronologically contiguous with no gaps/overlaps when sorted; (5) event referential integrity — every event.eraId resolves to a real era, every event has a localized name, every event's year falls within its era's [yearStart, yearEnd] range, and every era's keyEvents (derived via keyEventsFor) only contains events matching that era's own id; (6) negative/malformed-input guards — assert a contrived unknown eraId is correctly rejected by the id-membership check, an out-of-range historicalAccuracyScore (0 or 6) is correctly flagged invalid by the same validator used against real data, and an inverted era year range is correctly flagged invalid. No source data or type files needed changes — the existing data model already imports cleanly from the `@/data/*` and `@/types` path aliases and vitest.config.ts already maps `@` to the project root, so no test-config changes were needed either.

## Verification

Ran npx tsc --noEmit (zero errors, confirming the new test file and its imports type-check against the strict tsconfig) and npx vitest run (1 file, 25/25 tests passed in 561ms), both via gsd_exec.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 4242ms |
| 2 | `npx vitest run` | 0 | pass — 25/25 tests | 3330ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `tests/data-integrity.test.ts`
