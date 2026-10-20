import { Page } from '@/common'
import { Counter } from '@/features/counter'
import { AppHeader } from '@/features/header'

export function HomePage() {
  return (
    <>
      <AppHeader />
      <Page centered title="Vitasil" titleSize="xl">
        <p>React Router + code-split pages</p>
        <Counter />
      </Page>
    </>
  )
}
