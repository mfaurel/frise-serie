---
phase: 01-data-foundation-yeartopixel
plan: 01
subsystem: testing
tags: [vitest, vite-tsconfig-paths, typescript, unit-tests]

# Dependency graph
requires: []
provides:
  - Vitest 4.1.6 test runner configured for Next.js 14 project
  - vitest.config.mts with tsconfigPaths() before react() in plugins array
  - lib/yearToPixel.test.ts stub — @/ alias proven to resolve in Vitest
  - lib/yearToDisplay.test.ts stub — node environment check passes
  - test and test:run npm scripts
affects: [01-02, 01-03, all future lib/ test files]

# Tech tracking
tech-stack:
  added:
    - vitest@4.1.6
    - "@vitejs/plugin-react@6.0.2"
    - jsdom@29.1.1
    - vite-tsconfig-paths@6.1.1
  patterns:
    - Explicit vitest named imports (no globals) — import { describe, it, expect } from 'vitest'
    - tsconfigPaths() before react() in plugins array for correct path resolution
    - environment: node for Phase 1 pure math tests; per-file @vitest-environment jsdom for Phase 3+ components
    - it.todo for unimplemented Wave 2 test cases (not skip)

key-files:
  created:
    - vitest.config.mts
    - lib/yearToPixel.test.ts
    - lib/yearToDisplay.test.ts
  modified:
    - package.json

key-decisions:
  - "Use environment: node globally for Phase 1 math tests — keeps test startup sub-100ms; Phase 3+ component tests override per-file with @vitest-environment jsdom"
  - "No globals: true — all test files use explicit named imports from vitest (D-12)"
  - "it.todo for unimplemented cases, not it.skip — todo items are listed but do not fail the suite"
  - "yearToPixel.test.ts imports ERAS from @/data/eras (not from lib/yearToPixel.ts which does not exist yet) to prove @/ alias resolves"

patterns-established:
  - "Vitest named imports: import { describe, it, expect } from 'vitest' — no globals"
  - "Test co-location: lib/yearToPixel.test.ts sits next to lib/yearToPixel.ts (future)"
  - "Wave 0 stubs: one passing infrastructure assertion + it.todo for all real cases"

requirements-completed:
  - TL-02

# Metrics
duration: 8min
completed: 2026-05-17
---

# Phase 01 Plan 01: Vitest Walking Skeleton Summary

**Vitest 4.1.6 installed and configured with vite-tsconfig-paths, proving @/ alias resolves in test files via a passing ERAS.length assertion**

## Performance

- **Duration:** 8 min
- **Started:** 2026-05-17T23:05:00Z
- **Completed:** 2026-05-17T23:13:10Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Installed vitest@4.1.6, @vitejs/plugin-react@6.0.2, jsdom@29.1.1, vite-tsconfig-paths@6.1.1
- Created vitest.config.mts with correct plugin order (tsconfigPaths before react) and environment: node
- Created lib/yearToPixel.test.ts — imports ERAS from @/data/eras, proves the @/ alias resolves inside Vitest
- Created lib/yearToDisplay.test.ts — node environment infrastructure assertion passes unconditionally
- Added test and test:run scripts to package.json; npm run test:run exits 0 (2 passed, 21 todo)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Vitest and create vitest.config.mts** - `35a41b6` (feat)
2. **Task 2: Write passing test stubs for yearToPixel and yearToDisplay** - `6a1cc90` (feat)

## Files Created/Modified

- `vitest.config.mts` — Vitest configuration: tsconfigPaths() + react() plugins, environment: node
- `package.json` — Added test and test:run scripts, devDependencies updated by npm install
- `lib/yearToPixel.test.ts` — Stub: ERAS import proves @/ alias; 12 it.todo entries for Wave 2
- `lib/yearToDisplay.test.ts` — Stub: node environment check; 9 it.todo entries for Wave 2

## Decisions Made

- Use `environment: 'node'` globally — faster for pure math tests; component tests (Phase 3+) override per file with `// @vitest-environment jsdom` comment
- No `globals: true` — explicit `import { describe, it, expect } from 'vitest'` in all test files (D-12 constraint)
- Use `it.todo` (not `it.skip`) for unimplemented test cases — todos are listed in output but never fail
- Stub imports ERAS (already exists) not lib/yearToPixel (does not exist yet) — avoids import errors while still proving the @/ alias path resolution works end-to-end

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

- Vitest 4.1.6 emits an informational warning: "The plugin vite-tsconfig-paths is detected. Vite now supports tsconfig paths resolution natively via resolve.tsconfigPaths option." This is a non-fatal advisory — the plugin continues to work correctly and all tests pass. The plan specified to use vite-tsconfig-paths (verified approach from Next.js docs), so the warning is acceptable at this stage.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Walking skeleton is complete: npm run test:run exits 0, @/ alias resolves, all infrastructure verified
- Ready for Plan 01-02: types/index.ts HistoricalEra interface update (add pixelsPerYear field)
- Wave 2 (Plan 01-03) will replace the it.todo entries in both test files with real assertions against lib/yearToPixel.ts and lib/yearToDisplay.ts

## Self-Check

Files exist on disk:
- [x] vitest.config.mts — present
- [x] lib/yearToPixel.test.ts — present
- [x] lib/yearToDisplay.test.ts — present
- [x] package.json — updated with test scripts

Commits:
- [x] 35a41b6 — feat(01-01): install Vitest and create vitest.config.mts
- [x] 6a1cc90 — feat(01-01): write passing test stubs for yearToPixel and yearToDisplay

Verification:
- [x] npm run test:run exits 0 — 2 passed, 21 todo
- [x] @/data/eras import resolves without error
- [x] vitest.config.mts has tsconfigPaths() before react()

## Self-Check: PASSED

---
*Phase: 01-data-foundation-yeartopixel*
*Completed: 2026-05-17*
