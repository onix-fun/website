import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { internalRoutes, preparePage } from './helpers'

test.describe('accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await preparePage(page)
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  for (const route of internalRoutes) {
    test(`${route} has no WCAG A/AA violations`, async ({ page }) => {
      await page.goto(route)

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      expect(results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.map((node) => node.target),
      }))).toEqual([])
    })
  }
})
