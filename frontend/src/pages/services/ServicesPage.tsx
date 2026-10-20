import { Page } from '@/common'
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

export function ServicesPage() {
  return (
    <Page title="Услуги">
      <div className={styles.content}>
        <p className={styles.intro}>
          Помогаем пройти путь от идеи до физического предмета: проектируем, моделируем и
          создаём с помощью 3D-печати.
        </p>
        <ol className={styles.services} aria-label="Услуги студии">
          {services.map((service, index) => (
            <li className={styles.service} key={service.title}>
              <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
              <h2 className={styles.title}>{service.title}</h2>
              <p className={styles.description}>{service.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </Page>
  )
}
