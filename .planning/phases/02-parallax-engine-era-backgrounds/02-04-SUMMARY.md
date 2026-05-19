---
phase: 02-parallax-engine-era-backgrounds
plan: 04
subsystem: parallax-engine
tags: [rsc-boundary, parallax, client-shell, refactor, wave-3]

requires:
  - plan: 02-03
    provides: AxisLayer.tsx, ShowCard.tsx (shim-free)

provides:
  - "components/Timeline.tsx — refactored parallax orchestrator: 3-layer, useReducedMotion, bgX=0.7, touch-action, backgroundLayer prop"
  - "components/ClientShell.tsx — new 'use client' boundary: locale, filters, selectedShow state"
  - "app/page.tsx — Server Component RSC shell: TimelineSkeleton + ClientShell with BackgroundLayer"

affects: [phase-03-show-cards, phase-07-i18n]

tech-stack:
  added: []
  patterns:
    - "RSC slot pattern: BackgroundLayer (Server Component) passed as React.ReactNode through ClientShell into Timeline"
    - "useReducedMotion() unconditional hook — suppresses bgX parallax when OS prefers-reduced-motion"
    - "touchAction: 'pan-x' on .timeline-scroll div — required for iOS Safari native swipe"
    - "ClientShell extracts all client state from page.tsx — page.tsx is a pure Server Component"

key-files:
  created:
    - components/ClientShell.tsx
  modified:
    - components/Timeline.tsx
    - app/page.tsx
    - components/HistoricalEventMarker.tsx
    - components/ShowDetail.tsx
  deleted:
    - components/EraBackground.tsx
    - lib/timeline.ts

key-decisions:
  - "backgroundLayer prop is React.ReactNode — BackgroundLayer RSC pre-rendered on server, passed as opaque node through ClientShell into Timeline; no user data crosses this boundary"
  - "TIMELINE_START / TIMELINE_END kept as derived constants in Timeline.tsx from ERAS array — consistent with Phase 1 decision (01-02)"
  - "HistoricalEventMarker.tsx and ShowDetail.tsx updated from @/lib/timeline shim to direct imports as part of shim deletion (Rule 3 auto-fix)"

metrics:
  duration: 10min
  completed: "2026-05-19"
  tasks: 2
  files: 7
---

# Phase 2 Plan 04: Parallax Engine Wire-up + RSC Boundary Summary

**Full Phase 2 parallax engine wired: Timeline.tsx accepts backgroundLayer prop with useReducedMotion and touch-action; ClientShell.tsx extracts client state from page.tsx; page.tsx converted to Server Component; EraBackground.tsx and lib/timeline.ts deleted.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-05-19T20:43:00Z
- **Completed:** 2026-05-19T20:53:00Z
- **Tasks:** 2
- **Files modified:** 7 (2 created, 3 modified, 2 deleted)

## Accomplishments

- components/Timeline.tsx refactored: useReducedMotion() added (unconditional), bgX multiplier changed 0.4 → 0.7, touchAction: 'pan-x' on scroll container, backgroundLayer: React.ReactNode prop replaces EraBackground, AxisLayer component replaces inline axis JSX, show cards wrapped in data-layer="card-track", yearToDisplay replaces formatYear, imports from @/lib/yearToPixel and @/lib/yearToDisplay (no @/lib/timeline)
- components/ClientShell.tsx created: 'use client', useState hooks for locale/filters/selectedShow, backgroundLayer prop threaded through to Timeline
- app/page.tsx converted to Server Component: no 'use client', no useState, renders TimelineSkeleton + ClientShell with BackgroundLayer locale="fr"
- components/EraBackground.tsx deleted (replaced by BackgroundLayer.tsx from Plan 02-02)
- lib/timeline.ts deleted (re-export shim, no remaining callers after all components updated)
- npx tsc --noEmit: exits 0
- npx vitest run: 46 passing + 4 todo, 0 failing — no regressions

## Task Commits

1. **Task 1: Refactor Timeline.tsx** - `97b5738` (feat)
2. **Task 2: Create ClientShell.tsx, refactor page.tsx, delete stale files** - `4b5d1b0` (feat)

## Files Created/Modified/Deleted

- `components/Timeline.tsx` — refactored: useReducedMotion, bgX 0.7, touch-action, backgroundLayer prop, AxisLayer, card-track wrapper
- `components/ClientShell.tsx` — new 'use client' boundary with state management
- `app/page.tsx` — converted to Server Component (no 'use client')
- `components/HistoricalEventMarker.tsx` — import updated: @/lib/timeline removed, direct imports
- `components/ShowDetail.tsx` — import updated: formatYear → yearToDisplay, @/lib/timeline removed
- `components/EraBackground.tsx` — DELETED
- `lib/timeline.ts` — DELETED

## Decisions Made

- backgroundLayer prop: React.ReactNode (opaque RSC slot) — BackgroundLayer pre-rendered on server, no user data crosses boundary in Phase 2
- TIMELINE_START / TIMELINE_END remain as ERAS-derived constants inside Timeline.tsx — consistent with Phase 1 single-source-of-truth decision
- HistoricalEventMarker and ShowDetail shim callers updated during Task 2 as a prerequisite for safe shim deletion

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] HistoricalEventMarker.tsx and ShowDetail.tsx still imported @/lib/timeline**
- **Found during:** Task 2 (pre-deletion grep check revealed 5 callers, not 3)
- **Issue:** The plan accounted for Timeline.tsx and EraBackground.tsx (being deleted), but HistoricalEventMarker.tsx and ShowDetail.tsx also imported from @/lib/timeline. Deleting the shim without fixing these would break the build.
- **Fix:** Updated both files to import directly from @/lib/yearToPixel and @/lib/yearToDisplay; replaced all formatYear() calls with yearToDisplay()
- **Files modified:** components/HistoricalEventMarker.tsx, components/ShowDetail.tsx
- **Commit:** 4b5d1b0

## Known Stubs

None. The parallax engine is fully wired. The TODO comment in page.tsx (`// TODO(Phase 7): replace locale="fr" with locale from [locale] route params`) is intentional — locale routing is Phase 7 scope and does not prevent Plan 04 from achieving its goal.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced. The backgroundLayer RSC slot pattern (page.tsx → ClientShell → Timeline) only passes pre-rendered era band divs containing public historical information.

## Self-Check

- [x] components/Timeline.tsx: imports useReducedMotion, @/lib/yearToPixel, @/lib/yearToDisplay; no @/lib/timeline; no EraBackground; contains useReducedMotion(), shouldReduceMotion, 0.7 multiplier, touchAction: 'pan-x', data-layer="card-track"
- [x] components/ClientShell.tsx: 'use client', useState hooks, backgroundLayer prop threaded to Timeline
- [x] app/page.tsx: no 'use client', no useState, renders TimelineSkeleton + ClientShell
- [x] components/EraBackground.tsx: deleted (file does not exist)
- [x] lib/timeline.ts: deleted (file does not exist)
- [x] grep '@/lib/timeline': empty — zero remaining callers
- [x] grep 'EraBackground': empty — zero remaining references
- [x] npx tsc --noEmit: exits 0
- [x] npx vitest run: 46 passing + 4 todo, 0 failing
- [x] Commits 97b5738 and 4b5d1b0 exist in git log

## Self-Check: PASSED
