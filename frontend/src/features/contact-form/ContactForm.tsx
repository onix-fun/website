import { useState, type FormEvent } from 'react'
import { Button } from '@/common/ui/button'
import styles from './ContactForm.module.scss'

export function ContactForm() {
  const [submitted, setSubmitted] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSubmitted(String(data.get('name') ?? ''))
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Имя
        <input name="name" required className={styles.field} />
      </label>
      <label className={styles.label}>
        Почта
        <input name="email" type="email" required className={styles.field} />
      </label>
      <Button type="submit">Отправить</Button>
      {submitted ? <p className={styles.note}>Спасибо, {submitted}!</p> : null}
    </form>
  )
}
