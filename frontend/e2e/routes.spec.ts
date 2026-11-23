import { expect, test } from '@playwright/test'
import { internalRoutes, preparePage } from './helpers'

test.describe('internal route resilience', () => {
  test.beforeEach(async ({ page }) => {
    await preparePage(page)
  })

  for (const width of [320, 375, 768, 1440]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })

      for (const route of internalRoutes) {
        await page.goto(route)
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(1)
      }
    })
  }

  test('keyboard users reach the main content first', async ({ page }) => {
    await page.goto('/about')
    const skipLink = page.getByRole('link', { name: 'Перейти к содержимому' })
    await skipLink.waitFor()
    await page.keyboard.press('Tab')

    await expect(page.getByRole('link', { name: 'Перейти к содержимому' })).toBeFocused()
  })

  test('metadata and noindex are route-specific', async ({ page }) => {
    await page.goto('/services')
    await expect(page).toHaveTitle('Услуги — ONIX')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'http://localhost:4174/services',
    )

    await page.goto('/does-not-exist')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    )
  })
})
