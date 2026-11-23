import { expect, test } from '@playwright/test'
import { preparePage } from './helpers'

const pages = ['/about', '/services', '/catalog', '/digital', '/form']

test.describe('critical internal layouts', () => {
  test.beforeEach(async ({ page }) => {
    await preparePage(page)
  })

  async function stabilize(page: import('@playwright/test').Page) {
    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }',
    })
  }

  for (const route of pages) {
    test(`${route} at 1440px`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(route)
      await stabilize(page)
      await expect(page).toHaveScreenshot(`${route.slice(1)}-1440.png`)
    })

    test(`${route} at 375px`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })
      await page.goto(route)
      await stabilize(page)
      await expect(page).toHaveScreenshot(`${route.slice(1)}-375.png`)
    })
  }
})
