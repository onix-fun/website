import { Counter } from '@/features/counter'

export function HomePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-4xl font-medium tracking-tight">Vitasil</h1>
      <Counter />
    </main>
  )
}
