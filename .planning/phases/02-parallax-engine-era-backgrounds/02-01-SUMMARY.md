---
phase: 02-parallax-engine-era-backgrounds
plan: 01
subsystem: testing
tags: [vitest, parallax, framer-motion, svg, noise, tdd, wave-0]

requires:
  - phase: 01-data-foundation-yeartopixel
    provides: TOTAL_WIDTH and yearToPixel exports used in test assertions

provides:
  - "lib/parallaxFormula.test.ts — 3 passing RED tests for bgX formula math (TL-01)"
  - "lib/noiseUri.test.ts — 3 it.todo stubs for NOISE_SVG_URI encoding (TL-03)"
  - "components/TimelineSkeleton.test.ts — 5 it.todo stubs for skeleton render coverage (UX-04)"

affects: [02-02, 02-03, 02-04, parallax-engine, era-backgrounds]

tech-stack:
  added: []
  patterns:
    - "Wave 0 test stubs: RED tests written before implementation to enforce Nyquist compliance"
    - "it.todo for stubs targeting non-existent modules; imported constants via @/ alias for math assertions"
    - "@vitest-environment jsdom directive on first line for component test files (STATE.md decision 01-01)"

key-files:
  created:
    - lib/parallaxFormula.test.ts
    - lib/noiseUri.test.ts
    - components/TimelineSkeleton.test.ts
  modified: []

key-decisions:
  - "it.todo stubs for Wave 0 component tests (TimelineSkeleton) — component import commented out to avoid TypeScript error on missing module (Wave 1 creates it)"
  - "NOISE_SVG_URI import comment added above each todo — documents exact import path Wave 1 must provide"
  - "parallaxFormula.test.ts uses pure arithmetic (no Motion API) — formula extracted as progress * -(TOTAL_WIDTH * zoom * 0.7)"

patterns-established:
  - "Wave 0 Nyquist pattern: all Wave 1-3 requirements have automated test gates before any implementation begins"
  - "noiseUri stubs: import commented out at top of file with note — Wave 1 must un-todo + add import when constant is created"

requirements-completed: [TL-01, TL-03, UX-04]

duration: 10min
completed: 2026-05-19
---

# Phase 2 Plan 01: Wave 0 Test Stubs Summary

**Three Nyquist-compliant RED test stub files for bgX parallax formula (TL-01), SVG noise URI encoding (TL-03), and TimelineSkeleton skeleton render (UX-04) — all Wave 1-3 requirements have automated gates before any implementation begins.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-05-19T22:38:00Z
- **Completed:** 2026-05-19T22:48:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- lib/parallaxFormula.test.ts: 3 passing assertions for bgX formula math at progress=1 and shouldReduceMotion variants; 1 it.todo for progress=0.5 case
- lib/noiseUri.test.ts: 3 it.todo stubs documenting NOISE_SVG_URI encoding requirements; commented import shows Wave 1 target path
- components/TimelineSkeleton.test.ts: 5 it.todo stubs for era band render, positioning, sizing, axis placeholder, and ARIA role; @vitest-environment jsdom directive on first line
- Full suite: 41 passing + 9 todo; 38 existing tests undisturbed; npx tsc --noEmit exits 0

## Task Commits

1. **Task 1: Write parallaxFormula.test.ts and noiseUri.test.ts stubs** - `d17256c` (test)
2. **Task 2: Write TimelineSkeleton.test.ts stub** - `572ddec` (test)

## Files Created/Modified

- `lib/parallaxFormula.test.ts` - RED test stubs for bgX parallax formula; 3 passing + 1 todo
- `lib/noiseUri.test.ts` - RED it.todo stubs for NOISE_SVG_URI constant encoding
- `components/TimelineSkeleton.test.ts` - RED it.todo stubs for skeleton component render

## Decisions Made

- TimelineSkeleton component import is commented out in the test file rather than conditionally imported — prevents TypeScript error on missing module while Wave 1 creates the file
- NOISE_SVG_URI import line included as a comment directly above each it.todo — provides clear guidance for Wave 1 without causing a compile error
- parallaxFormula.test.ts uses pure arithmetic with no DOM or Motion API — stays in node environment (default per vitest.config.mts)

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All Wave 0 test stubs in place: parallaxFormula, noiseUri, TimelineSkeleton
- Wave 1 (Plan 02) can proceed: implement lib/noiseConstants.ts, components/TimelineSkeleton.tsx, then un-todo the respective stubs
- Full suite green (41 passing, 9 todo, 0 failing) — safe baseline for Wave 1 work

---
*Phase: 02-parallax-engine-era-backgrounds*
*Completed: 2026-05-19*
