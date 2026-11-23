import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/common/ui/button'
import { CookieNoticeStyles } from './CookieNotice.styles'
import { hasAcceptedCookieNotice, rememberCookieNoticeAcceptance } from './lib/consent-cookie'

export function CookieNotice() {
  const [isVisible, setIsVisible] = useState(() => !hasAcceptedCookieNotice())

  if (!isVisible) return null

  function handleAccept() {
    rememberCookieNoticeAcceptance()
    setIsVisible(false)
  }

  return (
    <CookieNoticeStyles data-part="notice" role="region" aria-label="Информация о cookie">
      <div data-part="panel">
        <p>
          Сайт использует технический cookie, чтобы запомнить ваш выбор. Аналитические и рекламные счётчики не подключены.{' '}
          <Link to="/cookies">Политика cookie</Link>
        </p>
        <Button type="button" size="lg" onClick={handleAccept} data-part="accept">
          Принять
        </Button>
      </div>
    </CookieNoticeStyles>
  )
}
