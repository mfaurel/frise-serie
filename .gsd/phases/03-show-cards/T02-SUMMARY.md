---
id: T02
parent: S03
milestone: M003
key_files:
  - app/components/ConstellationLayer.tsx
  - app/components/TimelineContainer.tsx
key_decisions:
  - findEraForYear duplicated locally in ConstellationLayer to avoid exporting an internal helper from constellationLines.ts
  - Constellation line stroke color uses last swatch of era.colorPalette (most vibrant) matching the span-bar convention
  - pointerEvents:'none' set on both the wrapper div and the SVG so card hover events are never intercepted
duration: 
verification_result: passed
completed_at: 2026-07-30T21:42:06.068Z
blocker_discovered: false
---

# T02: Built ConstellationLayer SVG component rendering span bars and constellation lines, wired hover state into TimelineContainer

**Built ConstellationLayer SVG component rendering span bars and constellation lines, wired hover state into TimelineContainer**

## What Happened

Created app/components/ConstellationLayer.tsx as a 'use client' component with props layout, zones, eras, relatedShows, hoveredShowId, and totalWidth. It calls computeSpanBars and computeConstellationSegments from lib/constellationLines.ts, renders an SVG with data-testid="constellation-layer", span bars as rect elements (data-testid="span-bar", data-show-id) with opacity fading non-hovered shows to 0.2, and constellation lines as quadratic-bezier path elements (data-testid="constellation-line", data-show-a, data-show-b) with three opacity tiers: 0.15 default (no hover), 0.9 active (hoveredShowId matches one endpoint), 0.05 inactive (hover on unrelated show). Stroke color is derived from the era of showIdA's narrativeYearStart using the last swatch in colorPalette.

Updated TimelineContainer.tsx: added useState import, computeRelatedShows import, ConstellationLayer import, declared hoveredShowId state, computed relatedShows, added a new absolutely-positioned pointer-events-none div containing ConstellationLayer before the parallax-cards div, and added onMouseEnter/onMouseLeave handlers to each card wrapper div.

TypeScript typecheck (tsc --noEmit) exits 0 with no errors.

## Verification

npm run typecheck (tsc --noEmit) exited 0. No TypeScript errors.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run typecheck` | 0 | pass | 8200ms |

## Deviations

none

## Known Issues

none

## Files Created/Modified

- `app/components/ConstellationLayer.tsx`
- `app/components/TimelineContainer.tsx`
