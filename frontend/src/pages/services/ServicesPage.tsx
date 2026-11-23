import { ServicesPageStyles } from './ServicesPage.styles'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { ButtonLink, Card, CardContent, PageIntro, useDocumentMeta } from '@onix/ui-kit'

const introDescription =
  'Проектируем цифровые сервисы, создаём инструменты для рабочих процессов и проверяем идеи с помощью программных и физических прототипов'

const services = [
  {
    title: 'Цифровые продукты',
    description: 'Проектируем цифровые сервисы и инструменты под конкретные задачи и пользовательские сценарии.',
    to: '/digital',
  },
  {
    title: 'Low-code системы',
    description: 'Развиваем открытые программные платформы и собираем на их основе прикладные решения.',
    to: '/digital',
  },
  {
    title: 'Прототипирование',
    description: 'Проверяем идеи с помощью программных и физических прототипов до следующего этапа разработки.',
    to: '/catalog',
  },
  {
    title: 'Светильники ONIX',
    description: 'Создаём светильники с деталями, изготовленными на 3D-принтере.',
    to: '/catalog',
  },
]

const process = [
  { step: '01. Задача', description: 'Разбираемся в задаче, сценарии и ожидаемом результате.' },
  { step: '02. Проектирование', description: 'Определяем структуру, логику и форму будущего решения.' },
  { step: '03. Прототип', description: 'Собираем программный или физический прототип для проверки.' },
  { step: '04. Развитие', description: 'Уточняем решение по итогам проверки и дальнейшего использования.' },
]

export function ServicesPage() {
  useDocumentMeta({
    title: 'Услуги',
    description: introDescription,
    path: '/services',
  })

  return (
    <ServicesPageStyles data-part="page">
      <div data-part="content">
        <PageIntro
          eyebrow="ЧЕМ МЫ ЗАНИМАЕМСЯ"
          title="Разработка и прототипирование"
          description={introDescription}
        />

        <section data-part="section" aria-labelledby="services-title">
          <div data-part="sectionHeading">
            <span data-part="sectionIndex">01 / НАПРАВЛЕНИЯ</span>
            <h2 id="services-title">Чем мы занимаемся</h2>
          </div>
          <ol data-part="services" aria-label="Направления работы">
            {services.map((service, index) => (
              <li key={service.title}>
                <Card data-part="service">
                  <CardContent data-part="serviceContent">
                    <span data-part="number">{String(index + 1).padStart(2, '0')}</span>
                    <h3 data-part="title">{service.title}</h3>
                    <p data-part="description">{service.description}</p>
                    <Link data-part="serviceLink" to={service.to}>
                      Подробнее <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        <section data-part="process" aria-labelledby="service-process-title">
          <div data-part="sectionHeading">
            <span data-part="sectionIndex">02 / ПОДХОД</span>
            <h2 id="service-process-title">Как мы подходим к работе</h2>
          </div>
          <ol data-part="processList">
            {process.map((step) => (
              <li key={step.step}>
                <span data-part="number">{step.step}</span>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <Card data-part="callout">
          <CardContent data-part="calloutContent">
            <div>
              <span data-part="sectionIndex">ДАВАЙТЕ ОБСУДИМ</span>
              <h2>Обсудим вашу задачу</h2>
            </div>
            <ButtonLink render={<Link to="/form" />} size="lg">
              Обсудить задачу <ArrowUpRight aria-hidden="true" />
            </ButtonLink>
          </CardContent>
        </Card>
      </div>
    </ServicesPageStyles>
  )
}
