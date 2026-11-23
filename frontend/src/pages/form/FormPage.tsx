import { PageIntro, useDocumentMeta } from '@onix/ui-kit'
import { ContactForm } from '@/features/contact-form'
import { FormPageStyles } from './FormPage.styles'

const introDescription =
  'Опишите идею, продукт или вопрос, который хотите обсудить. Мы рассмотрим обращение и ответим по указанному email'

const topics = [
  { title: 'Цифровой продукт', description: 'Low-code система, сервис или автоматизация процесса.' },
  { title: 'Прототип', description: 'Проверка интерфейса, конструкции или компоновки.' },
  { title: 'Светильник ONIX', description: 'Вопрос о собственном светильнике.' },
]

export function FormPage() {
  useDocumentMeta({
    title: 'Связаться с ONIX',
    description: introDescription,
    path: '/form',
  })

  return (
    <FormPageStyles data-part="page">
      <div data-part="content">
        <PageIntro
          eyebrow="СВЯЗАТЬСЯ С ONIX"
          title="Расскажите о своей задаче"
          description={introDescription}
        />

        <div data-part="layout">
          <aside data-part="topics" aria-labelledby="topics-title">
            <h2 id="topics-title">С чем можно обратиться</h2>
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
