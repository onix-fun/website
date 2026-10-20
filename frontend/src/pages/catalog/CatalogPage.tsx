import { Page } from '@/common'
import { Catalog } from '@/features/catalog'
import { AppHeader } from '@/features/header'

export function CatalogPage() {
  return (
    <>
      <AppHeader />
      <Page title="Каталог">
        <Catalog />
      </Page>
    </>
  )
}
