import { Catalog } from '@/features/catalog'

export function CatalogPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="mb-6 text-2xl font-medium tracking-tight">Каталог</h1>
      <Catalog />
    </main>
  )
}
