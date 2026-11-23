const DEEP_LINK_PARAM = 'p'
const DEEP_LINK_STORAGE_KEY = 'onix-deep-link'

/**
 * GitHub Pages serves `404.html` for unknown paths. That static page stores the
 * requested route and returns to the SPA root; this function restores the
 * clean URL before the router is created so deep links work with a 200 status
 * and keep the configured `basename`.
 */
export function restoreDeepLink(): void {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  let deepLink = params.get(DEEP_LINK_PARAM)

  try {
    deepLink = window.sessionStorage.getItem(DEEP_LINK_STORAGE_KEY) ?? deepLink
    window.sessionStorage.removeItem(DEEP_LINK_STORAGE_KEY)
  } catch {
    // Storage can be disabled; the query parameter is enough.
  }

  if (!deepLink) return

  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  let target = deepLink.startsWith('/') ? deepLink : `/${deepLink}`

  if (base && target === base) target = '/'
  else if (base && target.startsWith(`${base}/`)) target = target.slice(base.length) || '/'

  params.delete(DEEP_LINK_PARAM)
  const query = params.toString()
  const prefix = import.meta.env.BASE_URL.replace(/\/$/, '')
  const path = target === '/' ? '/' : target
  const href = `${prefix}${path}${query ? `?${query}` : ''}`

  window.history.replaceState(window.history.state, '', href)
}
