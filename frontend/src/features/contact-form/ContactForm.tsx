import { useState, type FormEvent } from 'react'
import { Button } from '@/common/ui/button'

const fieldClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function ContactForm() {
  const [submitted, setSubmitted] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSubmitted(String(data.get('name') ?? ''))
  }

  return (
    <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Имя
        <input name="name" required className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Почта
        <input name="email" type="email" required className={fieldClass} />
      </label>
      <Button type="submit">Отправить</Button>
      {submitted ? (
        <p className="text-sm text-muted-foreground">Спасибо, {submitted}!</p>
      ) : null}
    </form>
  )
}
