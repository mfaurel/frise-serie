---
estimated_steps: 9
estimated_files: 1
skills_used: []
---

# T03: Write and pass Playwright E2E spec for span bars, constellation lines, and hover highlighting

Why: Browser-observable acceptance gate for S03 visual behavior. TypeScript typecheck alone does not confirm the SVG is rendered at runtime or that hover state changes visual attributes correctly.

Do:
1. Create e2e/timeline-s03.spec.ts with the following test cases:
   - Test 1 "constellation SVG layer is present": navigate to '/', locate `[data-testid="constellation-layer"]`, assert it is attached to the DOM (not necessarily visible, since pointerEvents: none may affect Playwright visibility; use `toBeAttached()`).
   - Test 2 "at least one span-bar element is rendered": locate `[data-testid="span-bar"]`, assert count >= 1. (Rome -52 to -27 and others with non-null narrativeYearEnd will produce bars.)
   - Test 3 "at least one constellation-line element is rendered": locate `[data-testid="constellation-line"]`, assert count >= 1. (Spartacus, Rome, Britannia all share 'peplum' → at least 3 lines.)
   - Test 4 "hovering a show card changes constellation line opacity": get the opacity of any constellation-line path before hover; hover the first card wrapper `[data-testid="parallax-cards"] > div`; get the opacity of any `[data-show-a]` or `[data-show-b]` path that references that show's id; assert the opacity after hover is greater than before (or equals 0.9). To get hovered show id, read `data-show-id` from the first span-bar element. Then target lines where data-show-a or data-show-b equals that id.
2. Verify the spec runs cleanly against the dev server (dev server auto-starts via playwright.config.ts webServer block).

Done when: `npx playwright test e2e/timeline-s03.spec.ts` exits 0 with all 4 tests passing in Chromium.

## Inputs

- `app/components/ConstellationLayer.tsx`
- `app/components/TimelineContainer.tsx`
- `playwright.config.ts`

## Expected Output

- `e2e/timeline-s03.spec.ts`

## Verification

npx playwright test e2e/timeline-s03.spec.ts

## Observability Impact

Test output is the observability surface — Playwright reporter shows which assertions fail and what DOM state was found at the time of failure.
