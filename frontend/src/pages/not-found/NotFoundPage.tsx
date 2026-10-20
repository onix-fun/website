import { Link } from 'react-router'
import { Page } from '@/common'
import { Button } from '@/common/ui/button'
import { AppHeader } from '@/features/header'

export function NotFoundPage() {
  return (
    <>
      <AppHeader />
      <Page centered title="Страница не найдена" titleSize="2xl">
        <p>404</p>
        <Button render={<Link to="/" />}>На главную</Button>
      </Page>
    </>
  )
}
