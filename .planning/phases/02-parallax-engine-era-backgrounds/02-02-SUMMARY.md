---
phase: 02-parallax-engine-era-backgrounds
plan: 02
subsystem: era-backgrounds
tags: [server-component, svg-noise, skeleton, ssr, tdd, wave-1]

requires:
  - phase: 01-data-foundation-yeartopixel
    provides: ERAS, yearToPixel, TOTAL_WIDTH, yearToDisplay
  - plan: 02-01
    provides: noiseUri.test.ts stubs (3 it.todo), TimelineSkeleton.test.ts stubs (5 it.todo)

provides:
  - "lib/noiseConstants.ts — NOISE_SVG_URI constant with %23-encoded filter reference"
  - "components/BackgroundLayer.tsx — Server Component, era colour bands with SVG noise texture + labels"
  - "components/TimelineSkeleton.tsx — Server Component, animate-pulse era band skeleton for SSR FCP"

affects: [02-03, 02-04, era-backgrounds, parallax-engine]

tech-stack:
  added:
    - "@testing-library/react (devDependency) — component render tests"
    - "@testing-library/jest-dom (devDependency) — extended DOM matchers"
  patterns:
    - "Server Component era bands: no 'use client', SSR HTML contains era band content"
    - "NOISE_SVG_URI constant: shared between component and tests via lib/noiseConstants.ts"
    - "SVG noise via data URI: %23 encodes '#' for Firefox SVG filter reference compatibility"
    - "Skeleton pattern: animate-pulse + role=status for accessible SSR skeleton"

key-files:
  created:
    - lib/noiseConstants.ts
    - components/BackgroundLayer.tsx
    - components/TimelineSkeleton.tsx
  modified:
    - lib/noiseUri.test.ts (3 it.todo un-todoed, all passing)
    - components/TimelineSkeleton.test.ts (2 it.todo un-todoed, both passing)
    - package.json (added @testing-library/react + @testing-library/jest-dom)

key-decisions:
  - "NOISE_SVG_URI extracted to lib/noiseConstants.ts so both BackgroundLayer and tests can import it without duplication"
  - "BackgroundLayer.tsx uses backgroundImage combining NOISE_SVG_URI + linear-gradient rather than separate layers — one style property"
  - "TimelineSkeleton.test.ts uses React.createElement(TimelineSkeleton) not direct function call to avoid double-render in testing-library container"
  - "@testing-library/react installed as devDependency (Rule 3 auto-fix — plan stated 'already in devDependencies' but it was absent)"

metrics:
  duration: 8min
  completed: "2026-05-19"
  tasks: 2
  files: 6
---

# Phase 2 Plan 02: BackgroundLayer + TimelineSkeleton Summary

**Server Component era colour bands with SVG grain texture (BackgroundLayer.tsx) and animate-pulse SSR skeleton (TimelineSkeleton.tsx), plus shared NOISE_SVG_URI constant extracted to lib/noiseConstants.ts — noiseUri tests un-todoed and passing.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-05-19T22:42:00Z
- **Completed:** 2026-05-19T22:50:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- lib/noiseConstants.ts: exports NOISE_SVG_URI with %23-encoded filter reference (Firefox-compatible); no bare '#' character in URI
- components/BackgroundLayer.tsx: Server Component (no 'use client'); maps ERAS to noise+gradient colour bands; uses yearToDisplay for era year labels; no willChange anywhere
- components/TimelineSkeleton.tsx: Server Component (no 'use client'); animate-pulse era bands; role="status" + aria-label; sr-only bilingual label
- lib/noiseUri.test.ts: 3 previously-todo tests now passing against NOISE_SVG_URI constant
- components/TimelineSkeleton.test.ts: 2 minimum tests passing (render count + role=status); 3 it.todo for pixel-value assertions remain
- Full suite: 46 passing + 4 todo, 0 failing; npx tsc --noEmit exits 0

## Task Commits

1. **Task 1: Create lib/noiseConstants.ts and BackgroundLayer.tsx** - `8e39174` (feat)
2. **Task 2: Create TimelineSkeleton.tsx and activate skeleton tests** - `6f1d348` (feat)

## Files Created/Modified

- `lib/noiseConstants.ts` — NOISE_SVG_URI constant for BackgroundLayer and tests
- `components/BackgroundLayer.tsx` — Server Component: era bands with noise texture + labels
- `components/TimelineSkeleton.tsx` — Server Component: animate-pulse skeleton for SSR FCP
- `lib/noiseUri.test.ts` — 3 tests un-todoed, all passing
- `components/TimelineSkeleton.test.ts` — 2 tests un-todoed, both passing
- `package.json` — @testing-library/react + @testing-library/jest-dom added as devDependencies

## Decisions Made

- NOISE_SVG_URI constant lives in lib/noiseConstants.ts — single source of truth for both the component and the test suite
- BackgroundLayer.tsx uses combined backgroundImage (`NOISE_SVG_URI + ', linear-gradient(...)'`) with backgroundBlendMode overlay and backgroundSize '200px 200px, 100% 100%'
- TimelineSkeleton.test.ts uses React.createElement instead of direct function call to avoid double rendering in @testing-library/react container
- Three pixel-value it.todo assertions in TimelineSkeleton.test.ts remain as todos — exact pixel DOM assertions require additional jsdom setup; the two minimum green-gate tests (count + role) pass

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] @testing-library/react missing from devDependencies**
- **Found during:** Task 2 (TimelineSkeleton tests)
- **Issue:** Plan stated @testing-library/react was "already in devDependencies from Phase 1" but package.json contained no such entry — import failed at test collection
- **Fix:** Installed @testing-library/react and @testing-library/jest-dom as devDependencies via npm install
- **Files modified:** package.json, package-lock.json
- **Commit:** 6f1d348

**2. [Rule 1 - Bug] Test used direct function call causing double render**
- **Found during:** Task 2 test execution
- **Issue:** `render(TimelineSkeleton({}))` wrapped the component output in a container div, resulting in two role="status" elements; `getByRole('status')` threw "Found multiple elements"
- **Fix:** Changed to `render(React.createElement(TimelineSkeleton))` and used `container.querySelector('[role="status"]')` for unambiguous single-element assertion
- **Files modified:** components/TimelineSkeleton.test.ts
- **Commit:** 6f1d348

## Issues Encountered

None beyond the auto-fixed deviations above.

## User Setup Required

None.

## Next Phase Readiness

- BackgroundLayer.tsx and TimelineSkeleton.tsx are ready for Plan 03 (parallax scroll engine)
- Plan 04 will wire BackgroundLayer into Timeline.tsx, replacing EraBackground.tsx import
- EraBackground.tsx NOT deleted in this plan (as specified) — still imported by Timeline.tsx
- Full suite green: 46 passing + 4 todo, 0 failing

## Self-Check

- [x] lib/noiseConstants.ts exists and exports NOISE_SVG_URI with %23noise
- [x] components/BackgroundLayer.tsx has no 'use client', no 'willChange'
- [x] components/TimelineSkeleton.tsx has no 'use client', has 'animate-pulse' and 'role="status"'
- [x] npx vitest run: 46 passing + 4 todo, 0 failing
- [x] npx tsc --noEmit: exits 0
- [x] Commits 8e39174 and 6f1d348 exist in git log

## Self-Check: PASSED
