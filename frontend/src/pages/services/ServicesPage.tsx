import { ServicesPageStyles } from './ServicesPage.styles'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { ButtonLink, Card, CardContent, PageIntro } from '@/common'

const services = [
  {
    title: 'Цифровые продукты',
    description:
      'Проектируем продукт вокруг реального сценария: определяем логику, данные и интерфейс, затем собираем рабочую версию.',
  },
  {
    title: 'Open-source low-code системы',
    description:
      'Развиваем собственные открытые low-code системы и используем их как основу прикладных цифровых решений.',
  },
  {
    title: 'Прототипирование',
    description:
      'Проверяем интерфейсы и физическую форму до следующего этапа разработки — от кликабельного макета до детали.',
  },
  {
    title: 'Светильники и мерч',
    description:
      'Создаём собственные светильники с плафонами, напечатанными на 3D-принтере.',
  },
]

const process = [
  { title: 'Контекст', description: 'Фиксируем пользователей, процесс и нужный результат.' },
  { title: 'Система', description: 'Продумываем данные, логику и интерфейсы продукта.' },
  { title: 'Прототип', description: 'Проверяем цифровой сценарий или физическую форму.' },
  { title: 'Развитие', description: 'Уточняем решение по итогам проверки и использования.' },
]

export function ServicesPage() {
  return (
    <ServicesPageStyles data-part="page">
      <div data-part="content">
        <PageIntro
          eyebrow="ЦИФРОВЫЕ ПРОДУКТЫ И ПРОТОТИПЫ"
          title="От low-code системы к своему продукту"
          description="Строим цифровые продукты на собственных open-source low-code системах. Для проверки идей создаём прототипы, а в собственном мерче — светильники с 3D-печатными плафонами."
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
            <h2 id="service-process-title">От задачи до рабочей версии</h2>
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
              <h2>Цифровой продукт, прототип или светильник</h2>
            </div>
            <ButtonLink
              render={<Link to="/form" />}
              size="lg"
            >
              Обсудить задачу <ArrowUpRight aria-hidden="true" />
            </ButtonLink>
          </CardContent>
        </Card>
      </div>
    </ServicesPageStyles>
  )
}
