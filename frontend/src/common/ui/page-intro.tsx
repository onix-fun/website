import { PageIntroStyles } from './page-intro.styles'
import { Badge } from './badge'

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <PageIntroStyles data-part="intro">
      <div data-part="heading">
        <Badge variant="outline">{eyebrow}</Badge>
        <h1>{title}</h1>
      </div>
      <p>{description}</p>
    </PageIntroStyles>
  )
}
