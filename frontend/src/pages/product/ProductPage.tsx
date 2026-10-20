import { useParams } from 'react-router'
import { Page } from '@/common'

export function ProductPage() {
  const { id } = useParams()

  return (
    <Page title="Карточка товара">
      <p>Товар: {id}</p>
    </Page>
  )
}
