import { useParams } from 'react-router'
import { useDocumentMeta } from '@onix/ui-kit'
import { catalogItems } from '@/features/catalog'
import { ShowcaseDetail } from '@/features/showcase'
import { ProductPageStyles } from './ProductPage.styles'

export function ProductPage() {
  const { id } = useParams()
  const item = catalogItems.find((candidate) => candidate.id === id)

  useDocumentMeta({
    title: item?.title ?? 'Материал не найден',
    description: item?.summary ?? 'Этой позиции нет в текущей витрине ONIX.',
    path: `/catalog/${id ?? ''}`,
    noindex: !item,
  })

  return (
    <ProductPageStyles data-part="page">
      <ShowcaseDetail
        item={item}
        items={catalogItems}
        basePath="/catalog"
        sectionTitle="Прототипы и предметы"
      />
    </ProductPageStyles>
  )
}
