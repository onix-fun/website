import { Outlet } from 'react-router'
import { Nav } from '@/app/Nav'

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Nav />
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  )
}
