import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { Button } from '@/common/ui/button'

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
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
      {detail ? <p className="text-sm text-muted-foreground">{String(detail)}</p> : null}
      <Button render={<Link to="/" />}>На главную</Button>
    </main>
  )
}
