import type { ShowcaseItem } from '@/common'

export const digitalItems = [
  {
    id: 'digital-01',
    title: 'Цифровой объект 01',
    category: '3D-модели',
    summary: 'Описание цифрового продукта появится позже.',
    description: 'В карточке будет информация о файле, его содержимом и способе использования.',
    kind: 'digital',
    facts: [
      { label: 'Формат', value: 'Будет добавлено' },
      { label: 'Совместимость', value: 'Информация появится позже' },
      { label: 'Лицензия', value: 'Будет добавлено' },
    ],
  },
  {
    id: 'digital-02',
    title: 'Цифровой объект 02',
    category: '3D-модели',
    summary: 'Состав и визуал продукта будут добавлены позже.',
    description: 'Здесь появятся детали о цифровой модели и материалах продукта.',
    kind: 'digital',
    facts: [
      { label: 'Формат', value: 'Будет добавлено' },
      { label: 'Совместимость', value: 'Информация появится позже' },
      { label: 'Лицензия', value: 'Будет добавлено' },
    ],
  },
  {
    id: 'asset-01',
    title: 'Набор 01',
    category: 'Наборы',
    summary: 'Краткое описание набора будет добавлено позже.',
    description: 'Карточка предназначена для состава набора и требований к использованию.',
    kind: 'digital',
    facts: [
      { label: 'Формат', value: 'Будет добавлено' },
      { label: 'Состав', value: 'Информация появится позже' },
      { label: 'Лицензия', value: 'Будет добавлено' },
    ],
  },
] satisfies readonly ShowcaseItem[]
