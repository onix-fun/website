import { Page } from '@/common'
import { ContactForm } from '@/features/contact-form'
import { AppHeader } from '@/features/header'

export function FormPage() {
  return (
    <>
      <AppHeader />
      <Page title="Форма">
        <ContactForm />
      </Page>
    </>
  )
}
