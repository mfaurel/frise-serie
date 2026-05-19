---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: in_progress
last_updated: "2026-05-19T22:48:00Z"
progress:
  total_phases: 9
  completed_phases: 1
  total_plans: 7
  completed_plans: 7
  percent: 15
---

# Project State — Frise Série

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-17)

**Core value:** The parallax scroll experience with 100+ historically-accurate show placements
**Current focus:** Phase 1 — ready to execute (5 plans)
**Milestone:** v1 Launch

## Phase Progress

| Phase | Name | Status | Completed |
|-------|------|--------|-----------|
| 1 | Data Foundation + yearToPixel | Complete | 2026-05-17 |
| 2 | Parallax Engine + Era Backgrounds | In Progress | — |
| 3 | Show Cards | Pending | — |
| 4 | Historical Events + Flashbacks | Pending | — |
| 5 | Detail Panel | Pending | — |
| 6 | Filters + Search + Navigation | Pending | — |
| 7 | Bilingual Routing + i18n | Pending | — |
| 8 | Mobile Polish + WCAG AA | Pending | — |
| 9 | Data Completion + SEO | Pending | — |

## Active Blockers

None

## Decisions

- **01-01:** environment: node globally for Phase 1 math tests; component tests (Phase 3+) override per file with @vitest-environment jsdom
- **01-01:** No globals: true in vitest.config — all test files use explicit named imports from vitest (D-12)
- **01-01:** it.todo for unimplemented Wave 2 cases, not it.skip — todos list but do not fail
- **01-02:** pixelsPerYear placed after yearEnd in HistoricalEra interface and era objects for consistent ordering
- **01-02:** 20th_century_late yearEnd extended to 2025 (from 1991); name "Cold War" kept — renaming is Phase 9 scope
- **01-02:** Timeline boundaries now derived from ERAS array, not exported constants — ERAS is the single source of truth
- **01-03:** buildOffsets() precomputes ERA_OFFSETS at module load — avoids O(n) recomputation on every yearToPixel call
- **01-03:** Inclusive era boundary ensures no gap at shared boundary years (e.g. year 476 = 3476px in both antiquity and early_middle_ages)
- **01-04:** Append new SHOWS entries at end of array in chronological order — no mid-array insertions; array sort not required
- **01-04:** posterUrl: '' (empty string) for unverified TMDB hashes; prevents broken image loads until Phase 9 enrichment
- **01-05:** lib/timeline.ts is a pure re-export shim; Phase 2 will remove this file and update callers to import directly from lib/yearToPixel.ts or lib/yearToDisplay.ts
- **01-05:** PIXELS_PER_YEAR intentionally absent from the shim — deleted in Wave 1; Phase 2+ callers must update their imports
- **02-01:** TimelineSkeleton component import commented out in test file — prevents TypeScript error on missing module; Wave 1 creates the component and un-todos the stubs
- **02-01:** NOISE_SVG_URI import comment above each it.todo in noiseUri.test.ts — documents exact import path (lib/noiseConstants.ts) Wave 1 must provide
- **02-01:** parallaxFormula.test.ts uses pure arithmetic with no DOM or Motion API — stays in node environment (default vitest)
- **02-02:** NOISE_SVG_URI extracted to lib/noiseConstants.ts — single source of truth for BackgroundLayer and test suite
- **02-02:** BackgroundLayer.tsx uses combined backgroundImage (NOISE_SVG_URI + linear-gradient) with backgroundBlendMode overlay and backgroundSize '200px 200px, 100% 100%'
- **02-02:** TimelineSkeleton.test.ts uses React.createElement to avoid double-render in @testing-library/react container
- **02-03:** AxisLayer accepts currentYear prop but does not render it — reserved for Phase 6 current-year marker on axis; TODO comment documents intent
- **02-03:** ShowCard.tsx import updated to @/lib/yearToDisplay directly — eliminates shim dependency before Plan 04 deletes @/lib/timeline

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 01 | 01 | 8min | 2 | 4 |
| 01 | 02 | 3min | 2 | 3 |
| 01 | 03 | 3min | 6 | 4 |
| 01 | 04 | 8min | 1 | 1 |
| 01 | 05 | 5min | 2 | 2 |
| 02 | 01 | 10min | 2 | 3 |
| 02 | 02 | 8min | 2 | 6 |
| 02 | 03 | 5min | 2 | 2 |

## Last Updated

2026-05-17 — Plan 01-05 complete: lib/timeline.ts converted to re-export shim, CLAUDE.md corrected with actual stack versions and BC dates convention. Phase 1 complete — npx tsc --noEmit exits 0, 38 tests passing.

2026-05-19 — Plan 02-01 complete: Wave 0 Nyquist test stubs created. 3 new passing tests (parallaxFormula), 8 new it.todo stubs (noiseUri x3, TimelineSkeleton x5). Full suite 41 passing + 9 todo, 0 failing.

2026-05-19 — Plan 02-02 complete: Server Components BackgroundLayer.tsx and TimelineSkeleton.tsx created. lib/noiseConstants.ts extracted for shared NOISE_SVG_URI. noiseUri tests un-todoed (3 passing). TimelineSkeleton tests un-todoed (2 passing). Full suite 46 passing + 4 todo, 0 failing. @testing-library/react installed (Rule 3 auto-fix).

2026-05-19 — Plan 02-03 complete: AxisLayer.tsx extracted from Timeline.tsx as standalone 'use client' component (yearToDisplay, zoom/locale/ticks/currentYear props). ShowCard.tsx import updated from @/lib/timeline/formatYear to @/lib/yearToDisplay/yearToDisplay. Full suite 46 passing + 4 todo, 0 failing. npx tsc --noEmit exits 0.
