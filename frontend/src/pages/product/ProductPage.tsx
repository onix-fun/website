import { useParams } from 'react-router'
import { Page } from '@/common'
import { AppHeader } from '@/features/header'

export function ProductPage() {
  const { id } = useParams()

  return (
    <>
      <AppHeader />
      <Page title="Карточка товара">
        <p>Товар: {id}</p>
      </Page>
    </>
  )
}
