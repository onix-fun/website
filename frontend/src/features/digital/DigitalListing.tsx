import { ShowcaseListing } from '@/common'
import { digitalItems } from './model/digital-items'

export function DigitalListing() {
  return (
    <ShowcaseListing
      items={digitalItems}
      basePath="/digital"
      sectionLabel="Цифровые продукты"
    />
  )
}
