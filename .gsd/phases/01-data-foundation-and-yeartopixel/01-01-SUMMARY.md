---
id: S01
parent: M001
milestone: M001
provides:
  - types/index.ts: Show, Era, HistoricalEvent, Flashback, Genre, Region, Platform, DensityZone, LocalizedString types
  - data/shows.ts, data/eras.ts, data/events.ts: typed static historical data
requires:
  []
affects:
  - S02
  - S03
key_files: []
key_decisions:
  - LocalizedString extracted as shared {fr,en} interface reused across 4+ types
  - Era named 'Era' not 'HistoricalEra' per slice plan/ARCHITECTURE.md
  - DensityZone included in types/index.ts (S01) rather than S02, per ARCHITECTURE.md's type sketch
  - Data-integrity tests read real static data directly rather than mocking, since the static data is the real surface for a data-only slice
  - Era contiguity (sorted yearStart == previous yearEnd) verified as an implicit integrity constraint from ARCHITECTURE.md's continuous-timeline model
patterns_established:
  - No-mocks data-integrity testing: read real data/*.ts directly in tests, reuse validator logic against both real data and contrived bad inputs
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-07-26T20:14:10.030Z
blocker_discovered: false
---

# S01: TypeScript types and static data files

**Typed data foundation (Show/Era/HistoricalEvent/DensityZone contracts, 53 shows, 9 eras, 34 events) with 25 passing data-integrity tests**

## What Happened

S01 established the foundational data layer for the timeline. T01 bootstrapped the project (Next.js 16, Motion 12, Tailwind v4, nuqs, next-intl, Vitest 4.1, strict TypeScript with bundler resolution and path aliases). T02 defined types/index.ts with Show, Era, HistoricalEvent, Flashback, Genre, Region, Platform, DensityZone, and LocalizedString types matching the PRD/ARCHITECTURE.md data model — DensityZone was pulled forward from S02 since ARCHITECTURE.md already sketches it as consumed by the density engine. T03 populated data/shows.ts (53 shows), data/eras.ts (9 eras), and data/events.ts (34 events) with real historical TV series data spanning Antiquity to Contemporary, fully typed against types/index.ts. T04 added 25 Vitest tests in tests/data-integrity.test.ts covering quantity thresholds, referential integrity (event eraIds resolve to real eras), BC-date handling, era contiguity, and malformed/negative-input guards, reading the real static data directly rather than mocking it.

## Verification

Ran full slice verification via gsd_exec: `npx tsc --noEmit` exited 0 (zero TypeScript errors across types/index.ts, data/shows.ts, data/eras.ts, data/events.ts, tests/data-integrity.test.ts under strict mode). `npx vitest run` executed tests/data-integrity.test.ts — 25/25 tests passed in 37ms (453ms total including transform/setup/import). This reconfirms each task's individual verification (T01-T04, all passed) at the whole-slice level with no regressions.

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

None — all four tasks executed as planned with no scope changes.

## Known Limitations

No yearToPixel/pixelToYear density algorithm yet (S02) — the data layer exists but nothing maps years to pixel positions. No year display formatting (S03) — BC dates are stored as negative numbers but not yet formatted for FR/EN display. No UI renders any of this data yet; this slice is purely a typed data contract proven by compilation and unit tests, not by visual rendering.

## Follow-ups

S02 (yearToPixel density algorithm) and S03 (year display formatting) both depend on this slice's types/index.ts and data/*.ts and can now proceed in parallel.

## Files Created/Modified

- `package.json` — Project bootstrap: Next.js 16, Motion 12, Tailwind v4, nuqs, next-intl, Vitest 4.1
- `tsconfig.json` — Strict TypeScript config, bundler resolution, path aliases
- `vitest.config.ts` — Vitest node-environment config
- `.gitignore` — Standard Next.js/Node ignores
- `types/index.ts` — Show, Era, HistoricalEvent, Flashback, Genre, Region, Platform, DensityZone, LocalizedString types
- `data/shows.ts` — 53 typed historical TV series
- `data/eras.ts` — 9 typed era definitions with contiguous year ranges
- `data/events.ts` — 34 typed historical event markers
- `tests/data-integrity.test.ts` — 25 Vitest tests: quantity thresholds, referential integrity, BC dates, era contiguity, malformed-input guards
