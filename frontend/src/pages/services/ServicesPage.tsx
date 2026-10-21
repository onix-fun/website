import { ArrowUpRight } from 'lucide-react'
import { ButtonLink, Card, CardContent, Page, PageIntro, SITE_CONTACT_URL } from '@/common'
import styles from './ServicesPage.module.scss'

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
    <Page className={styles.page}>
      <div className={styles.content}>
        <PageIntro
          eyebrow="ОТ ИДЕИ ДО ПРЕДМЕТА"
          title="Проектируем и создаём"
          description="Помогаем пройти путь от идеи до физического предмета: проектируем, моделируем и создаём с помощью 3D-печати."
        />

        <section className={styles.section} aria-labelledby="services-title">
          <div className={styles.sectionHeading}>
            <span className={styles.sectionIndex}>01 / ЧТО МЫ ДЕЛАЕМ</span>
            <h2 id="services-title">Услуги студии</h2>
          </div>
          <ol className={styles.services} aria-label="Услуги студии">
            {services.map((service, index) => (
              <li key={service.title}>
                <Card className={styles.service}>
                  <CardContent className={styles.serviceContent}>
                    <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                    <h3 className={styles.title}>{service.title}</h3>
                    <p className={styles.description}>{service.description}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.process} aria-labelledby="service-process-title">
          <div className={styles.sectionHeading}>
            <span className={styles.sectionIndex}>02 / КАК МЫ РАБОТАЕМ</span>
            <h2 id="service-process-title">Четыре шага к результату</h2>
          </div>
          <ol className={styles.processList}>
            {process.map((step, index) => (
              <li key={step.title}>
                <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <Card className={styles.callout}>
          <CardContent className={styles.calloutContent}>
            <div>
              <span className={styles.sectionIndex}>ОБСУДИМ ВАШУ ЗАДАЧУ</span>
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
    </Page>
  )
}
