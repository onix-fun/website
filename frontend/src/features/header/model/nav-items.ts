import type { Item } from '@/common'
import { Home, Info, MonitorSmartphone, ShoppingBag } from 'lucide-react'

export const navItems: readonly Item[] = [
  { id: 'home', to: '/', title: 'Главная', icon: Home },
  { id: 'about', to: '/about', title: 'О нас', icon: Info },
  { id: 'catalog', to: '/catalog', title: 'Каталог', icon: ShoppingBag },
  {
    id: 'digital',
    to: '/digital',
    title: 'Цифровые продукты',
    icon: MonitorSmartphone,
  },
]
