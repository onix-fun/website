import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { ButtonLink, useDocumentMeta } from '@onix/ui-kit'
import { ErrorPageStyles } from './ErrorPage.styles'

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

  useDocumentMeta({
    title,
    description: 'Страница недоступна или была перемещена.',
    path: '/404',
    noindex: true,
  })

  return (
    <ErrorPageStyles data-part="error" centered title={title} titleSize="2xl">
      <div data-part="card">
        <span data-part="code">{status ? `ОШИБКА ${status}` : 'ОШИБКА'}</span>
        <p data-part="lead">
          {detail ?? 'Такой страницы нет или она была перемещена. Вернитесь на главную или расскажите о задаче через форму.'}
        </p>
        <div data-part="actions">
          <ButtonLink render={<Link to="/" />}>На главную</ButtonLink>
          <ButtonLink render={<Link to="/form" />} variant="outline">Обсудить задачу</ButtonLink>
        </div>
      </div>
    </ErrorPageStyles>
  )
}
