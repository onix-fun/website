import { useParams } from 'react-router'
import { Page } from '@/common'

export function DigitalProductPage() {
  const { id } = useParams()

  return (
    <Page title="Карточка продукта">
      <p>Продукт: {id}</p>
    </Page>
  )
}
