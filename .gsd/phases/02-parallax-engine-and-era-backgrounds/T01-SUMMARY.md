---
id: T01
parent: S03
milestone: M002
key_files:
  - app/components/TimelineContainer.tsx
key_decisions:
  - Direct DOM mutation via refs (not useState) for scroll handler — keeps animation at 60fps by bypassing React reconciler on the hot path
  - Parallax math: translateX(S * (1 - speedFactor)) — bg layer 0.7x offset (0.3x visible), axis 0.4x offset (0.6x visible)
  - Layer 3 (parallax-cards) is an empty placeholder — cards are deferred to M003
duration: 
verification_result: passed
completed_at: 2026-07-27T20:20:43.690Z
blocker_discovered: false
---

# T01: Converted TimelineContainer to a parallax Client Component with 3 absolutely-positioned layers and era-derived CSS gradient nebula backgrounds.

**Converted TimelineContainer to a parallax Client Component with 3 absolutely-positioned layers and era-derived CSS gradient nebula backgrounds.**

## What Happened

Read the existing S02 Server Component (TimelineContainer.tsx) and all input files (eras.ts, yearToPixel.ts, types/index.ts). Rewrote the component as a Client Component:

1. Added `'use client'` directive.
2. Imported `useRef` and `useCallback` from React.
3. Declared three refs: `scrollRef` (outer scroll container), `bgLayerRef` (Layer 1), `axisLayerRef` (Layer 2).
4. Implemented `handleScroll` using `useCallback`: reads `scrollRef.current.scrollLeft` and directly mutates `bgLayerRef.current.style.transform = translateX(${sl * 0.7}px)` and `axisLayerRef.current.style.transform = translateX(${sl * 0.4}px)`. All three refs are null-checked before any mutation. No `useState` on the hot scroll path.
5. Restructured JSX into 3 absolutely-positioned layers inside the existing outer/inner div structure:
   - Layer 1 (`data-testid="parallax-bg"`, ref=bgLayerRef): per-era `div` elements with `background: linear-gradient(to right, ...era.colorPalette)` and absolute positioning derived from `yearToPixel(era.yearStart/End, zones)`.
   - Layer 2 (`data-testid="parallax-axis"`, ref=axisLayerRef): the `data-testid="year-label"` spans moved here from the old flat inner div.
   - Layer 3 (`data-testid="parallax-cards"`): empty placeholder for M003 card rendering.
6. All S02 data-testids preserved: `timeline-scroll`, `timeline-inner`, `year-label`.

Parallax math: `translateX(S * (1 - speedFactor))` counteracts the natural 1.0x scroll pull. Background (0.3x speed): S * 0.7 offset. Axis (0.6x speed): S * 0.4 offset. Cards (1.0x speed): no transform.

## Failure Modes

This component has no external runtime dependencies. Data (`eras`, `shows`) is statically imported at module load — no network or filesystem calls at runtime. The `handleScroll` callback guards all three refs with a combined null-check before any DOM mutation, so a component that unmounts mid-scroll or refs not yet attached cannot throw. The `useCallback` has an empty dependency array; no stale closure risk.

## Load Profile

The scroll handler fires at up to 60fps. Each invocation: 1 DOM read (`scrollLeft`), 2 multiplications, 2 style property writes. All O(1); no allocations on the hot path. This comfortably fits within a 16ms frame budget and does not saturate at any realistic scroll speed.

## Negative Tests

The component takes no user-controlled input at the TypeScript API surface. The only external input is `scrollLeft` from the browser DOM, which is always a non-negative number. The null-check on refs covers the early-unmount edge case. Playwright-level scroll behavior will be verified in T02's `timeline-s03.spec.ts`.

## Verification

npm run typecheck — exits 0 with zero TypeScript diagnostics. All 3 parallax layers present in JSX with correct data-testid attributes (parallax-bg, parallax-axis, parallax-cards). S02 data-testids (timeline-scroll, timeline-inner, year-label) preserved.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run typecheck` | 0 | PASS — zero TypeScript diagnostics | 2704ms |

## Deviations

none

## Known Issues

None.

## Files Created/Modified

- `app/components/TimelineContainer.tsx`
