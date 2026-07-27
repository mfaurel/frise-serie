---
id: T01
parent: S02
milestone: M002
key_files:
  - app/components/TimelineContainer.tsx
key_decisions:
  - TimelineContainer is a Server Component — no browser APIs needed, data imports are synchronous
  - Year labels use era.yearStart (era boundary) not yearEnd, matching the slice spec
  - BC/AD label format: negative years show absolute value + ' BC', positive years show value + ' AD'
duration: 
verification_result: passed
completed_at: 2026-07-27T15:44:27.176Z
blocker_discovered: false
---

# T01: Created TimelineContainer server component: scrollable div sized to density-zone totalWidth with era year labels absolutely positioned via yearToPixel.

**Created TimelineContainer server component: scrollable div sized to density-zone totalWidth with era year labels absolutely positioned via yearToPixel.**

## What Happened

Created app/components/TimelineContainer.tsx as a Next.js Server Component (no 'use client'). The component:
1. Imports shows, eras, buildDensityZones, yearToPixel, and VIRTUAL_CANVAS_WIDTH from their respective modules.
2. Calls buildDensityZones(shows, eras, VIRTUAL_CANVAS_WIDTH) to compute density zones.
3. Derives totalWidth from zones[zones.length - 1].pixelEnd.
4. Renders an outer div (data-testid="timeline-scroll", overflow-x-auto, w-full, height 80px) containing an inner div (data-testid="timeline-inner") with style width=totalWidth and position relative.
5. Maps over eras[] — each era gets a span (data-testid="year-label") absolutely positioned at yearToPixel(era.yearStart, zones), top 4px, label formatted as "N BC" or "N AD".

## Verification

npm run typecheck (tsc --noEmit) exited 0 with zero diagnostics after component creation.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run typecheck` | 0 | pass | 2490ms |

## Deviations

none

## Known Issues

none

## Files Created/Modified

- `app/components/TimelineContainer.tsx`
