---
estimated_steps: 10
estimated_files: 2
skills_used: []
---

# T02: Write S03 Playwright spec for parallax layers and fix stale smoke.spec.ts

Why: The parallax implementation needs browser-observable verification. The S02 summary explicitly flagged that e2e/smoke.spec.ts expects a "Frise Série" heading that was removed when app/page.tsx was updated to render TimelineContainer — this must be fixed before the full suite is run in milestone validation.

Do:
1. Create e2e/timeline-s03.spec.ts with 5 test assertions:
   a. parallax-bg layer is visible: await expect(page.locator('[data-testid="parallax-bg"]')).toBeVisible()
   b. parallax-axis layer is visible: await expect(page.locator('[data-testid="parallax-axis"]')).toBeVisible()
   c. parallax-cards layer is visible: await expect(page.locator('[data-testid="parallax-cards"]')).toBeVisible()
   d. era-bg count equals 9: const eraBgs = page.locator('[data-testid="era-bg"]'); await expect(eraBgs).toHaveCount(9)
   e. scroll drives parallax transform: use page.locator('[data-testid="timeline-scroll"]').evaluate to set el.scrollLeft = 500 and dispatch new Event('scroll'), then read page.locator('[data-testid="parallax-bg"]').evaluate(el => (el as HTMLElement).style.transform) and expect it to equal 'translateX(350px)' (500 * 0.7 = 350)
2. Update e2e/smoke.spec.ts: replace the broken heading test ('Frise Série') with a check that the page loads and the timeline-scroll container is visible (reuses the same assertion already present in timeline-s02.spec.ts is fine, but rename the test description to 'page loads without error').

Done when: npx playwright test e2e/timeline-s03.spec.ts --reporter=line exits 0 with all 5 assertions passing.

## Inputs

- `app/components/TimelineContainer.tsx`
- `e2e/timeline-s02.spec.ts`
- `e2e/smoke.spec.ts`
- `data/eras.ts`

## Expected Output

- `e2e/timeline-s03.spec.ts`
- `e2e/smoke.spec.ts`

## Verification

npx playwright test e2e/timeline-s03.spec.ts --reporter=line
