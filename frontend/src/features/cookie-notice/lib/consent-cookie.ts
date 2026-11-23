const COOKIE_NAME = 'onix-cookie-consent'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function hasAcceptedCookieNotice() {
  if (typeof document === 'undefined') return false
  return document.cookie.split(';').some((cookie) => cookie.trim() === `${COOKIE_NAME}=accepted`)
}

export function rememberCookieNoticeAcceptance() {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  const path = import.meta.env.BASE_URL || '/'
  document.cookie = `${COOKIE_NAME}=accepted; Max-Age=${COOKIE_MAX_AGE}; Path=${path}; SameSite=Lax${secure}`
}
