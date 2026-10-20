import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { Page } from '@/common'
import { Button } from '@/common/ui/button'

interface ErrorView {
  status?: number
  title: string
  detail?: string
}

function resolveError(error: unknown): ErrorView {
  if (error == null) {
    return { status: 404, title: 'Страница не найдена' }
  }
  if (isRouteErrorResponse(error)) {
    return {
      status: error.status,
      title: error.status === 404 ? 'Страница не найдена' : error.statusText,
      detail: typeof error.data === 'string' ? error.data : undefined,
    }
  }
  return {
    title: 'Что-то пошло не так',
    detail: error instanceof Error ? error.message : undefined,
  }
}

/**
 * Universal error surface: renders a 404 when used as the catch-all route and
 * any thrown route error when used as an `errorElement`.
 */
export function ErrorPage() {
  const error = useRouteError()
  const { status, title, detail } = resolveError(error)

  return (
    <Page centered title={title} titleSize="2xl">
      {status ? <p>{status}</p> : null}
      {detail ? <p>{detail}</p> : null}
      <Button render={<Link to="/" />}>На главную</Button>
    </Page>
  )
}
