import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { preparePage } from './helpers'

/** Stable DOM fingerprint used by docs/audit/baseline-home.json. */
function djb2(value: string) {
  let hash = 5381
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) + hash + value.charCodeAt(index)) >>> 0
  }
  return hash.toString(16).padStart(8, '0')
}

const roundRect = (rect: DOMRect) => ({
  x: Math.round(rect.x),
  y: Math.round(rect.y),
  width: Math.round(rect.width),
  height: Math.round(rect.height),
})

test.describe('Home/Header baseline', () => {
  const states = [
    { name: 'home-1440-light', width: 1440, height: 900, theme: 'light' as const },
    { name: 'home-1440-dark', width: 1440, height: 900, theme: 'dark' as const },
    { name: 'home-375-light', width: 375, height: 812, theme: 'light' as const },
    { name: 'home-1440-collapsed', width: 1440, height: 900, theme: 'light' as const },
    { name: 'home-375-menu', width: 375, height: 812, theme: 'light' as const },
  ]

  for (const state of states) {
    test(`${state.name} is unchanged`, async ({ page }) => {
      test.setTimeout(60_000)
      await page.setViewportSize({ width: state.width, height: state.height })
      await preparePage(page, state.theme)
      await page.goto('/')
      await page.waitForSelector('[data-part="animation"] svg')
      await page.waitForTimeout(400)

      if (state.name === 'home-1440-collapsed') {
        await page.mouse.wheel(0, 600)
        await page.waitForTimeout(500)
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.waitForTimeout(700)
      }
      if (state.name === 'home-375-menu') {
        await page.locator('[aria-controls="primary-navigation-menu"]').click()
        await page.waitForTimeout(400)
      }

      const raw = await page.evaluate(() => {
        const header = document.querySelector('[data-part="header"]')
        const animation = document.querySelector('[data-part="animation"]')
        const capsule = document.querySelector('#primary-navigation-items')
        const hero = document.querySelector('[data-part="hero"]')
        const rect = capsule?.getBoundingClientRect()
        return {
          headerOuter: header?.outerHTML ?? '',
          animationInner: animation?.innerHTML ?? '',
          heroText: hero?.innerText ?? '',
          capsuleRect: rect
            ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
            : null,
          scrollY: window.scrollY,
        }
      })

      const measurement = {
        name: state.name,
        headerHash: djb2(raw.headerOuter),
        animationHash: djb2(raw.animationInner),
        animationLength: raw.animationInner.length,
        heroText: raw.heroText,
        capsuleRect: raw.capsuleRect ? roundRect(raw.capsuleRect as DOMRect) : null,
        theme: state.theme,
        scrollY: raw.scrollY,
      }
      const baseline: unknown[] = JSON.parse(
        readFileSync('../docs/audit/baseline-home.json', 'utf8'),
      )
      const expected = baseline.find((item) => (item as { name?: string }).name === state.name)

      expect(measurement).toEqual(expected)
    })
  }
})
