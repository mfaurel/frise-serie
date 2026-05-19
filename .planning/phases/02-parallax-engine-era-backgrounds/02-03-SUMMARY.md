---
phase: 02-parallax-engine-era-backgrounds
plan: 03
subsystem: parallax-engine
tags: [client-component, axis, refactor, import-cleanup, wave-2]

requires:
  - phase: 01-data-foundation-yeartopixel
    provides: yearToPixel, yearToDisplay, Locale type
  - plan: 02-02
    provides: BackgroundLayer.tsx, TimelineSkeleton.tsx, lib/noiseConstants.ts

provides:
  - "components/AxisLayer.tsx — Client component: axis ticks + labels, extracted from Timeline.tsx"
  - "components/ShowCard.tsx — import updated: yearToDisplay from @/lib/yearToDisplay (no more @/lib/timeline)"

affects: [02-04, parallax-engine, show-cards]

tech-stack:
  added: []
  patterns:
    - "AxisLayer receives zoom/locale/ticks/currentYear as props — no internal state, pure render"
    - "currentYear prop accepted but not rendered — interface stable for Phase 6 current-year marker"
    - "ShowCard.tsx imports directly from lib/yearToDisplay, not through the shim"

key-files:
  created:
    - components/AxisLayer.tsx
  modified:
    - components/ShowCard.tsx (import line + 2 call sites replaced)

key-decisions:
  - "AxisLayer accepts currentYear prop but does not render it — reserved for Phase 6 current-year marker on axis, comment documents intent"
  - "ShowCard.tsx: formatYear(x, locale) replaced with yearToDisplay(x, locale) — identical signature, zero behavior change"

metrics:
  duration: 5min
  completed: "2026-05-19"
  tasks: 2
  files: 2
---

# Phase 2 Plan 03: AxisLayer.tsx + ShowCard import cleanup Summary

**AxisLayer.tsx extracted from Timeline.tsx as a standalone 'use client' component using yearToDisplay; ShowCard.tsx import updated to remove the @/lib/timeline shim dependency.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-05-19T22:48:00Z
- **Completed:** 2026-05-19T22:53:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- components/AxisLayer.tsx: new 'use client' component; accepts zoom, locale, ticks, currentYear props; renders axis line + tick marks with isCentury/is500 logic verbatim from Timeline.tsx; uses yearToDisplay for century labels; currentYear prop accepted but not rendered (Phase 6 scope)
- components/ShowCard.tsx: import { formatYear } from '@/lib/timeline' replaced with import { yearToDisplay } from '@/lib/yearToDisplay'; both formatYear call sites replaced with yearToDisplay — identical signature, zero behavior change
- npx tsc --noEmit: exits 0 after both tasks
- npx vitest run: 46 passing + 4 todo, 0 failing — no regressions

## Task Commits

1. **Task 1: Create AxisLayer.tsx client component** - `e609312` (feat)
2. **Task 2: Update ShowCard.tsx imports (formatYear → yearToDisplay)** - `3e7ab88` (fix)

## Files Created/Modified

- `components/AxisLayer.tsx` — new 'use client' component: axis ticks and labels extracted from Timeline.tsx
- `components/ShowCard.tsx` — import updated; @/lib/timeline and formatYear fully removed

## Decisions Made

- AxisLayer accepts currentYear prop but does not render it — reserved for Phase 6 current-year indicator on the axis; comment `// TODO: render current-year marker in Phase 6` documents intent
- ShowCard.tsx: yearToDisplay has the same signature as formatYear (year: number, locale: string): string — pure import path change, no logic change

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced.

## Self-Check

- [x] components/AxisLayer.tsx exists with 'use client' on line 1
- [x] AxisLayer imports yearToPixel from '@/lib/yearToPixel' and yearToDisplay from '@/lib/yearToDisplay'
- [x] AxisLayer Props interface: zoom, locale, ticks, currentYear
- [x] components/ShowCard.tsx has no reference to '@/lib/timeline' or 'formatYear'
- [x] npx tsc --noEmit: exits 0
- [x] npx vitest run: 46 passing + 4 todo, 0 failing
- [x] Commits e609312 and 3e7ab88 exist in git log

## Self-Check: PASSED
