import { DigitalProductPageStyles } from './DigitalProductPage.styles'
import { useParams } from 'react-router'
import { digitalItems } from '@/features/digital'
import { ShowcaseDetail } from '@/features/showcase'

export function DigitalProductPage() {
  const { id } = useParams()
  const item = digitalItems.find((candidate) => candidate.id === id)

  return (
    <DigitalProductPageStyles data-part="page">
      <ShowcaseDetail
        item={item}
        items={digitalItems}
        basePath="/digital"
        sectionTitle="Цифровые продукты"
      />
    </DigitalProductPageStyles>
  )
}
