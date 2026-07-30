import { test, expect } from '@playwright/test'

test.describe('S03 – Constellation layer (span bars and lines)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('constellation SVG layer is present', async ({ page }) => {
    await expect(page.locator('[data-testid="constellation-layer"]')).toBeAttached()
  })

  test('at least one span-bar element is rendered', async ({ page }) => {
    const count = await page.locator('[data-testid="span-bar"]').count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('at least one constellation-line element is rendered', async ({ page }) => {
    const count = await page.locator('[data-testid="constellation-line"]').count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('hovering a show card changes constellation line opacity', async ({ page }) => {
    // Initial state: no show hovered → all lines at opacity 0.15
    const opacityBefore = await page.locator('[data-testid="constellation-line"]').first().getAttribute('opacity')
    expect(Number(opacityBefore)).toBeLessThan(0.5)

    // First span-bar identifies the earliest show in the layout (Spartacus, which has peplum lines)
    const hoveredShowId = await page.locator('[data-testid="span-bar"]').first().getAttribute('data-show-id')
    expect(hoveredShowId).toBeTruthy()

    // Hover the first card wrapper (same earliest show)
    await page.locator('[data-testid="parallax-cards"] > div').first().hover()

    // Lines connected to the hovered show should be active (opacity 0.9)
    await expect(
      page.locator(`[data-show-a="${hoveredShowId}"], [data-show-b="${hoveredShowId}"]`).first()
    ).toHaveAttribute('opacity', '0.9')
  })
})


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
  await page.waitForLoadState('networkidle')
  await page.locator('[data-testid="timeline-scroll"]').evaluate((el) => {
    ;(el as HTMLElement).scrollLeft = 500
    el.dispatchEvent(new Event('scroll'))
  })
  await page.waitForFunction(
    () => {
      const el = document.querySelector('[data-testid="parallax-bg"]') as HTMLElement | null
      return el?.style.transform === 'translateX(350px)'
    },
    { timeout: 3000 }
  )
  const transform = await page.locator('[data-testid="parallax-bg"]').evaluate(
    (el) => (el as HTMLElement).style.transform
  )
  expect(transform).toBe('translateX(350px)')
})
