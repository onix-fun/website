import { useCallback, useEffect, useState } from 'react'

export type ColorTheme = 'light' | 'dark'

const STORAGE_KEY = 'onix-theme'

function getInitialTheme(): ColorTheme {
  if (typeof window === 'undefined') return 'light'

  try {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY)
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  } catch {
    // Keep the current document theme when storage is unavailable.
  }

  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function useColorTheme() {
  const [theme, setTheme] = useState<ColorTheme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#1b1a18' : '#f5f5f5')

    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Theme still applies for this session when storage is unavailable.
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }, [])

  return { theme, toggleTheme }
}
