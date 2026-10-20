import { Outlet } from 'react-router'
import { Stack } from '@/common'

export function RootLayout() {
  return (
    <Stack direction="column" style={{ minHeight: '100svh' }}>
      <Stack direction="column" style={{ flex: 1 }}>
        <Outlet />
      </Stack>
    </Stack>
  )
}
