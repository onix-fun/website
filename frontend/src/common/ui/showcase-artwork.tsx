import { cn } from '@/common/lib/utils'
import type { ShowcaseItem } from './showcase-types'
import styles from './showcase-artwork.module.scss'

export function ShowcaseArtwork({ item, large = false }: { item: ShowcaseItem; large?: boolean }) {
  const index = item.id.split('-').at(-1) ?? '01'

  return (
    <div
      className={cn(styles.artwork, large && styles.large)}
      data-kind={item.kind}
      aria-label={`Демонстрационная графика: ${item.title}`}
      role="img"
    >
      <div className={styles.orbit} aria-hidden="true" />
      <div className={styles.object} aria-hidden="true" />
      <span className={styles.index} aria-hidden="true">ONIX / {index}</span>
      <span className={styles.caption}>Визуал добавится позже</span>
    </div>
  )
}
