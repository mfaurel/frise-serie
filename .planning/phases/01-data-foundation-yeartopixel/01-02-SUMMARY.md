---
phase: 01-data-foundation-yeartopixel
plan: 02
subsystem: data
tags: [typescript, historical-era, pixels-per-year, non-linear-scale, timeline]

# Dependency graph
requires:
  - phase: 01-data-foundation-yeartopixel
    plan: 01
    provides: "Vitest infrastructure, test runner"
provides:
  - "HistoricalEra interface with pixelsPerYear: number field"
  - "All 9 eras with per-era pixel density values summing to 9135px total"
  - "Last era (20th_century_late) corrected to yearEnd: 2025"
  - "Obsolete linear-scale constants removed from data/eras.ts"
affects:
  - "01-05 (lib/timeline.ts rewrite — imports broken constants, fixed in Wave 4)"
  - "01-03 (yearToPixel implementation depends on HistoricalEra.pixelsPerYear)"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Per-era pixel density (pixelsPerYear) stored on HistoricalEra interface — enables piecewise non-linear timeline scale"
    - "Timeline boundaries derived from ERAS array (ERAS[0].yearStart, ERAS[ERAS.length-1].yearEnd) rather than exported constants"

key-files:
  created: []
  modified:
    - "types/index.ts — HistoricalEra interface gains pixelsPerYear: number"
    - "data/eras.ts — 9 eras gain pixelsPerYear values; yearEnd: 2025 on last era; 3 obsolete constants removed"
    - "components/Timeline.tsx — replaced TIMELINE_START/TIMELINE_END imports from removed constants with ERAS-derived local values"

key-decisions:
  - "pixelsPerYear placed after yearEnd and before gradient in HistoricalEra interface — mirrors data layout in era objects"
  - "20th_century_late yearEnd extended to 2025 (from 1991) — enables contemporary series placement on timeline"
  - "TIMELINE_START/TIMELINE_END removed from data/eras.ts; Timeline.tsx now derives boundaries from ERAS array directly"
  - "lib/timeline.ts intentionally left broken until Wave 4 (01-05) — it requires full yearToPixel rewrite using piecewise scale"

patterns-established:
  - "Non-linear piecewise scale: each era has its own pixels/year density, enabling variable zoom across history"
  - "Era boundaries as source of truth: components derive TIMELINE_START/TIMELINE_END from ERAS array, not exported constants"

requirements-completed:
  - TL-02

# Metrics
duration: 3min
completed: 2026-05-17
---

# Phase 01 Plan 02: HistoricalEra Interface + Era Data (pixelsPerYear) Summary

**HistoricalEra interface extended with pixelsPerYear: number field; all 9 eras assigned non-linear pixel densities totaling 9135px; last era extended to 2025; obsolete linear-scale constants removed**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-05-17T21:16:09Z
- **Completed:** 2026-05-17T21:19:14Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Added `pixelsPerYear: number` to `HistoricalEra` interface in `types/index.ts` — TypeScript now enforces this field on all era objects
- Updated all 9 eras in `data/eras.ts` with verified pixel density values (1.0 to 8.0 px/year) summing to exactly 9135px total timeline width
- Fixed `20th_century_late` era `yearEnd` from 1991 to 2025 — timeline now covers antiquity through present
- Removed the 3 obsolete linear-scale export constants (`TIMELINE_START`, `TIMELINE_END`, `PIXELS_PER_YEAR`) from `data/eras.ts`

## Task Commits

Each task was committed atomically:

1. **Task 1: Add pixelsPerYear to HistoricalEra interface** - `ef20083` (feat)
2. **Task 2: Add pixelsPerYear values to all 9 eras and remove obsolete constants** - `8268077` (feat)

## Files Created/Modified

- `types/index.ts` — HistoricalEra interface: added `pixelsPerYear: number` after `yearEnd: number`
- `data/eras.ts` — 9 era objects gain `pixelsPerYear` values; `20th_century_late.yearEnd` changed to 2025; `TIMELINE_START`, `TIMELINE_END`, `PIXELS_PER_YEAR` exports removed
- `components/Timeline.tsx` — Replaced removed constant imports with ERAS-derived module-level constants (deviation fix)

## Decisions Made

- `pixelsPerYear` placed after `yearEnd` in both interface and era objects for consistent ordering
- `20th_century_late` name kept as "Cold War" despite span extending to 2025 — renaming is Phase 9 scope
- `lib/timeline.ts` left with TypeScript errors intentionally — it will be rewritten in Wave 4 (01-05) to use the piecewise `yearToPixel` implementation

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed components/Timeline.tsx importing removed constants**
- **Found during:** Task 2 (verifying TypeScript errors)
- **Issue:** The plan stated only `lib/timeline.ts` would have import errors after removing the 3 constants, but `components/Timeline.tsx` also imported `TIMELINE_START` and `TIMELINE_END` from `@/data/eras` (line 10). This caused 2 additional unexpected TypeScript errors.
- **Fix:** Replaced the `{ TIMELINE_START, TIMELINE_END }` import from `@/data/eras` with `{ ERAS }` import, then derived both values as module-level constants: `const TIMELINE_START = ERAS[0].yearStart` and `const TIMELINE_END = ERAS[ERAS.length - 1].yearEnd`. This makes boundaries dynamically derived from the authoritative era data.
- **Files modified:** `components/Timeline.tsx`
- **Verification:** `npx tsc --noEmit` now only shows errors in `lib/timeline.ts` (3 errors, all expected per plan)
- **Committed in:** `8268077` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Auto-fix was necessary — the pre-existing component had a dependency on the removed constants not captured in the plan. The fix is strictly better: Timeline boundaries are now derived from the ERAS array rather than hardcoded separate constants. No scope creep.

## Issues Encountered

None beyond the deviation above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `HistoricalEra.pixelsPerYear` is available — Wave 2 (01-03) can implement `yearToPixel()` using the piecewise scale
- `lib/timeline.ts` has 3 TypeScript errors (intentional) — will be fixed in Wave 4 (01-05)
- `data/eras.ts` is TypeScript-clean
- `types/index.ts` is TypeScript-clean
- `components/Timeline.tsx` is TypeScript-clean (with ERAS-derived boundary derivation)

---
*Phase: 01-data-foundation-yeartopixel*
*Completed: 2026-05-17*
