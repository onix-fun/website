import { LegalPage } from './LegalPage'
import { legalDocuments } from './legal-documents'

export function CookiesPage() {
  return <LegalPage document={legalDocuments.cookies} />
}
