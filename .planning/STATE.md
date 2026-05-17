---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: in_progress
last_updated: "2026-05-17T21:20:04.376Z"
progress:
  total_phases: 9
  completed_phases: 0
  total_plans: 5
  completed_plans: 3
  percent: 0
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
| 1 | Data Foundation + yearToPixel | Planned (5 plans) | — |
| 2 | Parallax Engine + Era Backgrounds | Pending | — |
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

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 01 | 01 | 8min | 2 | 4 |
| 01 | 02 | 3min | 2 | 3 |

## Last Updated

2026-05-17 — Plan 01-02 complete: HistoricalEra.pixelsPerYear added; all 9 eras configured; yearToPixel ready for Wave 2
