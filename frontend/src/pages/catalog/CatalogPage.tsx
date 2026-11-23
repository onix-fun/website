import { CatalogPageStyles } from './CatalogPage.styles'
import { PageIntro } from '@/common'
import { catalogItems } from '@/features/catalog'
import { ShowcaseListing } from '@/features/showcase'

export function CatalogPage() {
  return (
    <CatalogPageStyles data-part="page">
      <div data-part="content">
        <PageIntro
          eyebrow="ПРОТОТИПЫ · СВЕТИЛЬНИКИ · МЕРЧ"
          title="От цифровой модели к предмету"
          description="Создаём физические макеты для проверки формы и компоновки, а в собственном мерче развиваем светильники с плафонами, напечатанными на 3D-принтере."
        />
        <ShowcaseListing
          items={catalogItems}
          basePath="/catalog"
          sectionLabel="Прототипы, светильники и мерч"
        />
      </div>
    </CatalogPageStyles>
  )
}
