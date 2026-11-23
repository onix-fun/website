import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONTACT_URL } from '@/common'
import { Button } from '@/common/ui/button'
import { ContactFormStyles } from './ContactForm.styles'

type RequestType = 'order' | 'quote' | 'demo'
type SubmitState = 'success' | 'error' | null

const requestTypes: { id: RequestType; label: string }[] = [
  { id: 'order', label: 'Обсудить заказ' },
  { id: 'quote', label: 'Запросить коммерческое предложение' },
  { id: 'demo', label: 'Запросить демонстрацию' },
]

const consentVersion = 'onix-personal-data-2026-11-18'

function getInitialType(value: string | null): RequestType {
  return requestTypes.some((request) => request.id === value)
    ? (value as RequestType)
    : 'order'
}

function getMessagePlaceholder(type: RequestType) {
  if (type === 'quote') return 'Опишите процесс, продукт или объём работ, который хотите обсудить.'
  if (type === 'demo') return 'Напишите, какой продукт или сценарий хотите увидеть.'
  return 'Расскажите, что хотите заказать и какие детали уже известны.'
}

export function ContactForm() {
  const [searchParams] = useSearchParams()
  const [requestType, setRequestType] = useState<RequestType>(() => getInitialType(searchParams.get('type')))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<SubmitState>(null)
  const endpoint = import.meta.env.VITE_CONTACT_API_URL?.trim()
  const item = searchParams.get('item') ?? ''

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    if (String(data.get('website') ?? '').trim()) return
    if (!endpoint) return

    setIsSubmitting(true)
    setSubmitState(null)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: data.get('type'),
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company'),
          item: data.get('item'),
          message: data.get('message'),
          consent: data.get('consent') === 'on',
          consentVersion,
          website: data.get('website'),
        }),
      })

      if (!response.ok) throw new Error('Request was not accepted')

      form.reset()
      setSubmitState('success')
    } catch {
      setSubmitState('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ContactFormStyles data-part="form" onSubmit={handleSubmit}>
      <fieldset data-part="types">
        <legend>С чем помочь?</legend>
        <div data-part="typeOptions">
          {requestTypes.map((request) => (
            <label key={request.id} data-part="typeOption" data-selected={requestType === request.id}>
              <input
                type="radio"
                name="type"
                value={request.id}
                checked={requestType === request.id}
                onChange={() => {
                  setRequestType(request.id)
                  setSubmitState(null)
                }}
              />
              <span>{request.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div data-part="fieldGrid">
        <label data-part="label">
          Как к вам обращаться
          <input name="name" autoComplete="name" required maxLength={100} data-part="field" />
        </label>
        <label data-part="label">
          Email для ответа
          <input name="email" type="email" autoComplete="email" required maxLength={254} data-part="field" />
        </label>
      </div>

      {requestType === 'quote' ? (
        <label data-part="label">
          Компания <span data-part="optional">необязательно</span>
          <input name="company" autoComplete="organization" maxLength={160} data-part="field" />
        </label>
      ) : null}

      <label data-part="label">
        {requestType === 'demo'
          ? 'Продукт или сценарий'
          : requestType === 'quote'
            ? 'Продукт или направление'
            : 'Что хотите заказать'}
        <input name="item" defaultValue={item} maxLength={160} data-part="field" />
      </label>

      <label data-part="label">
        Коротко о задаче
        <textarea
          name="message"
          required
          minLength={3}
          maxLength={5000}
          rows={5}
          placeholder={getMessagePlaceholder(requestType)}
          data-part="field"
        />
      </label>

      <div data-part="honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <label data-part="consent">
        <input type="checkbox" name="consent" required />
        <span>
          Даю отдельное согласие на обработку персональных данных.{' '}
          <Link to="/personal-data">Текст согласия</Link>
        </span>
      </label>

      <div data-part="submitRow">
        <Button type="submit" size="lg" disabled={isSubmitting || !endpoint}>
          {isSubmitting ? 'Отправляем…' : endpoint ? 'Отправить заявку' : 'Email ещё не подключён'}
          {!isSubmitting && endpoint ? <ArrowUpRight aria-hidden="true" /> : null}
        </Button>
        <p data-part="formNote">
          Данные нужны, чтобы ответить на обращение и обсудить задачу.{' '}
          <Link to="/privacy">Политика конфиденциальности</Link>
        </p>
      </div>

      {!endpoint ? (
        <p data-part="status" role="note">
          Эта форма пока не отправляет данные. Для связи напишите в{' '}
          <a href={SITE_CONTACT_URL} target="_blank" rel="noreferrer noopener">Telegram</a>.
        </p>
      ) : null}
      {submitState === 'success' ? (
        <p data-part="status" role="status">Заявка принята. Спасибо — ответим по указанному email.</p>
      ) : null}
      {submitState === 'error' ? (
        <p data-part="status" role="alert">Не удалось отправить заявку. Попробуйте ещё раз или напишите в Telegram.</p>
      ) : null}
    </ContactFormStyles>
  )
}
