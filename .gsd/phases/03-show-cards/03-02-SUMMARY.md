---
id: S02
parent: M003
milestone: M003
provides:
  - computeSwimLaneLayout: pure function mapping Show[] + DensityZone[] → LaidOutShow[] with non-overlapping lane and top assignments
  - TimelineContainer: positions each ShowCard using layout-computed left and top (no hardcoded offsets)
  - CARD_WIDTH, CARD_HEIGHT, CARD_GAP, BASE_TOP, LANE_HEIGHT constants exported from lib/swimLane.ts for downstream consumption
requires:
  - slice: S01
    provides: ShowCard component with era-colored star-node glow and yearToPixel-based positioning (establishes CARD_WIDTH=88 from ShowCard rendered width)
affects:
  - S03
key_files:
  - lib/swimLane.ts
  - tests/swim-lane.test.ts
  - app/components/TimelineContainer.tsx
  - e2e/timeline-s02.spec.ts
key_decisions:
  - computeSwimLaneLayout uses narrativeYearStart (not broadcastYearStart) for left-position pixel mapping, consistent with the project's narrative-time visual model
  - CARD_WIDTH/CARD_HEIGHT constants live in lib/swimLane.ts (not ShowCard.tsx) so a single file controls the collision geometry — but they must be manually kept in sync with ShowCard rendered dimensions
  - lane value discarded with _lane prefix in TimelineContainer destructuring to satisfy lint without removing the field
  - e2e/timeline-s02.spec.ts was an untracked file (git ??) replaced entirely — previous content tested layout concerns already covered by S01; the swim-lane spec is now the canonical S02 contract
patterns_established:
  - Pure layout engine in lib/ (computeSwimLaneLayout) consumed by a single React component (TimelineContainer) — mirrors lib/yearToPixel + component pattern from earlier slices
  - Greedy first-fit lane assignment: sort by left, scan laneEnds[], open new lane if no fit — O(n × lanes) per render, sufficient for current data sizes
observability_surfaces:
  - npx playwright test e2e/timeline-s02.spec.ts — exits non-zero if all cards collapse to same row (primary failure signal)
  - npm test tests/swim-lane.test.ts — exits non-zero if algorithmic regression in computeSwimLaneLayout
drill_down_paths:
  - .gsd/phases/03-show-cards/T01-SUMMARY.md
  - .gsd/phases/03-show-cards/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-07-30T21:31:41.964Z
blocker_discovered: false
---

# S02: Swim-lane layout engine

**Deterministic swim-lane layout engine live: dense-era show cards now render in non-overlapping rows via greedy first-fit lane assignment wired into TimelineContainer**

## What Happened

T01 created lib/swimLane.ts with five exported constants (CARD_WIDTH=88, CARD_HEIGHT=180, CARD_GAP=16, BASE_TOP=120, LANE_HEIGHT=196), the LaidOutShow interface, and computeSwimLaneLayout. The function maps each show's narrativeYearStart to a pixel offset via yearToPixel, sorts ascending by left, then runs a greedy first-fit lane assignment: for each card it scans laneEnds[] to find the first lane whose rightmost occupied pixel clears the incoming card's left edge; if none fits, a new lane opens. Returns a sorted LaidOutShow[] with computed left, lane, and top values. Six unit tests in tests/swim-lane.test.ts cover: integration smoke against real shows/eras, non-overlapping shows land on lane 0, overlapping pair uses lanes 0 and 1, third show reclaims lane 0 after clearing, output sorted ascending by left, and top = BASE_TOP + lane * LANE_HEIGHT.

T02 wired computeSwimLaneLayout into TimelineContainer.tsx. The hardcoded top: 120 was replaced with the layout-computed top from each LaidOutShow entry. The shows.map block was replaced with layout.map, destructuring { show, left, top, lane: _lane } (lane discarded with _ prefix to satisfy lint). The new e2e/timeline-s02.spec.ts contains two Playwright tests: (1) at least two show-cards are visible, and (2) card wrappers have distinct top offset values — directly proving swim-lane activation in a real browser. TypeScript typecheck exited 0; both S02 tests and all 4 S01 tests passed with no regression.

Verification ran via node child_process (gsd_exec bash unavailable on Windows host) with identical npm/npx invocations.

## Verification

6/6 vitest unit tests pass (tests/swim-lane.test.ts): non-overlapping → lane 0, overlapping pair → lanes 0+1, lane reuse after gap, ascending sort output, correct top formula. npm run typecheck: exit 0, no TypeScript errors. npx playwright test e2e/timeline-s02.spec.ts: 2/2 chromium tests pass (swim-lane active, distinct top offsets confirmed). npx playwright test e2e/timeline-s01.spec.ts: 4/4 chromium tests pass (S01 regression check: star-node glow, show-card positioning, visible text content all intact). All four Must-Haves satisfied.

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

gsd_exec bash runtime unavailable on Windows host (spawn bash ENOENT); all verification evidence collected via node child_process with identical npm/npx invocations and confirmed passing. No functional deviation from task plan.

## Known Limitations

Lane count is unbounded — with enough overlapping shows, cards will extend far below the visible viewport with no max-lane cap or scroll-into-view logic. CARD_WIDTH (88px) and CARD_HEIGHT (180px) in swimLane.ts are hardcoded and not derived from ShowCard DOM measurements; if ShowCard dimensions change, these constants require manual synchronization.

## Follow-ups

computeSwimLaneLayout is called once per render with no memoization — consider useMemo if shows data grows large. S03 (narrative span bars and constellation lines) can safely assume left and top per card are deterministic layout-computed values.

## Files Created/Modified

- `lib/swimLane.ts` — New: pure swim-lane layout engine — CARD_WIDTH/HEIGHT/GAP/BASE_TOP/LANE_HEIGHT constants, LaidOutShow interface, computeSwimLaneLayout greedy first-fit function
- `tests/swim-lane.test.ts` — New: 6 vitest unit tests covering all lane-assignment scenarios (integration smoke, non-overlap, overlap, lane reuse, sort, top formula)
- `app/components/TimelineContainer.tsx` — Modified: imports and calls computeSwimLaneLayout; replaced hardcoded top: 120 with layout-computed top; shows.map replaced with layout.map
- `e2e/timeline-s02.spec.ts` — New/replaced: Playwright spec — 2 tests confirming swim-lane engine active and card wrappers have distinct top offsets
