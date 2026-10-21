import { Badge } from './badge'
import styles from './page-intro.module.scss'

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
    <header className={styles.intro}>
      <div className={styles.heading}>
        <Badge variant="outline">{eyebrow}</Badge>
        <h1>{title}</h1>
      </div>
      <p>{description}</p>
    </header>
  )
}
