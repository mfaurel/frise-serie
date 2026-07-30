---
id: T03
parent: S03
milestone: M003
key_files:
  - e2e/timeline-s03.spec.ts
key_decisions:
  - Used toBeAttached() instead of toBeVisible() for the SVG layer because pointerEvents:none affects Playwright's visibility check
  - Used toHaveAttribute with auto-retry for the hover opacity assertion to absorb React's re-render tick without an explicit waitFor
  - Identified first span-bar show-id as the hover anchor rather than hardcoding 'spartacus', keeping the test resilient to future data re-ordering
  - Appended to the existing timeline-s03.spec.ts in a describe block rather than replacing it, preserving the 5 prior parallax tests
duration: 
verification_result: passed
completed_at: 2026-07-30T21:46:27.534Z
blocker_discovered: false
---

# T03: Added 4-test Playwright E2E spec covering constellation SVG presence, span-bar count, constellation-line count, and hover-triggered opacity change — all 9 tests pass

**Added 4-test Playwright E2E spec covering constellation SVG presence, span-bar count, constellation-line count, and hover-triggered opacity change — all 9 tests pass**

## What Happened

The existing `e2e/timeline-s03.spec.ts` had 5 parallax-layer tests from prior slices. A new `test.describe('S03 – Constellation layer (span bars and lines)')` block was appended with the 4 required acceptance tests:

1. **constellation SVG layer is present** — `toBeAttached()` on `[data-testid="constellation-layer"]`. Uses `toBeAttached` (not `toBeVisible`) because the SVG has `pointerEvents: none` which affects Playwright visibility detection.

2. **at least one span-bar element is rendered** — counts `[data-testid="span-bar"]` rects and asserts ≥ 1. Shows with non-null `narrativeYearEnd` (Spartacus, Rome, Britannia, Domina, …) produce bars.

3. **at least one constellation-line element is rendered** — counts `[data-testid="constellation-line"]` paths and asserts ≥ 1. Spartacus/Rome/Britannia all share the `peplum` genre → multiple lines.

4. **hovering a show card changes constellation line opacity** — (a) reads opacity of any constellation-line before hover (0.15 baseline, confirmed < 0.5); (b) reads `data-show-id` from the first span-bar (Spartacus, the earliest show in layout order); (c) hovers the first `[data-testid="parallax-cards"] > div` wrapper (also Spartacus); (d) asserts `toHaveAttribute('opacity', '0.9')` on a `[data-show-a="spartacus"], [data-show-b="spartacus"]` path. The auto-retry in `toHaveAttribute` absorbs the React re-render tick without needing an explicit waitFor.

All 9 tests passed on first run (9.1 s, Chromium, dev server reused on port 3000).

## Verification

npx playwright test e2e/timeline-s03.spec.ts --project=chromium → 9 passed in 9.1s (exit 0). All 4 new S03 describe-block tests passed; 5 pre-existing parallax tests also passed.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx playwright test e2e/timeline-s03.spec.ts --project=chromium` | 0 | PASS — 9 passed (4 new S03 + 5 pre-existing) | 10831ms |

## Deviations

none — the 4 test cases match the task plan exactly

## Known Issues

none

## Files Created/Modified

- `e2e/timeline-s03.spec.ts`
