---
estimated_steps: 13
estimated_files: 2
skills_used: []
---

# T01: Implement constellation-lines pure logic and unit tests

Why: Span-bar geometry and show-relationship computation need isolated, testable pure functions before any React component can consume them. Co-locating logic in lib/ keeps the component thin and the math verifiable without a browser.

Do:
1. Create lib/constellationLines.ts exporting:
   - `SpanBarDatum { showId: string; x1: number; x2: number; y: number; color: string }`
   - `SegmentDatum { key: string; x1: number; y1: number; x2: number; y2: number; showIdA: string; showIdB: string }`
   - `computeRelatedShows(shows: Show[]): Map<string, string[]>` — two shows are related if their `genres` arrays share at least one value. Each map entry lists the IDs of all related shows for that key ID.
   - `computeSpanBars(layout: LaidOutShow[], zones: DensityZone[], eras: Era[]): SpanBarDatum[]` — one SpanBarDatum per show where `narrativeYearEnd !== null`. `x1 = yearToPixel(show.narrativeYearStart, zones)`, `x2 = yearToPixel(show.narrativeYearEnd, zones)`, `y = item.top + 7` (center of the 14px star-node), `color = era.colorPalette[era.colorPalette.length - 1]` (last vibrant swatch, same convention as ShowCard glow). Era lookup: `eras.find(e => year >= e.yearStart && year <= e.yearEnd) ?? eras[0]`.
   - `computeConstellationSegments(layout: LaidOutShow[], related: Map<string, string[]>): SegmentDatum[]` — one SegmentDatum per unique unordered pair (A, B) where B is in related.get(A). Key is `${minId}--${maxId}` for deduplication. x1/y1 = (left, top + 7) for showA, x2/y2 for showB.
2. Create tests/constellation-lines.test.ts using vitest. Test cases:
   - computeRelatedShows: two shows sharing one genre are related; two shows with no shared genres are not; self is not in own related list.
   - computeSpanBars: show with non-null narrativeYearEnd produces a SpanBarDatum; show with null narrativeYearEnd is excluded.
   - computeConstellationSegments: two related shows produce exactly one segment; non-related pair produces no segment; three mutually related shows produce exactly three segments (no duplicates).

Done when: `npx vitest run tests/constellation-lines.test.ts` exits 0 with all tests green.

## Inputs

- `types/index.ts`
- `lib/swimLane.ts`
- `lib/yearToPixel.ts`
- `data/eras.ts`

## Expected Output

- `lib/constellationLines.ts`
- `tests/constellation-lines.test.ts`

## Verification

npx vitest run tests/constellation-lines.test.ts

## Observability Impact

Pure logic module — no runtime observability surface. Failures surface as test exits non-zero.
