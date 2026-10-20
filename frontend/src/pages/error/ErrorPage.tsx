import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { Page } from '@/common'
import { Button } from '@/common/ui/button'
import { AppHeader } from '@/features/header'

export function ErrorPage() {
  const error = useRouteError()

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Что-то пошло не так'

  const detail =
    error instanceof Error
      ? error.message
      : isRouteErrorResponse(error)
        ? error.data
        : undefined

  return (
    <>
      <AppHeader />
      <Page centered title={title} titleSize="2xl">
        {detail ? <p>{String(detail)}</p> : null}
        <Button render={<Link to="/" />}>На главную</Button>
      </Page>
    </>
  )
}
