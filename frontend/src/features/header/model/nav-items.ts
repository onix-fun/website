import type { Item } from '@/common'
import { Info, MonitorSmartphone, ShoppingBag, Wrench } from 'lucide-react'

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
