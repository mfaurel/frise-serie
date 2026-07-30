---
id: T01
parent: S03
milestone: M003
key_files:
  - lib/constellationLines.ts
  - tests/constellation-lines.test.ts
key_decisions:
  - SpanBarDatum.y = item.top + 7 (center of 14px star-node, matching ShowCard glow convention)
  - Era lookup uses narrativeYearStart; fallback is eras[0] when year is out of range
  - Segment deduplication key is ${minId}--${maxId} (lexicographic sort ensures uniqueness)
  - computeConstellationSegments silently skips shows in the related map that are absent from the layout array (layout may be a filtered subset)
duration: 
verification_result: passed
completed_at: 2026-07-30T21:40:05.335Z
blocker_discovered: false
---

# T01: Added pure constellation-lines logic (SpanBarDatum, SegmentDatum, computeRelatedShows, computeSpanBars, computeConstellationSegments) with 11 passing unit tests

**Added pure constellation-lines logic (SpanBarDatum, SegmentDatum, computeRelatedShows, computeSpanBars, computeConstellationSegments) with 11 passing unit tests**

## What Happened

Created lib/constellationLines.ts exporting the four types and three pure functions specified in the task plan. computeRelatedShows builds a Map keyed by show ID listing IDs of all shows sharing at least one genre value. computeSpanBars maps each LaidOutShow with a non-null narrativeYearEnd to a SpanBarDatum using yearToPixel for x coordinates, top+7 for vertical center, and the last colorPalette swatch from the era containing narrativeYearStart. computeConstellationSegments iterates the related map, deduplicates pairs via a lexicographic key, and emits one SegmentDatum per unique unordered pair.

Created tests/constellation-lines.test.ts with 11 test cases using vitest. Tests cover: two shows sharing a genre are related; shows with no shared genre are not; self absent from own list; empty related list; span bar with non-null end; span bar excluded for null end; color is last palette swatch; two related shows produce exactly one segment; non-related pair produces none; three mutually related shows produce three segments with no duplicates; segment coordinates match left and top+7.

All 11 tests passed (npx vitest run tests/constellation-lines.test.ts, exit 0, ~262ms).

## Verification

npx vitest run tests/constellation-lines.test.ts — 11 tests passed, exit 0, 262ms total

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx vitest run tests/constellation-lines.test.ts` | 0 | PASS — 11/11 tests green | 262ms |

## Deviations

none — implementation matches the task plan exactly

## Known Issues

none

## Files Created/Modified

- `lib/constellationLines.ts`
- `tests/constellation-lines.test.ts`
