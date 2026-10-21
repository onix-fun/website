export type ShowcaseKind = 'object' | 'digital'

export interface ShowcaseFact {
  label: string
  value: string
}

/** Local presentation data shared by the physical and digital demo listings. */
export interface ShowcaseItem {
  id: string
  title: string
  category: string
  summary: string
  description: string
  kind: ShowcaseKind
  facts: readonly ShowcaseFact[]
}
