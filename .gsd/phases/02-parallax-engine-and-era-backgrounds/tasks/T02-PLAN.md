---
estimated_steps: 8
estimated_files: 2
skills_used: []
---

# T02: Wire TimelineContainer into app/page.tsx and add Playwright e2e spec

Why: The component built in T01 must be rendered on the home route, and the slice acceptance criteria (scrollable container with correct pixel width, year labels visible) must be exercised by an automated browser test so slice closeout can use runtime-executable UAT.

Do:
1. Update app/page.tsx: remove the centered h1 heading, import TimelineContainer from @/components/TimelineContainer, return a main element containing only <TimelineContainer />.
2. Create e2e/timeline-s02.spec.ts with three assertions:
   a. Navigate to '/'. Assert page.locator('[data-testid="timeline-scroll"]').toBeVisible().
   b. Use page.locator('[data-testid="timeline-inner"]').evaluate(el => el.offsetWidth) and expect the result to be greater than 10000. (VIRTUAL_CANVAS_WIDTH is 20000; weighted zones produce an actual total in the 10000–30000 range.)
   c. Assert page.locator('[data-testid="year-label"]').first().toBeVisible() — confirms at least one year label rendered.

Done when: npx playwright test e2e/timeline-s02.spec.ts exits 0 with all three assertions passing against the live dev server.

## Inputs

- `app/components/TimelineContainer.tsx`
- `playwright.config.ts`
- `e2e/smoke.spec.ts`

## Expected Output

- `app/page.tsx`
- `e2e/timeline-s02.spec.ts`

## Verification

npx playwright test e2e/timeline-s02.spec.ts

## Observability Impact

Playwright report written to playwright-report/ on failure with screenshot and trace. Test names map directly to slice acceptance criteria for fast triage.
