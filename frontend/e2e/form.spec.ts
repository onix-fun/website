import { expect, test } from '@playwright/test'
import { preparePage } from './helpers'

test('contact form sends a mocked request and never calls a real endpoint', async ({ page }) => {
  await preparePage(page)
  await page.setViewportSize({ width: 1440, height: 900 })

  const requestPromise = page.waitForRequest((request) =>
    request.url() === 'https://contact.test/submit' && request.method() === 'POST',
  )

  await page.route('https://contact.test/submit', (route) =>
    route.fulfill({ status: 202, contentType: 'application/json', body: '{"accepted":true}' }),
  )

  await page.goto('/form?type=order')
  await page.getByRole('textbox', { name: /Ваше имя/ }).fill('Анна')
  await page.getByRole('textbox', { name: /Email для ответа/ }).fill('anna@example.com')
  await page.getByRole('textbox', { name: /Продукт или направление/ }).fill('Прототип')
  await page.getByRole('textbox', { name: /Опишите задачу/ }).fill('Нужно проверить форму')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: /Отправить запрос/ }).click()

  const request = await requestPromise
  expect(request.postDataJSON()).toMatchObject({
    type: 'order',
    item: 'Прототип',
    consent: true,
    consentVersion: 'onix-personal-data-2026-11-18',
  })
  await expect(page.getByRole('status')).toHaveText(
    'Сообщение отправлено. Ответим на указанный email',
  )
})
