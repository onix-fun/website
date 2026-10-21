import { Outlet, useLocation } from 'react-router'
import { AppHeader } from '@/features/header'
import { Footer } from '@/features/footer'
import { RootFrame, RouteFrame } from './RootLayout.styles'

export function RootLayout() {
  const { pathname } = useLocation()
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
  const routePath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || '/'
    : pathname
  const isHomePage = routePath === '/'

  return (
    <RootFrame>
      <AppHeader />
      <RouteFrame>
        <Outlet />
      </RouteFrame>
      {!isHomePage && <Footer />}
    </RootFrame>
  )
}
