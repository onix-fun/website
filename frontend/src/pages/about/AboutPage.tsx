import { AboutPageStyles } from './AboutPage.styles'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { ButtonLink, Card, CardContent, PageIntro } from '@/common'

const principles = [
  {
    number: '01',
    title: 'Понять процесс',
    description: 'Разбираемся, кто будет пользоваться продуктом и какую задачу он должен решать.',
  },
  {
    number: '02',
    title: 'Собрать систему',
    description: 'Используем собственные open-source low-code системы как основу цифрового продукта.',
  },
  {
    number: '03',
    title: 'Проверить прототипом',
    description: 'Тестируем сценарий в интерфейсе или проверяем форму физического объекта.',
  },
]

const process = ['Задача и сценарий', 'Модель продукта', 'Рабочий прототип', 'Развитие системы']

export function AboutPage() {
  return (
    <AboutPageStyles data-part="page">
      <div data-part="content">
        <PageIntro
          eyebrow="СТУДИЯ ONIX"
          title="Цифровой продукт начинается с задачи"
          description="Разрабатываем цифровые продукты на собственных open-source low-code системах. Проверяем идеи прототипами — от интерфейса до предмета."
        />

        <section data-part="section" aria-labelledby="approach-title">
          <div data-part="sectionHeading">
            <span data-part="sectionIndex">01 / ПОДХОД</span>
            <h2 id="approach-title">Система должна помогать делу</h2>
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
            <h2 id="process-title">От сценария к работающему продукту</h2>
            <p>Сначала проверяем ход решения, затем развиваем систему по мере использования.</p>
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
              <span data-part="sectionIndex">ЕСТЬ ЗАДАЧА?</span>
              <h2>Обсудим цифровой продукт или прототип</h2>
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
