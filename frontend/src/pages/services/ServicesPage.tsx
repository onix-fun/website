import { ServicesPageStyles } from './ServicesPage.styles'
import { ArrowUpRight } from 'lucide-react'
import { ButtonLink, Card, CardContent, PageIntro, SITE_CONTACT_URL } from '@/common'

const services = [
  {
    title: 'Предметный дизайн',
    description:
      'Разрабатываем форму и конструкцию предмета — от первых эскизов до готовой цифровой модели.',
  },
  {
    title: '3D-моделирование',
    description:
      'Создаём точные модели объектов и подготавливаем их к визуализации и производству.',
  },
  {
    title: '3D-печать и прототипы',
    description:
      'Проверяем идеи в материале и изготавливаем прототипы и готовые предметы на 3D-принтере.',
  },
  {
    title: 'Мерч и малые серии',
    description:
      'Превращаем идею и фирменный стиль в предметы и небольшие серии авторского мерча.',
  },
]

const process = [
  { title: 'Задача', description: 'Уточняем идею, назначение объекта и рамки проекта.' },
  { title: 'Проектирование', description: 'Продумываем форму и готовим цифровую модель.' },
  { title: 'Прототип', description: 'Проверяем решение в материале и уточняем детали.' },
  { title: 'Результат', description: 'Подготавливаем предмет или небольшую серию.' },
]

export function ServicesPage() {
  return (
    <ServicesPageStyles data-part="page">
      <div data-part="content">
        <PageIntro
          eyebrow="ОТ ИДЕИ ДО ПРЕДМЕТА"
          title="Проектируем и создаём"
          description="Помогаем пройти путь от идеи до физического предмета: проектируем, моделируем и создаём с помощью 3D-печати."
        />

        <section data-part="section" aria-labelledby="services-title">
          <div data-part="sectionHeading">
            <span data-part="sectionIndex">01 / ЧТО МЫ ДЕЛАЕМ</span>
            <h2 id="services-title">Услуги студии</h2>
          </div>
          <ol data-part="services" aria-label="Услуги студии">
            {services.map((service, index) => (
              <li key={service.title}>
                <Card data-part="service">
                  <CardContent data-part="serviceContent">
                    <span data-part="number">{String(index + 1).padStart(2, '0')}</span>
                    <h3 data-part="title">{service.title}</h3>
                    <p data-part="description">{service.description}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        <section data-part="process" aria-labelledby="service-process-title">
          <div data-part="sectionHeading">
            <span data-part="sectionIndex">02 / КАК МЫ РАБОТАЕМ</span>
            <h2 id="service-process-title">Четыре шага к результату</h2>
          </div>
          <ol data-part="processList">
            {process.map((step, index) => (
              <li key={step.title}>
                <span data-part="number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <Card data-part="callout">
          <CardContent data-part="calloutContent">
            <div>
              <span data-part="sectionIndex">ОБСУДИМ ВАШУ ЗАДАЧУ</span>
              <h2>Расскажите, что хотите создать</h2>
            </div>
            <ButtonLink
              render={<a href={SITE_CONTACT_URL} target="_blank" rel="noreferrer noopener" />}
              size="lg"
            >
              Написать в Telegram <ArrowUpRight aria-hidden="true" />
            </ButtonLink>
          </CardContent>
        </Card>
      </div>
    </ServicesPageStyles>
  )
}
