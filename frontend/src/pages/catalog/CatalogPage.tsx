import { Page, PageIntro } from '@/common'
import { Catalog } from '@/features/catalog'
import styles from './CatalogPage.module.scss'

export function CatalogPage() {
  return (
    <Page className={styles.page}>
      <div className={styles.content}>
        <PageIntro
          eyebrow="ПРЕДМЕТЫ · МЕРЧ · ПРОТОТИПЫ"
          title="Объекты, созданные слой за слоем"
          description="Демонстрационный каталог студии. Карточки и категории показывают структуру будущего раздела."
        />
        <Catalog />
      </div>
    </Page>
  )
}
