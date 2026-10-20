import { useParams } from 'react-router'
import { Page } from '@/common'
import { AppHeader } from '@/features/header'

export function DigitalProductPage() {
  const { id } = useParams()

  return (
    <>
      <AppHeader />
      <Page title="Карточка продукта">
        <p>Продукт: {id}</p>
      </Page>
    </>
  )
}
