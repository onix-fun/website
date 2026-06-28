import type { HeaderItem } from './types'
import CatalogIcon from '@/assets/icons/catalog.svg'
import AboutIcon from '@/assets/icons/about.svg'
import ProcessIcon from '@/assets/icons/process.svg'
import DigitalCatalogIcon from '@/assets/icons/digital-catalog.svg'
import ConstructorIcon from '@/assets/icons/constructor.svg'

export const navItems: HeaderItem[] = [
  { id: 'about', to: '/about', title: 'О компании', icon: AboutIcon },
  { id: 'catalog', to: '/catalog', title: 'Продукция', icon: CatalogIcon },
  { id: 'process', to: '/process', title: 'Производство', icon: ProcessIcon },
  { id: 'digital-catalog', to: '/digital-catalog', title: 'IT-каталог', icon: DigitalCatalogIcon },
  { id: 'constructor', to: '/constructor', title: 'Конфигуратор', icon: ConstructorIcon },
]
