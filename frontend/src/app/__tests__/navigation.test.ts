import { beforeEach, describe, expect, it } from 'vitest'
import { restoreDeepLink } from '../navigation'

describe('restoreDeepLink', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
    window.sessionStorage.clear()
  })

  it('restores a clean URL from the GitHub Pages query fallback', () => {
    window.history.replaceState(null, '', '/?p=%2Fabout&from=pages')

    restoreDeepLink()

    expect(window.location.pathname).toBe('/about')
    expect(window.location.search).toBe('?from=pages')
  })

  it('prefers the stored path and removes it', () => {
    window.sessionStorage.setItem('onix-deep-link', '/catalog/object-01')

    restoreDeepLink()

    expect(window.location.pathname).toBe('/catalog/object-01')
    expect(window.sessionStorage.getItem('onix-deep-link')).toBeNull()
  })

  it('does nothing without a fallback path', () => {
    window.history.replaceState(null, '', '/about')

    restoreDeepLink()

    expect(window.location.pathname).toBe('/about')
  })
})
