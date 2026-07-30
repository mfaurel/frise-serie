import { test, expect } from '@playwright/test'

test.describe('S01 – ShowCard placement on timeline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('parallax-cards layer contains at least one show-card', async ({ page }) => {
    const cards = page.locator('[data-testid="parallax-cards"] [data-testid="show-card"]')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('first show-card is rendered and has visible text content', async ({ page }) => {
    const firstCard = page.locator('[data-testid="show-card"]').first()
    await expect(firstCard).toBeVisible()
    const text = await firstCard.textContent()
    expect(text).toBeTruthy()
    // Broadcast year range contains a 4-digit year
    expect(text).toMatch(/\d{4}/)
  })

  test('show-card wrapper has a positive left offset from yearToPixel positioning', async ({ page }) => {
    // The first show (Spartacus, narrativeYearStart: -73) is deep in the Antiquity era
    // and must not be placed at pixel 0
    const firstWrapper = page.locator('[data-testid="parallax-cards"] > div').first()
    await expect(firstWrapper).toBeVisible()
    const left = await firstWrapper.evaluate(
      (el) => parseFloat((el as HTMLElement).style.left)
    )
    expect(left).toBeGreaterThan(0)
  })

  test('show-card star-node glow has a non-empty box-shadow', async ({ page }) => {
    // Confirm era-colored glow is applied (box-shadow is inspectable via computed styles)
    const starNode = page.locator('[data-testid="show-card"] > div').first()
    await expect(starNode).toBeVisible()
    const boxShadow = await starNode.evaluate(
      (el) => window.getComputedStyle(el).boxShadow
    )
    expect(boxShadow).not.toBe('')
    expect(boxShadow).not.toBe('none')
  })
})
