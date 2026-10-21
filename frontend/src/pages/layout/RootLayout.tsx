import { Outlet, useLocation } from 'react-router'
import { Stack } from '@/common'
import { AppHeader } from '@/features/header'
import { Footer } from '@/features/footer'

export function RootLayout() {
  const isHomePage = useLocation().pathname === '/'

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
