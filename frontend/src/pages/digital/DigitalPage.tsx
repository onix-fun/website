import { DigitalPageStyles } from './DigitalPage.styles'
import { PageIntro } from '@/common'
import { digitalItems } from '@/features/digital'
import { ShowcaseListing } from '@/features/showcase'

export function DigitalPage() {
  return (
    <DigitalPageStyles data-part="page">
      <div data-part="content">
        <PageIntro
          eyebrow="ЦИФРОВОЕ / ONIX"
          title="Форма в цифровом пространстве"
          description="Демонстрационная витрина цифровых продуктов. Состав, форматы и описание появятся в карточках."
        />
        <ShowcaseListing
          items={digitalItems}
          basePath="/digital"
          sectionLabel="Цифровые продукты"
        />
      </div>
    </DigitalPageStyles>
  )
}
