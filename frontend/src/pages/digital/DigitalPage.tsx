import { Page, PageIntro } from '@/common'
import { DigitalListing } from '@/features/digital'
import styles from './DigitalPage.module.scss'

export function DigitalPage() {
  return (
    <Page className={styles.page}>
      <div className={styles.content}>
        <PageIntro
          eyebrow="ЦИФРОВОЕ / ONIX"
          title="Форма в цифровом пространстве"
          description="Демонстрационная витрина цифровых продуктов. Состав, форматы и описание появятся в карточках."
        />
        <DigitalListing />
      </div>
    </Page>
  )
}
