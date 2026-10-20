import type { Item } from '@/common'
import {
  Factory,
  FlaskConical,
  Info,
  MonitorSmartphone,
  ShoppingBag,
  SlidersHorizontal,
} from 'lucide-react'

export const navItems: readonly Item[] = [
  { id: 'about', to: '/about', title: 'О компании', icon: Info },
  { id: 'catalog', to: '/catalog', title: 'Продукция', icon: ShoppingBag },
  { id: 'process', to: '/process', title: 'Производство', icon: Factory },
  {
    id: 'digital-catalog',
    to: '/digital-catalog',
    title: 'IT-каталог',
    icon: MonitorSmartphone,
  },
  {
    id: 'constructor',
    to: '/constructor',
    title: 'Конфигуратор',
    icon: SlidersHorizontal,
  },
  { id: 'test', to: '/test', title: 'Тестовая страница', icon: FlaskConical },
]
