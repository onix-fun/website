import { LegalPage } from './LegalPage'
import { legalDocuments } from './legal-documents'

export function PrivacyPage() {
  return <LegalPage document={legalDocuments.privacy} path="/privacy" />
}
