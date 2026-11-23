import { AboutPageStyles } from './AboutPage.styles'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { ButtonLink, Card, CardContent, PageIntro, useDocumentMeta } from '@onix/ui-kit'

const introDescription =
  'Разрабатываем цифровые продукты и физические прототипы. Разбираемся в задаче, проектируем решение и проверяем его на практике'

const principles = [
  {
    step: '01. Разобраться',
    title: 'Сначала задача',
    description: 'Изучаем задачу, сценарий и контекст, чтобы предложить решение под конкретную ситуацию.',
  },
  {
    step: '02. Спроектировать',
    title: 'Затем решение',
    description: 'Проектируем цифровой продукт или физическую форму и выбираем подходящие технологии.',
  },
  {
    step: '03. Проверить',
    title: 'Проверяем в деле',
    description: 'Смотрим, как решение работает в интерфейсе, программном или физическом прототипе.',
  },
]

const stages = [
  { number: '01', title: 'Идея', description: 'Фиксируем замысел и то, что нужно проверить.' },
  { number: '02', title: 'Задача', description: 'Определяем пользователя, процесс и ожидаемый результат.' },
  { number: '03', title: 'Прототип', description: 'Собираем рабочую версию или физический макет.' },
  { number: '04', title: 'Проверка', description: 'Оцениваем решение и уточняем следующие шаги.' },
]

export function AboutPage() {
  useDocumentMeta({
    title: 'О нас',
    description: introDescription,
    path: '/about',
  })

  return (
    <AboutPageStyles data-part="page">
      <div data-part="content">
        <PageIntro
          eyebrow="СТУДИЯ ONIX"
          title="От идеи к работающему решению"
          description={introDescription}
        />

        <section data-part="section" aria-labelledby="approach-title">
          <div data-part="sectionHeading">
            <span data-part="sectionIndex">01 / ПОДХОД</span>
            <h2 id="approach-title">Сначала задача. Затем технология.</h2>
          </div>
          <div data-part="principles">
            {principles.map((principle) => (
              <Card key={principle.step} data-part="principle">
                <CardContent data-part="principleContent">
                  <span data-part="number">{principle.step}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section data-part="process" aria-labelledby="process-title">
          <div data-part="processIntro">
            <span data-part="sectionIndex">02 / ПУТЬ</span>
            <h2 id="process-title">От замысла до проверки</h2>
            <p>Короткая последовательность, которая помогает не потерять задачу за деталями решения.</p>
          </div>
          <ol data-part="steps">
            {stages.map((stage) => (
              <li key={stage.number}>
                <span>{stage.number}</span>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <Card data-part="callout">
          <CardContent data-part="calloutContent">
            <div>
              <span data-part="sectionIndex">ЕСТЬ ИДЕЯ?</span>
              <h2>Есть идея, которую стоит проверить?</h2>
            </div>
            <ButtonLink render={<Link to="/form" />} size="lg">
              Обсудить задачу <ArrowUpRight aria-hidden="true" />
            </ButtonLink>
          </CardContent>
        </Card>
      </div>
    </AboutPageStyles>
  )
}
