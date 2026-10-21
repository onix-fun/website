import { ProductPageStyles } from './ProductPage.styles'
import { useParams } from 'react-router'
import { catalogItems } from '@/features/catalog'
import { ShowcaseDetail } from '@/features/showcase'

export function ProductPage() {
  const { id } = useParams()
  const item = catalogItems.find((candidate) => candidate.id === id)

  return (
    <ProductPageStyles data-part="page">
      <ShowcaseDetail
        item={item}
        items={catalogItems}
        basePath="/catalog"
        sectionTitle="Каталог"
      />
    </ProductPageStyles>
  )
}
