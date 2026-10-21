import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from './badge'
import { Card, CardContent } from './card'
import { ShowcaseArtwork } from './showcase-artwork'
import type { ShowcaseItem } from './showcase-types'
import styles from './showcase-card.module.scss'

export function ShowcaseCard({
  item,
  href,
  index,
}: {
  item: ShowcaseItem
  href: string
  index: number
}) {
  return (
    <Link className={styles.link} to={href} aria-label={`${item.title}. ${item.summary}`}>
      <Card className={styles.card} data-testid={`showcase-card-${item.id}`}>
        <ShowcaseArtwork item={item} />
        <CardContent className={styles.content}>
          <div className={styles.meta}>
            <Badge variant="outline">{item.category}</Badge>
            <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
          </div>
          <div className={styles.copy}>
            <h2 className={styles.title}>{item.title}</h2>
            <p className={styles.description}>{item.summary}</p>
          </div>
          <ArrowUpRight className={styles.arrow} aria-hidden="true" />
        </CardContent>
      </Card>
    </Link>
  )
}
