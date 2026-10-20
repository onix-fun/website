import { Outlet } from 'react-router'
import { Stack } from '@/common'
import { AppHeader } from '@/features/header'

export function RootLayout() {
  return (
    <Stack direction="column" style={{ minHeight: '100svh' }}>
      <AppHeader />
      <Stack direction="column" style={{ flex: 1 }}>
        <Outlet />
      </Stack>
    </Stack>
  )
}
