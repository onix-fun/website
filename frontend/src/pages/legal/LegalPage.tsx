import { Link } from 'react-router'
import { PageIntro, useDocumentMeta } from '@onix/ui-kit'
import { LegalPageStyles } from './LegalPage.styles'
import type { LegalDocument } from './legal-documents'

export function LegalPage({
  document,
  path,
}: {
  document: LegalDocument
  path: string
}) {
  // Most legal texts are still drafts; keep them out of the index until the
  // operator details and actual service list are confirmed.
  useDocumentMeta({
    title: document.title,
    description: document.description,
    path,
    noindex: true,
  })

  return (
    <LegalPageStyles data-part="page">
      <div data-part="content">
        <PageIntro
          eyebrow={document.eyebrow}
          title={document.title}
          description={document.description}
        />

        <p data-part="draftNotice" role="note">
          Черновик: перед публикацией укажите ФИО и адрес оператора, email для обращений, фактический почтовый сервис и получателя заявок, срок хранения и все подключённые облачные сервисы.
        </p>

        <div data-part="documentLayout">
          <nav data-part="contents" aria-label="Содержание документа">
            <span data-part="contentsTitle">В документе</span>
            <ul>
              {document.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ul>
          </nav>

          <article data-part="article">
            {document.sections.map((section, index) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
                <span data-part="sectionIndex">{String(index + 1).padStart(2, '0')}</span>
                <h2 id={`${section.id}-title`}>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                ) : null}
              </section>
            ))}
          </article>
        </div>

        <p data-part="backLink"><Link to="/form">Вернуться к форме заявки</Link></p>
      </div>
    </LegalPageStyles>
  )
}
