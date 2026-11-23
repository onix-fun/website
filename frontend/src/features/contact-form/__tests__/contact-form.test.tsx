import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ContactForm } from '../ContactForm'

const fetchMock = vi.fn()

beforeEach(() => {
  vi.stubEnv('VITE_CONTACT_API_URL', 'https://contact.test/submit')
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockResolvedValue({ ok: true } as Response)
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

function renderForm(entry = '/form') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <ContactForm />
    </MemoryRouter>,
  )
}

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('textbox', { name: /Ваше имя/ }), 'Анна')
  await user.type(screen.getByRole('textbox', { name: /Email для ответа/ }), 'anna@example.com')
  await user.type(screen.getByRole('textbox', { name: /Опишите задачу/ }), 'Нужен прототип сервиса')
  await user.click(screen.getByRole('checkbox'))
}

describe('ContactForm', () => {
  it('sends the agreed API contract and shows the success message', async () => {
    const user = userEvent.setup()
    renderForm('/form?type=quote&item=Сервис')

    await user.click(screen.getByRole('radio', { name: 'Запросить предложение' }))
    await fillRequiredFields(user)
    await user.type(screen.getByRole('textbox', { name: /Компания/ }), 'ONIX')
    await user.click(screen.getByRole('button', { name: /Отправить запрос/ }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    const payload = JSON.parse(String(options.body))

    expect(url).toBe('https://contact.test/submit')
    expect(payload).toMatchObject({
      type: 'quote',
      name: 'Анна',
      email: 'anna@example.com',
      company: 'ONIX',
      item: 'Сервис',
      message: 'Нужен прототип сервиса',
      consent: true,
      consentVersion: 'onix-personal-data-2026-11-18',
    })
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Сообщение отправлено. Ответим на указанный email',
    )
  })

  it('shows the exact failure message when delivery fails', async () => {
    fetchMock.mockResolvedValue({ ok: false } as Response)
    const user = userEvent.setup()
    renderForm()

    await fillRequiredFields(user)
    await user.click(screen.getByRole('button', { name: /Отправить запрос/ }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Не удалось отправить сообщение. Попробуйте ещё раз или свяжитесь с нами через Telegram',
    )
  })

  it('uses the editorial placeholder and does not submit when honeypot is filled', async () => {
    const user = userEvent.setup()
    renderForm()

    expect(screen.getByPlaceholderText(
      'Что вы хотите сделать, для кого и какой результат ожидаете?',
    )).toBeInTheDocument()

    await fillRequiredFields(user)
    await user.type(document.querySelector('#contact-website') as HTMLInputElement, 'bot')
    await user.click(screen.getByRole('button', { name: /Отправить запрос/ }))

    expect(fetchMock).not.toHaveBeenCalled()
  })
})
