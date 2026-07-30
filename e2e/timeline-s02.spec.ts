import { test, expect } from '@playwright/test'

test.describe('S02 – Swim-lane layout engine', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('at least two show-cards are visible after swim-lane wiring', async ({ page }) => {
    const cards = page.locator('[data-testid="parallax-cards"] [data-testid="show-card"]')
    await expect(cards.first()).toBeVisible()
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('swim-lane is active: card wrappers do not all share the same top offset', async ({ page }) => {
    const wrappers = page.locator('[data-testid="parallax-cards"] > div')
    const count = await wrappers.count()
    expect(count).toBeGreaterThanOrEqual(2)
    const tops = new Set<string>()
    for (let i = 0; i < count; i++) {
      const top = await wrappers.nth(i).evaluate(
        (el) => (el as HTMLElement).style.top
      )
      tops.add(top)
    }
    // If all tops are identical the swim-lane engine did nothing
    expect(tops.size).toBeGreaterThan(1)
  })
})
