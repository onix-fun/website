import { AboutPageStyles } from './AboutPage.styles'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { ButtonLink, Card, CardContent, PageIntro } from '@/common'

const principles = [
  {
    number: '01',
    title: 'Разобраться в задаче',
    description: 'Начинаем с идеи, контекста и того, какую роль предмет должен выполнять.',
  },
  {
    number: '02',
    title: 'Продумать форму',
    description: 'Проектируем объект и проверяем его в цифровой модели.',
  },
  {
    number: '03',
    title: 'Проверить в материале',
    description: 'Используем прототипирование и 3D-печать, чтобы перейти от модели к предмету.',
  },
]

const process = ['Идея и задача', 'Форма и модель', 'Прототип', 'Готовый предмет']

export function AboutPage() {
  return (
    <AboutPageStyles data-part="page">
      <div data-part="content">
        <PageIntro
          eyebrow="СТУДИЯ ONIX"
          title="Идея становится предметом"
          description="Мы соединяем предметный дизайн, моделирование и 3D-печать — чтобы пройти путь от замысла до объекта."
        />

        <section data-part="section" aria-labelledby="approach-title">
          <div data-part="sectionHeading">
            <span data-part="sectionIndex">01 / ПОДХОД</span>
            <h2 id="approach-title">Сначала смысл. Затем форма.</h2>
          </div>
          <div data-part="principles">
            {principles.map((principle) => (
              <Card key={principle.number} data-part="principle">
                <CardContent data-part="principleContent">
                  <span data-part="number">{principle.number}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section data-part="process" aria-labelledby="process-title">
          <div data-part="processIntro">
            <span data-part="sectionIndex">02 / ПРОЦЕСС</span>
            <h2 id="process-title">От первого разговора до результата</h2>
            <p>Этапы и состав работ подбираются под задачу конкретного проекта.</p>
          </div>
          <ol data-part="steps">
            {process.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <Card data-part="callout">
          <CardContent data-part="calloutContent">
            <div>
              <span data-part="sectionIndex">ЕСТЬ ИДЕЯ?</span>
              <h2>Давайте найдём ей форму</h2>
            </div>
            <ButtonLink render={<Link to="/services" />} size="lg">
              Услуги студии <ArrowUpRight aria-hidden="true" />
            </ButtonLink>
          </CardContent>
        </Card>
      </div>
    </AboutPageStyles>
  )
}
