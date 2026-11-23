import { LegalPage } from './LegalPage'
import { legalDocuments } from './legal-documents'

export function PersonalDataPage() {
  return <LegalPage document={legalDocuments.personalData} />
}
