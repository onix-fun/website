import { ContactForm } from '@/features/contact-form'

export function FormPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="mb-6 text-2xl font-medium tracking-tight">Форма</h1>
      <ContactForm />
    </main>
  )
}
