import { ShowcaseListing } from '@/common'
import { catalogItems } from './model/catalog-items'

export function Catalog() {
  return (
    <ShowcaseListing
      items={catalogItems}
      basePath="/catalog"
      sectionLabel="Каталог объектов и предметов"
    />
  )
}
