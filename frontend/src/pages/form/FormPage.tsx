import { PageIntro } from '@/common'
import { ContactForm } from '@/features/contact-form'
import { FormPageStyles } from './FormPage.styles'

const topics = [
  {
    title: 'Цифровой продукт',
    description: 'Low-code система, сервис или автоматизация процесса.',
  },
  {
    title: 'Прототип',
    description: 'Проверка интерфейса, конструкции или компоновки.',
  },
  {
    title: 'Светильник ONIX',
    description: 'Вопрос о собственном мерче с плафоном из 3D-печати.',
  },
]

export function FormPage() {
  return (
    <FormPageStyles data-part="page">
      <div data-part="content">
        <PageIntro
          eyebrow="ЗАПРОС В ONIX"
          title="Расскажите, что хотите обсудить"
          description="Обсудим цифровой продукт на open-source low-code основе, прототип или светильник ONIX. Выберите сценарий и опишите задачу своими словами."
        />

        <div data-part="layout">
          <aside data-part="topics" aria-labelledby="topics-title">
            <h2 id="topics-title">Можно начать с одного из направлений</h2>
            <ul>
              {topics.map((topic) => (
                <li key={topic.title}>
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                </li>
              ))}
            </ul>
          </aside>
          <ContactForm />
        </div>
      </div>
    </FormPageStyles>
  )
}
