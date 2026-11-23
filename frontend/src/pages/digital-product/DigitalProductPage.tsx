import { useParams } from 'react-router'
import { useDocumentMeta } from '@onix/ui-kit'
import { digitalItems } from '@/features/digital'
import { ShowcaseDetail } from '@/features/showcase'
import { DigitalProductPageStyles } from './DigitalProductPage.styles'

export function DigitalProductPage() {
  const { id } = useParams()
  const item = digitalItems.find((candidate) => candidate.id === id)

  useDocumentMeta({
    title: item?.title ?? 'Материал не найден',
    description: item?.summary ?? 'Этого направления нет в текущей витрине ONIX.',
    path: `/digital/${id ?? ''}`,
    noindex: !item,
  })

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
