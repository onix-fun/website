import { DigitalPageStyles } from './DigitalPage.styles'
import { PageIntro, useDocumentMeta } from '@onix/ui-kit'
import { digitalItems } from '@/features/digital'
import { ShowcaseListing } from '@/features/showcase'

const introDescription =
  'Развиваем открытые программные платформы и создаём цифровые инструменты вокруг конкретных процессов, данных и пользовательских сценариев'

export function DigitalPage() {
  useDocumentMeta({
    title: 'Цифровые решения',
    description: introDescription,
    path: '/digital',
  })

  return (
    <DigitalPageStyles data-part="page">
      <div data-part="content">
        <PageIntro
          eyebrow="ЦИФРОВЫЕ РЕШЕНИЯ"
          title="Системы под реальные задачи"
          description={introDescription}
        />
        <ShowcaseListing
          items={digitalItems}
          basePath="/digital"
          sectionLabel="Направления цифровых решений"
          countLabel="Направления работы"
        />
      </div>
    </DigitalPageStyles>
  )
}
