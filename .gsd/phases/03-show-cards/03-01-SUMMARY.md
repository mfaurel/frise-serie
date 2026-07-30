---
id: S01
parent: M003
milestone: M003
provides:
  - ShowCard component with era-colored star-node glow, poster fallback, title, year labels
  - TimelineContainer renders all shows at yearToPixel-computed horizontal positions
  - Playwright E2E spec e2e/timeline-s01.spec.ts as executable acceptance gate
requires:
  []
affects:
  - S02
  - S03
key_files:
  - app/components/ShowCard.tsx
  - app/components/TimelineContainer.tsx
  - e2e/timeline-s01.spec.ts
key_decisions:
  - Era glow color uses era.colorPalette[last] — the most vibrant swatch; consistent with the era palette design in data/eras.ts
  - Poster fallback is a grey inline SVG data-URI — no network request, no broken-image icon, always available
  - yearToDisplay() used for narrative years to correctly format BC/AD; broadcast years displayed as raw integers
  - Import path must be @/app/components/ShowCard (not @/components/ShowCard) because @/* maps to project root (.)
  - Card centered with translateX(-44px) because ShowCard is 88px wide
  - Era lookup: eras.find with >= yearStart && <= yearEnd, falling back to eras[0] for edge cases
patterns_established:
  - ShowCard is a pure presentational component — positioning/layout owned by the parent (TimelineContainer)
  - data-testid attributes on interactive/targetable elements for Playwright spec stability
  - Era lookup with eras[0] fallback — same half-open-with-fallback pattern as density.ts
observability_surfaces:
  - none — pure client-side React component with no runtime health dimension; failure is browser-visible (no cards rendered) and Playwright-detectable (spec exits non-zero)
drill_down_paths:
  - .gsd/phases/03-show-cards/T01-SUMMARY.md
  - .gsd/phases/03-show-cards/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-07-30T20:42:32.433Z
blocker_discovered: false
---

# S01: ShowCard component with star-node glow and positioning

**ShowCard component renders era-colored star-node glow, poster with SVG fallback, title, and year labels; wired into TimelineContainer parallax-cards layer at yearToPixel-computed positions; 4/4 Playwright tests pass**

## What Happened

**T01 — ShowCard component built**

Created `app/components/ShowCard.tsx` as a `'use client'` React component accepting `show: Show` and `era: Era` props. The component renders five visual elements: (1) a 14×14 circular star-node glow `div` using `era.colorPalette[last]` as background color with matching `box-shadow: 0 0 10px 5px <eraColor>`; (2) a poster `<img>` with an `onError` handler that swaps to `GREY_POSTER` — an inline grey 80×112 SVG data-URI requiring no network request; (3) the show title (`show.title.en`) in bold 11px truncated white text; (4) narrative year range via `yearToDisplay()` for correct BC/AD formatting; and (5) broadcast year range as raw integers with em-dash. The root div carries `data-testid="show-card"`. TypeScript typecheck passed (exit 0) with no errors.

**T02 — Wired into TimelineContainer; Playwright spec created and passes**

Imported ShowCard into `app/components/TimelineContainer.tsx` and replaced the empty parallax-cards placeholder with a map over all shows. Each card wrapper uses `position: absolute; left: yearToPixel(show.narrativeYearStart, zones)px; top: 120px; transform: translateX(-44px)` to center the 88px-wide card on its timeline anchor. Era lookup: `eras.find(e => e.yearStart <= year && year <= e.yearEnd) ?? eras[0]`, consistent with density.ts convention. Import path required `@/app/components/ShowCard` (not `@/components/ShowCard`) because `@/*` maps to project root.

Created `e2e/timeline-s01.spec.ts` with 4 Playwright tests: (1) parallax-cards layer contains ≥1 show-card; (2) first card is visible and contains a 4-digit year; (3) first card wrapper has a positive left offset; (4) star-node glow has a non-empty box-shadow. Fresh slice-level run: 4/4 passed (12.4s) against the auto-started dev server.

## Verification

Fresh slice-level verification (this closeout unit):
- `npm run typecheck` → exit 0, no TypeScript errors (exec id: 282729c5, 2.8s)
- `npx playwright test e2e/timeline-s01.spec.ts` → exit 0, 4/4 chromium tests passed in 12.4s (exec id: 19c083a4)

Test coverage:
1. parallax-cards layer contains ≥1 show-card — PASS
2. first show-card visible with 4-digit year text — PASS
3. first card wrapper has positive left offset (yearToPixel > 0 for Spartacus at -73) — PASS
4. star-node glow has non-empty box-shadow — PASS

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

none

## Known Limitations

- No swim-lane collision avoidance: cards at the same horizontal position overlap (deferred to S02)\n- No narrative span bars or constellation lines (deferred to S03)\n- Poster broken-URL fallback is implemented but not covered by an automated test in the Playwright spec (edge case documented in UAT)

## Follow-ups

- S02 must implement swim-lane layout to prevent card overlap in dense eras (Antiquity era will have visible overlap with current data)\n- Playwright test 3 assumes Spartacus is the first show; if show ordering in data/shows.ts changes, that test's selector may need updating

## Files Created/Modified

- `app/components/ShowCard.tsx` — New presentational component: era-colored star-node glow, poster with SVG fallback, title, narrative/broadcast year ranges, data-testid
- `app/components/TimelineContainer.tsx` — ShowCard wired into parallax-cards layer with yearToPixel absolute positioning and era lookup
- `e2e/timeline-s01.spec.ts` — 4-test Playwright spec covering card presence, text content, yearToPixel offset, and star-node box-shadow
