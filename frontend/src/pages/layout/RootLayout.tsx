import { Outlet, useLocation } from 'react-router'
import { Stack } from '@/common'
import { AppHeader } from '@/features/header'
import { Footer } from '@/features/footer'

export function RootLayout() {
  const { pathname } = useLocation()
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
  const routePath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || '/'
    : pathname
  const isHomePage = routePath === '/'

  return (
    <Stack direction="column" style={{ minHeight: '100svh' }}>
      <AppHeader />
      <Stack direction="column" style={{ flex: 1 }}>
        <Outlet />
      </Stack>
      {!isHomePage && <Footer />}
    </Stack>
  )
}
