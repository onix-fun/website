import { ShowcaseCardStyles } from './showcase-card.styles'
import { ArrowUpRight } from 'lucide-react'
import { Badge, Card, CardContent } from '@/common'
import { ShowcaseArtwork } from './showcase-artwork'
import type { ShowcaseItem } from '@/common'

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
    <ShowcaseCardStyles data-part="link" to={href} aria-label={`${item.title}. ${item.summary}`}>
      <Card data-part="card" data-testid={`showcase-card-${item.id}`}>
        <ShowcaseArtwork item={item} />
        <CardContent data-part="content">
          <div data-part="meta">
            <Badge variant="outline">{item.category}</Badge>
            <span data-part="number">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <div data-part="copy">
            <h2 data-part="title">{item.title}</h2>
            <p data-part="description">{item.summary}</p>
          </div>
          <ArrowUpRight data-part="arrow" aria-hidden="true" />
        </CardContent>
      </Card>
    </ShowcaseCardStyles>
  )
}
