import { ShowcaseListingStyles } from './showcase-listing.styles'
import { useId, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Badge, Button, Card, Input, Label } from '@/common'
import { ShowcaseCard } from './showcase-card'
import type { ShowcaseItem } from '@/common'

export function ShowcaseListing({
  items,
  basePath,
  sectionLabel,
}: {
  items: readonly ShowcaseItem[]
  basePath: string
  sectionLabel: string
}) {
  const searchId = useId()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const categories = useMemo(() => [...new Set(items.map((item) => item.category))], [items])
  const normalizedQuery = query.trim().toLocaleLowerCase('ru')
  const visibleItems = items.filter((item) => {
    const matchesCategory = activeCategory === null || item.category === activeCategory
    const searchable = `${item.title} ${item.category} ${item.summary}`.toLocaleLowerCase('ru')
    return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery))
  })

  const resetFilters = () => {
    setQuery('')
    setActiveCategory(null)
  }

  return (
    <ShowcaseListingStyles data-part="listing" aria-label={sectionLabel}>
      <div data-part="toolbar">
        <div data-part="searchField">
          <Label visuallyHidden htmlFor={searchId}>Поиск по названию или категории</Label>
          <Search data-part="searchIcon" aria-hidden="true" />
          <Input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Название или категория"
            data-part="searchInput"
            data-testid="showcase-search"
          />
        </div>

        <div data-part="filters" role="group" aria-label="Фильтр по категории">
          <Button
            type="button"
            size="sm"
            variant={activeCategory === null ? 'default' : 'outline'}
            aria-pressed={activeCategory === null}
            onClick={() => setActiveCategory(null)}
            data-testid="showcase-filter-all"
          >
            Все
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              type="button"
              size="sm"
              variant={activeCategory === category ? 'default' : 'outline'}
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              data-testid={`showcase-filter-${category.toLocaleLowerCase('ru').replaceAll(' ', '-')}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <p data-part="resultCount" role="status" aria-live="polite">
        <Badge variant="outline">{visibleItems.length} из {items.length}</Badge>
        <span>Демо-карточки, наполнение будет обновлено</span>
      </p>

      {visibleItems.length > 0 ? (
        <div data-part="grid" data-testid="showcase-grid">
          {visibleItems.map((item) => (
            <ShowcaseCard
              key={item.id}
              item={item}
              href={`${basePath}/${item.id}`}
              index={items.indexOf(item)}
            />
          ))}
        </div>
      ) : (
        <Card data-part="empty" role="status" data-testid="showcase-empty">
          <span data-part="emptyEyebrow">Ничего не найдено</span>
          <h2>Попробуйте изменить запрос</h2>
          <p>В демо-наборе пока нет карточек, подходящих под выбранные условия.</p>
          <Button type="button" variant="outline" onClick={resetFilters}>
            Сбросить фильтры
          </Button>
        </Card>
      )}
    </ShowcaseListingStyles>
  )
}
