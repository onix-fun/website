import { Link } from 'react-router'
import { Button } from '@/common/ui/button'

export function NotFoundPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-3xl font-medium tracking-tight">Страница не найдена</h1>
      <Button render={<Link to="/" />}>На главную</Button>
    </main>
  )
}
