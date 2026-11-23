import { DigitalPageStyles } from './DigitalPage.styles'
import { PageIntro } from '@/common'
import { digitalItems } from '@/features/digital'
import { ShowcaseListing } from '@/features/showcase'

export function DigitalPage() {
  return (
    <DigitalPageStyles data-part="page">
      <div data-part="content">
        <PageIntro
          eyebrow="СОБСТВЕННЫЕ OPEN-SOURCE СИСТЕМЫ"
          title="Цифровые продукты на открытой основе"
          description="Развиваем свои low-code системы и создаём на их базе цифровые продукты. Начинаем с процесса, проверяем логику прототипом и развиваем решение по мере использования."
        />
        <ShowcaseListing
          items={digitalItems}
          basePath="/digital"
          sectionLabel="Направления цифровых решений"
        />
      </div>
    </DigitalPageStyles>
  )
}
