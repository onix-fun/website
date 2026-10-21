import { ShowcaseDetailStyles } from './showcase-detail.styles'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Badge,
  ButtonLink,
  Separator,
  SITE_CONTACT_URL,
} from '@/common'
import { ShowcaseArtwork } from './showcase-artwork'
import { ShowcaseCard } from './showcase-card'
import type { ShowcaseItem } from '@/common'

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
      <ShowcaseDetailStyles as="section" data-part="missing" role="status" data-testid="showcase-not-found">
        <Badge variant="outline">Демо-карточка</Badge>
        <h1>Пока такой страницы нет</h1>
        <p>Этот элемент не входит в демонстрационный каталог.</p>
        <ButtonLink render={<Link to={basePath} />} variant="outline">
          Вернуться: {sectionTitle.toLocaleLowerCase('ru')}
        </ButtonLink>
      </ShowcaseDetailStyles>
    )
  }

  const relatedItems = items.filter((candidate) => candidate.id !== item.id).slice(0, 2)

  return (
    <ShowcaseDetailStyles data-part="detail">
      <Breadcrumb data-part="breadcrumb">
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

      <section data-part="hero" aria-labelledby="showcase-title">
        <ShowcaseArtwork item={item} large />
        <div data-part="copy">
          <Badge variant="outline">{item.category}</Badge>
          <span data-part="eyebrow">ONIX / {item.kind === 'digital' ? 'DIGITAL' : 'OBJECT'}</span>
          <h1 id="showcase-title">{item.title}</h1>
          <p data-part="summary">{item.summary}</p>
          <ButtonLink
            render={<a href={SITE_CONTACT_URL} target="_blank" rel="noreferrer noopener" />}
            size="lg"
            data-part="contactButton"
          >
            Обсудить проект <ArrowUpRight aria-hidden="true" />
          </ButtonLink>
          <ButtonLink render={<Link to={basePath} />} variant="link" data-part="backButton">
            К разделу «{sectionTitle}»
          </ButtonLink>
        </div>
      </section>

      <section data-part="information" aria-labelledby="showcase-description-title">
        <div data-part="description">
          <span data-part="sectionIndex">01 / ОПИСАНИЕ</span>
          <h2 id="showcase-description-title">Детали объекта</h2>
          <p>{item.description}</p>
        </div>
        <Separator orientation="vertical" data-part="verticalSeparator" />
        <div data-part="facts">
          <span data-part="sectionIndex">02 / ИНФОРМАЦИЯ</span>
          <h2>Характеристики</h2>
          <dl>
            {item.facts.map((fact) => (
              <div key={fact.label} data-part="fact">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {relatedItems.length > 0 ? (
        <section data-part="related" aria-labelledby="related-title">
          <div data-part="relatedHeading">
            <span data-part="sectionIndex">03 / ЕЩЁ В РАЗДЕЛЕ</span>
            <h2 id="related-title">Другие карточки</h2>
          </div>
          <div data-part="relatedGrid">
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
    </ShowcaseDetailStyles>
  )
}
