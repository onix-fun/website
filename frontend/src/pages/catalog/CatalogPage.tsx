import { CatalogPageStyles } from './CatalogPage.styles'
import { PageIntro } from '@/common'
import { catalogItems } from '@/features/catalog'
import { ShowcaseListing } from '@/features/showcase'

export function CatalogPage() {
  return (
    <CatalogPageStyles data-part="page">
      <div data-part="content">
        <PageIntro
          eyebrow="ПРЕДМЕТЫ · МЕРЧ · ПРОТОТИПЫ"
          title="Объекты, созданные слой за слоем"
          description="Демонстрационный каталог студии. Карточки и категории показывают структуру будущего раздела."
        />
        <ShowcaseListing
          items={catalogItems}
          basePath="/catalog"
          sectionLabel="Каталог объектов и предметов"
        />
      </div>
    </CatalogPageStyles>
  )
}
