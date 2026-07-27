import { test, expect } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Frise Série/)
  await expect(page.getByRole('heading', { name: 'Frise Série' })).toBeVisible()
})
