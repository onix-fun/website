import type { Page } from '@playwright/test'

export const internalRoutes = [
  '/about',
  '/services',
  '/catalog',
  '/catalog/object-01',
  '/digital',
  '/digital/digital-01',
  '/form',
  '/privacy',
  '/personal-data',
  '/cookies',
  '/does-not-exist',
]

export async function preparePage(page: Page, theme: 'light' | 'dark' = 'light') {
  await page.context().addCookies([
    {
      name: 'onix-cookie-consent',
      value: 'accepted',
      url: 'http://localhost:4174',
    },
  ])
  await page.addInitScript((value) => {
    window.localStorage.setItem('onix-theme', value)
  }, theme)
  await page.emulateMedia({ reducedMotion: 'reduce' })
}
