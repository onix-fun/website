import { CatalogPageStyles } from './CatalogPage.styles'
import { PageIntro, useDocumentMeta } from '@onix/ui-kit'
import { catalogItems } from '@/features/catalog'
import { ShowcaseListing } from '@/features/showcase'

const introDescription =
  'Создаём физические макеты для проверки конструкции, размеров и эргономики. Развиваем собственные светильники с деталями, изготовленными на 3D-принтере'

export function CatalogPage() {
  useDocumentMeta({
    title: 'Прототипы и предметы',
    description: introDescription,
    path: '/catalog',
  })

  return (
    <CatalogPageStyles data-part="page">
      <div data-part="content">
        <PageIntro
          eyebrow="ПРОТОТИПЫ И ПРЕДМЕТЫ"
          title="Идеи, которые обретают форму"
          description={introDescription}
        />
        <ShowcaseListing
          items={catalogItems}
          basePath="/catalog"
          sectionLabel="Прототипы и предметы"
          countLabel="Предметы и прототипы"
        />
      </div>
    </CatalogPageStyles>
  )
}
