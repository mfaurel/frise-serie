---
id: S03
parent: M003
milestone: M003
provides:
  - SVG ConstellationLayer with era-colored span bars (data-testid=span-bar, data-show-id) and hover-reactive constellation lines (data-testid=constellation-line, data-show-a, data-show-b)
  - hoveredShowId state in TimelineContainer wired to onMouseEnter/onMouseLeave on card wrappers
  - Pure functions computeRelatedShows, computeSpanBars, computeConstellationSegments in lib/constellationLines.ts
  - 11-test vitest unit suite for constellation geometry in tests/constellation-lines.test.ts
  - 4-test Playwright E2E block in e2e/timeline-s03.spec.ts covering SVG presence, span-bar rendering, line rendering, and hover opacity
requires:
  - slice: S01
    provides: ShowCard component with star-node glow and yearToPixel positioning
  - slice: S02
    provides: LaidOutShow type and CARD_HEIGHT/BASE_TOP constants from lib/swimLane.ts
affects:
  []
key_files:
  - lib/constellationLines.ts
  - tests/constellation-lines.test.ts
  - app/components/ConstellationLayer.tsx
  - app/components/TimelineContainer.tsx
  - e2e/timeline-s03.spec.ts
key_decisions:
  - SpanBarDatum.y = item.top + 7 (center of 14px star-node, matching ShowCard glow convention)
  - pointerEvents:'none' on SVG wrapper + overlay div prevents card hover events from being intercepted by the SVG layer
  - findEraForYear duplicated locally in ConstellationLayer.tsx to avoid exporting an internal helper from constellationLines.ts
  - Segment deduplication key ${minId}--${maxId} uses lexicographic sort — each unordered pair emits exactly one constellation line
  - toBeAttached() used in Playwright spec (not toBeVisible()) for pointer-events:none SVG elements
  - toHaveAttribute auto-retry absorbs React re-render tick for hover opacity assertion without explicit waitFor
  - Hover anchor derived from first span-bar's data-show-id rather than hardcoded show name — resilient to future data reordering
patterns_established:
  - Absolutely-positioned pointer-events:none SVG overlay with data-testid anchors — enables Playwright testing of decorative layers without intercepting UI events
  - Three-tier opacity model for constellation lines: 0.15 default / 0.9 active (hoveredShowId matches endpoint) / 0.05 inactive (unrelated show hovered)
  - Pure lib/ geometry functions (computeSpanBars, computeConstellationSegments) consumed by thin React SVG component — math unit-tested independently of browser
observability_surfaces:
  - Browser DevTools: [data-testid=constellation-layer] SVG inspectable; span bars carry data-show-id; constellation lines carry data-show-a and data-show-b for targeted querying
  - Playwright spec e2e/timeline-s03.spec.ts: exits non-zero on any constellation regression
  - Failure is browser-visible (no SVG overlay rendered) and spec-detectable (assertion failures on element counts or opacity attributes)
drill_down_paths:
  - .gsd/phases/03-show-cards/T01-SUMMARY.md
  - .gsd/phases/03-show-cards/T02-SUMMARY.md
  - .gsd/phases/03-show-cards/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-07-30T21:49:39.494Z
blocker_discovered: false
---

# S03: Narrative span bars and constellation lines

**SVG ConstellationLayer renders era-colored span bars and hover-reactive constellation lines wired into TimelineContainer via hoveredShowId state, completing M003's full visual feature set**

## What Happened

Three tasks delivered the slice end-to-end.

**T01** created `lib/constellationLines.ts` exporting four types (SpanBarDatum, SegmentDatum) and three pure functions: `computeRelatedShows` (builds a Map of show ID → related show IDs keyed on shared genre values), `computeSpanBars` (maps each LaidOutShow with a non-null narrativeYearEnd to a span-bar datum using yearToPixel for x-coordinates, top+7 for vertical center matching the 14px star-node glow convention, and the last colorPalette swatch from the era containing narrativeYearStart), and `computeConstellationSegments` (iterates the related map, deduplicates unordered pairs via a lexicographic `${minId}--${maxId}` key, and emits one SegmentDatum per unique pair). Eleven vitest unit tests validated all geometry, era-color assignment, self-exclusion, null-end filtering, and deduplication logic in 262ms.

**T02** built `app/components/ConstellationLayer.tsx` as a `'use client'` SVG overlay. Props: `layout`, `zones`, `eras`, `relatedShows`, `hoveredShowId`, `totalWidth`. Span bars render as `<rect>` elements (data-testid="span-bar", data-show-id) with opacity fading non-hovered shows to 0.2. Constellation lines render as quadratic-bezier `<path>` elements (data-testid="constellation-line", data-show-a, data-show-b) with three tiers: 0.15 default (no hover), 0.9 active (hoveredShowId matches one endpoint), 0.05 inactive (unrelated show hovered). `pointerEvents:'none'` on both the wrapper div and the SVG element prevents the overlay from intercepting card hover events. `findEraForYear` was duplicated locally to avoid exporting an internal helper from constellationLines.ts. `TimelineContainer.tsx` was updated to import and compute `relatedShows`, declare `hoveredShowId` state, mount `ConstellationLayer` in an absolutely-positioned pointer-events-none div before the parallax-cards div, and attach `onMouseEnter`/`onMouseLeave` handlers to each card wrapper. TypeScript typecheck exited 0 with no errors.

**T03** appended a `describe('S03 – Constellation layer (span bars and lines)')` block to the existing `e2e/timeline-s03.spec.ts` (which already held 5 parallax tests from prior slices). The 4 new acceptance tests use `toBeAttached()` (not `toBeVisible()` — pointerEvents:none affects Playwright visibility detection), count assertions for span-bar and constellation-line elements, and `toHaveAttribute` auto-retry for the hover opacity change to absorb React's re-render tick without an explicit waitFor. The hover anchor is derived from the first span-bar's data-show-id rather than hardcoding a show name, making the test resilient to future data reordering. All 9 tests passed on first run in 9.1s.

## Verification

Slice-level verification run via gsd_exec (node runtime, Windows host):

| Check | Command | Exit | Result | Evidence |
|-------|---------|------|--------|----------|
| TypeScript | `npm run typecheck` (tsc --noEmit) | 0 | PASS — no errors | gsd_exec 8c12ec6c, 1.9s |
| Playwright E2E | `npx playwright test e2e/timeline-s03.spec.ts --project=chromium` | 0 | PASS — 9/9 (4 S03 constellation + 5 pre-existing parallax) | gsd_exec 86a6721c, 13.9s |

Task-level evidence:
- T01: `npx vitest run tests/constellation-lines.test.ts` — 11/11 passed, 262ms
- T02: `npm run typecheck` — exit 0, 8.2s
- T03: `npx playwright test e2e/timeline-s03.spec.ts --project=chromium` — 9 passed, 10.8s

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

none — all three tasks matched their plans exactly with no blockers or scope changes

## Known Limitations

- Span-bar and line positions are computed once at render using totalWidth at mount time; resizing the window without remounting TimelineContainer will not recompute coordinates
- Hover state uses onMouseEnter/onMouseLeave; touch devices do not trigger constellation highlighting
- findEraForYear is duplicated in ConstellationLayer.tsx — if era type structure changes, both copies must be updated manually

## Follow-ups

- Consider adding a viewport-resize effect in TimelineContainer to remount or recompute ConstellationLayer dimensions if responsive layout becomes a requirement
- The findEraForYear helper could be exported from constellationLines.ts (or a shared utility) if a third consumer emerges

## Files Created/Modified

- `lib/constellationLines.ts` — New: pure functions computeRelatedShows, computeSpanBars, computeConstellationSegments plus SpanBarDatum and SegmentDatum types
- `tests/constellation-lines.test.ts` — New: 11 vitest unit tests covering genre-relationship logic, span-bar geometry, era-color assignment, and segment deduplication
- `app/components/ConstellationLayer.tsx` — New: 'use client' SVG overlay rendering span bars and constellation lines with three-tier hover opacity
- `app/components/TimelineContainer.tsx` — Modified: added hoveredShowId state, relatedShows computation, ConstellationLayer mount, and onMouseEnter/onMouseLeave wiring on card wrappers
- `e2e/timeline-s03.spec.ts` — Modified: appended 4-test S03 constellation describe block (SVG presence, span-bar count, line count, hover opacity) to existing parallax spec
