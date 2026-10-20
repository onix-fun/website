import { Page } from '@/common'
import { AppHeader } from '@/features/header'

export function TestPage() {
  return (
    <>
      <AppHeader />
      <Page title="Тестовая страница">
        <p>Страница в разработке.</p>
      </Page>
    </>
  )
}
