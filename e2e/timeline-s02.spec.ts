import { test, expect } from '@playwright/test'

test('timeline-scroll container is visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-testid="timeline-scroll"]')).toBeVisible()
})

test('timeline-inner height is greater than 10000px', async ({ page }) => {
  await page.goto('/')
  const height = await page.locator('[data-testid="timeline-inner"]').evaluate((el) => (el as HTMLElement).offsetHeight)
  expect(height).toBeGreaterThan(10000)
})

test('at least one year-label is visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-testid="year-label"]').first()).toBeVisible()
})
