---
estimated_steps: 14
estimated_files: 2
skills_used: []
---

# T02: Build ConstellationLayer SVG component and wire hover state into TimelineContainer

Why: The pure logic from T01 needs a React SVG rendering layer and hover state wiring in TimelineContainer before any browser-visible behavior exists. This task completes the full visual implementation.

Do:
1. Create app/components/ConstellationLayer.tsx as a 'use client' component:
   - Props: `layout: LaidOutShow[]`, `zones: DensityZone[]`, `eras: Era[]`, `relatedShows: Map<string, string[]>`, `hoveredShowId: string | null`, `totalWidth: number`
   - Compute `spanBars = computeSpanBars(layout, zones, eras)` and `segments = computeConstellationSegments(layout, relatedShows)` inside the component body.
   - Render an `<svg data-testid="constellation-layer" style={{ position: 'absolute', inset: 0, width: totalWidth, height: '100%', overflow: 'visible', pointerEvents: 'none' }}>`.
   - Inside the SVG, render span bars as `<rect>` elements: x={bar.x1}, y={bar.y - 1}, width={bar.x2 - bar.x1}, height={2}, fill={bar.color}, opacity={hoveredShowId === null || hoveredShowId === bar.showId ? 0.8 : 0.2}, data-testid="span-bar", data-show-id={bar.showId}.
   - Render constellation lines as `<path>` elements using a quadratic bezier: `M x1 y1 Q ${(x1+x2)/2} ${Math.min(y1,y2) - 40} x2 y2`. A line is active when hoveredShowId is one of its two endpoint showIds. Opacity: active → 0.9, default (no hover) → 0.15, inactive (hover on unrelated show) → 0.05. Stroke: era color of showIdA (look up from eras). stroke-width: 1. fill: none. data-testid="constellation-line", data-show-a={seg.showIdA}, data-show-b={seg.showIdB}.
2. Update app/components/TimelineContainer.tsx:
   - Add `const [hoveredShowId, setHoveredShowId] = useState<string | null>(null)` (import useState from react).
   - Compute `relatedShows = computeRelatedShows(shows)` from lib/constellationLines.ts.
   - Add a new SVG layer div BEFORE the parallax-cards div: render `<ConstellationLayer layout={layout} zones={zones} eras={eras} relatedShows={relatedShows} hoveredShowId={hoveredShowId} totalWidth={totalWidth} />` wrapped in `<div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>`.
   - In the card wrapper divs (inside layout.map), add `onMouseEnter={() => setHoveredShowId(show.id)}` and `onMouseLeave={() => setHoveredShowId(null)}`.

Done when: `npm run typecheck` exits 0 with no TypeScript errors.

## Inputs

- `lib/constellationLines.ts`
- `lib/swimLane.ts`
- `lib/yearToPixel.ts`
- `lib/density.ts`
- `data/shows.ts`
- `data/eras.ts`
- `types/index.ts`
- `app/components/TimelineContainer.tsx`

## Expected Output

- `app/components/ConstellationLayer.tsx`
- `app/components/TimelineContainer.tsx`

## Verification

npm run typecheck

## Observability Impact

SVG [data-testid="constellation-layer"] visible in browser DevTools; span bars carry data-show-id; constellation lines carry data-show-a and data-show-b for targeted inspection.
