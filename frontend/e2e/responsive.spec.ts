import { expect, test } from '@playwright/test'
import { internalRoutes, preparePage } from './helpers'

test.describe('responsive edge cases', () => {
  for (const theme of ['light', 'dark'] as const) {
    test(`${theme}: no overflow with 200% text or in landscape`, async ({ page }) => {
      await preparePage(page, theme)
      await page.addInitScript(() => {
        document.documentElement.style.fontSize = '200%'
      })

      for (const viewport of [
        { width: 320, height: 900 },
        { width: 812, height: 375 },
      ]) {
        await page.setViewportSize(viewport)

        for (const route of internalRoutes) {
          await page.goto(route)
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
          )
          expect(overflow, `${route} at ${viewport.width}px with ${theme} theme`).toBeLessThanOrEqual(1)
        }
      }
    })
  }
})
