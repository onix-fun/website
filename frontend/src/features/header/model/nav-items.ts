import { Info, MonitorSmartphone, ShoppingBag, Wrench } from 'lucide-react'
import type { Item } from '@/common'

export const navItems: readonly Item[] = [
  { id: 'about', to: '/about', title: 'О нас', icon: Info },
  { id: 'services', to: '/services', title: 'Услуги', icon: Wrench },
  { id: 'catalog', to: '/catalog', title: 'Каталог', icon: ShoppingBag },
  {
    id: 'digital',
    to: '/digital',
    title: 'Цифровые продукты',
    icon: MonitorSmartphone,
  },
]
