import { useParams } from 'react-router'
import { Page, ShowcaseDetail } from '@/common'
import { digitalItems } from '@/features/digital'
import styles from './DigitalProductPage.module.scss'

export function DigitalProductPage() {
  const { id } = useParams()
  const item = digitalItems.find((candidate) => candidate.id === id)

  return (
    <Page className={styles.page}>
      <ShowcaseDetail
        item={item}
        items={digitalItems}
        basePath="/digital"
        sectionTitle="Цифровые продукты"
      />
    </Page>
  )
}
