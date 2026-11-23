import { ShowcaseArtworkStyles } from './showcase-artwork.styles'
import type { ShowcaseItem } from '@onix/ui-kit'

export function ShowcaseArtwork({ item, large = false }: { item: ShowcaseItem; large?: boolean }) {
  const index = item.id.split('-').at(-1) ?? '01'

  return (
    <ShowcaseArtworkStyles
      data-part="artwork"
      data-size={large ? 'large' : undefined}
      data-kind={item.kind}
      aria-label={`Иллюстрация направления: ${item.title}`}
      role="img"
    >
      <div data-part="orbit" aria-hidden="true" />
      <div data-part="object" aria-hidden="true" />
      <span data-part="index" aria-hidden="true">ONIX / {index}</span>
      <span data-part="caption">Концепция направления</span>
    </ShowcaseArtworkStyles>
  )
}
