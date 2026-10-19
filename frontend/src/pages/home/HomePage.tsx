import { Counter } from '@/features/counter'

export function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-medium tracking-tight">Vitasil</h1>
      <p className="text-muted-foreground">React Router + code-split pages</p>
      <Counter />
    </main>
  )
}
