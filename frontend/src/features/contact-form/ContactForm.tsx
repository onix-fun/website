import { ContactFormStyles } from './ContactForm.styles'
import { useState, type FormEvent } from 'react'
import { Button } from '@/common/ui/button'

export function ContactForm() {
  const [submitted, setSubmitted] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSubmitted(String(data.get('name') ?? ''))
  }

  return (
    <ContactFormStyles data-part="form" onSubmit={handleSubmit}>
      <label data-part="label">
        Имя
        <input name="name" required data-part="field" />
      </label>
      <label data-part="label">
        Почта
        <input name="email" type="email" required data-part="field" />
      </label>
      <Button type="submit">Отправить</Button>
      {submitted ? <p data-part="note">Спасибо, {submitted}!</p> : null}
    </ContactFormStyles>
  )
}
