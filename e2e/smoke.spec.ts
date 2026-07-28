import { test, expect } from '@playwright/test'

test('page loads without error', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Frise Série/)
  await expect(page.locator('[data-testid="timeline-scroll"]')).toBeVisible()
})
