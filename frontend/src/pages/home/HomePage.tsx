import { useDocumentMeta } from '@onix/ui-kit'
import { HeroSection } from '@/features/hero'

export function HomePage() {
  useDocumentMeta({
    title: 'ONIX — цифровые продукты, прототипы и светильники',
    description:
      'ONIX создаёт цифровые продукты на собственных open-source low-code системах, прототипы и светильники с 3D-печатными плафонами.',
    path: '/',
  })

  return <HeroSection />
}
