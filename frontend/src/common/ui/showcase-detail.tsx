import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from './badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb'
import { ButtonLink } from './button'
import { Separator } from './separator'
import { ShowcaseArtwork } from './showcase-artwork'
import { ShowcaseCard } from './showcase-card'
import type { ShowcaseItem } from './showcase-types'
import { SITE_CONTACT_URL } from '../lib/site'
import styles from './showcase-detail.module.scss'

export function ShowcaseDetail({
  item,
  items,
  basePath,
  sectionTitle,
}: {
  item: ShowcaseItem | undefined
  items: readonly ShowcaseItem[]
  basePath: string
  sectionTitle: string
}) {
  if (!item) {
    return (
      <section className={styles.missing} role="status" data-testid="showcase-not-found">
        <Badge variant="outline">Демо-карточка</Badge>
        <h1>Пока такой страницы нет</h1>
        <p>Этот элемент не входит в демонстрационный каталог.</p>
        <ButtonLink render={<Link to={basePath} />} variant="outline">
          Вернуться: {sectionTitle.toLocaleLowerCase('ru')}
        </ButtonLink>
      </section>
    )
  }

  const relatedItems = items.filter((candidate) => candidate.id !== item.id).slice(0, 2)

  return (
    <div className={styles.detail}>
      <Breadcrumb className={styles.breadcrumb}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to={basePath} />}>{sectionTitle}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{item.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className={styles.hero} aria-labelledby="showcase-title">
        <ShowcaseArtwork item={item} large />
        <div className={styles.copy}>
          <Badge variant="outline">{item.category}</Badge>
          <span className={styles.eyebrow}>ONIX / {item.kind === 'digital' ? 'DIGITAL' : 'OBJECT'}</span>
          <h1 id="showcase-title">{item.title}</h1>
          <p className={styles.summary}>{item.summary}</p>
          <ButtonLink
            render={<a href={SITE_CONTACT_URL} target="_blank" rel="noreferrer noopener" />}
            size="lg"
            className={styles.contactButton}
          >
            Обсудить проект <ArrowUpRight aria-hidden="true" />
          </ButtonLink>
          <ButtonLink render={<Link to={basePath} />} variant="link" className={styles.backButton}>
            К разделу «{sectionTitle}»
          </ButtonLink>
        </div>
      </section>

      <section className={styles.information} aria-labelledby="showcase-description-title">
        <div className={styles.description}>
          <span className={styles.sectionIndex}>01 / ОПИСАНИЕ</span>
          <h2 id="showcase-description-title">Детали объекта</h2>
          <p>{item.description}</p>
        </div>
        <Separator orientation="vertical" className={styles.verticalSeparator} />
        <div className={styles.facts}>
          <span className={styles.sectionIndex}>02 / ИНФОРМАЦИЯ</span>
          <h2>Характеристики</h2>
          <dl>
            {item.facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {relatedItems.length > 0 ? (
        <section className={styles.related} aria-labelledby="related-title">
          <div className={styles.relatedHeading}>
            <span className={styles.sectionIndex}>03 / ЕЩЁ В РАЗДЕЛЕ</span>
            <h2 id="related-title">Другие карточки</h2>
          </div>
          <div className={styles.relatedGrid}>
            {relatedItems.map((related, index) => (
              <ShowcaseCard
                key={related.id}
                item={related}
                href={`${basePath}/${related.id}`}
                index={index}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
