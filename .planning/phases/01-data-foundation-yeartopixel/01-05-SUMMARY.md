---
phase: 01-data-foundation-yeartopixel
plan: 05
subsystem: data
tags: [typescript, timeline, bc-dates, documentation]

# Dependency graph
requires:
  - phase: 01-data-foundation-yeartopixel/01-03
    provides: lib/yearToPixel.ts with piecewise-linear math and exported constants
  - phase: 01-data-foundation-yeartopixel/01-04
    provides: lib/yearToDisplay.ts with yearToDisplay export
provides:
  - lib/timeline.ts re-export shim — backward-compatible bridge to lib/yearToPixel.ts and lib/yearToDisplay.ts
  - CLAUDE.md with accurate stack versions (Next.js 14.2, Framer Motion 11, Tailwind CSS 3, next-intl 3)
  - CLAUDE.md with correct BC dates convention (direct negation, year-0 display-only edge case)
affects: [Phase 2, all components that import from @/lib/timeline]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Re-export shim pattern: lib/timeline.ts delegates all exports to domain-specific modules, preserving backward compat"

key-files:
  created: []
  modified:
    - lib/timeline.ts
    - CLAUDE.md

key-decisions:
  - "lib/timeline.ts is a pure re-export shim with no implementation logic; Phase 2 will remove this file and update callers to import directly from lib/yearToPixel.ts or lib/yearToDisplay.ts"
  - "TIMELINE_START and TIMELINE_END are re-exported from the shim even though the original timeline.ts did not export them — this allows callers to use @/lib/timeline as a single-import entry point until Phase 2"
  - "PIXELS_PER_YEAR is intentionally absent from the shim — that constant was removed in Wave 1 and Phase 2+ callers must update their imports"

patterns-established:
  - "Shim pattern: when refactoring a module, preserve the old path as a pure re-export shim until all callers are updated"

requirements-completed:
  - TL-02

# Metrics
duration: 5min
completed: 2026-05-17
---

# Phase 1 Plan 05: Shim and Docs Summary

**lib/timeline.ts converted to a 4-line pure re-export shim fixing TypeScript errors, and CLAUDE.md corrected with actual installed stack versions (Next.js 14.2/Framer Motion 11/Tailwind CSS 3) and direct-negation BC dates convention**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-17T23:31:00Z
- **Completed:** 2026-05-17T23:33:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Replaced broken lib/timeline.ts (importing deleted constants from data/eras.ts) with a 4-line pure re-export shim
- Preserved backward compatibility: all existing `import { yearToPixel } from '@/lib/timeline'` paths continue to resolve
- Corrected CLAUDE.md stack line: Next.js 14.2, Framer Motion 11, Tailwind CSS 3, next-intl 3, nuqs (Phase 6+)
- Fixed CLAUDE.md BC dates constraint: removed contradictory "0 = 1 BC", added direct negation (-52 = 52 BC, -1 = 1 BC) and year-0 display-only edge case note
- Phase 1 final gate passed: `npx tsc --noEmit` exits 0, 38/38 tests passing

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace lib/timeline.ts with re-export shim** - `ce4eef1` (feat)
2. **Task 2: Update CLAUDE.md — correct stack versions and BC dates convention** - `7f7285d` (docs)

**Plan metadata:** _(this commit)_ (docs: complete plan)

## Files Created/Modified

- `lib/timeline.ts` - Pure re-export shim: re-exports yearToPixel, pixelToYear, TOTAL_WIDTH, TIMELINE_START, TIMELINE_END from ./yearToPixel and yearToDisplay as formatYear from ./yearToDisplay
- `CLAUDE.md` - Stack versions corrected to actual installed versions; BC dates constraint updated to direct-negation convention with year-0 edge case guidance

## Decisions Made

- TIMELINE_START and TIMELINE_END are included in the shim's re-exports (they were absent from the original broken timeline.ts) to make @/lib/timeline a complete entry point until Phase 2 removes the file
- PIXELS_PER_YEAR is intentionally omitted — it was deleted in Wave 1 and any Phase 2+ code that imported it must update directly

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None — this plan contains no stubs. lib/timeline.ts is a pure re-export shim with no placeholder logic.

## Next Phase Readiness

Phase 1 is fully complete:
- yearToPixel and pixelToYear are piecewise-linear, inverse-verified, and tested (38 tests passing)
- Non-linear scale confirmed: renaissance denser than antiquity
- data/eras.ts defines 9 eras with pixelsPerYear; all boundaries derived from data/eras.ts
- 30 shows spanning -1200 to 2005, TypeScript-clean
- BC convention documented in schema; yearToDisplay handles -1, 0, -3000 correctly
- lib/timeline.ts shim preserves backward compat for Phase 2

Ready for Phase 2: Parallax Engine + Era Backgrounds.

## Self-Check: PASSED

- [x] `lib/timeline.ts` exists on disk (4-line shim)
- [x] `CLAUDE.md` contains "Next.js 14.2"
- [x] `CLAUDE.md` contains "direct negation: -52 = 52 BC"
- [x] Commit `ce4eef1` exists (feat(01-05): convert lib/timeline.ts to re-export shim)
- [x] Commit `7f7285d` exists (docs(01-05): update CLAUDE.md — correct stack versions and BC dates convention)
- [x] `npx tsc --noEmit` exits 0
- [x] `npm run test:run` passes 38/38 tests

---
*Phase: 01-data-foundation-yeartopixel*
*Completed: 2026-05-17*
