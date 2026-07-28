import { test, expect } from '@playwright/test'

test('parallax-bg layer is visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-testid="parallax-bg"]')).toBeVisible()
})

test('parallax-axis layer is visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-testid="parallax-axis"]')).toBeVisible()
})

test('parallax-cards layer is visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-testid="parallax-cards"]')).toBeVisible()
})

test('era-bg count equals 9', async ({ page }) => {
  await page.goto('/')
  const eraBgs = page.locator('[data-testid="era-bg"]')
  await expect(eraBgs).toHaveCount(9)
})

test('scroll drives parallax-bg transform', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-testid="timeline-scroll"]').evaluate((el) => {
    ;(el as HTMLElement).scrollLeft = 500
    el.dispatchEvent(new Event('scroll'))
  })
  const transform = await page.locator('[data-testid="parallax-bg"]').evaluate(
    (el) => (el as HTMLElement).style.transform
  )
  expect(transform).toBe('translateX(350px)')
})
