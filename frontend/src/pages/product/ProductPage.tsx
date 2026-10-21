import { useParams } from 'react-router'
import { Page, ShowcaseDetail } from '@/common'
import { catalogItems } from '@/features/catalog'
import styles from './ProductPage.module.scss'

export function ProductPage() {
  const { id } = useParams()
  const item = catalogItems.find((candidate) => candidate.id === id)

  return (
    <Page className={styles.page}>
      <ShowcaseDetail
        item={item}
        items={catalogItems}
        basePath="/catalog"
        sectionTitle="Каталог"
      />
    </Page>
  )
}
