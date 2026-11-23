import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import type { ShowcaseItem } from '@onix/ui-kit'
import { ShowcaseListing } from '../ui/showcase-listing'

const items = [
  {
    id: 'object-01',
    title: 'Корпус для проверки компоновки',
    category: 'Прототипы',
    summary: 'Проверяем габариты и сборку.',
    description: 'Описание корпуса.',
    kind: 'object',
    facts: [],
  },
  {
    id: 'merch-01',
    title: 'Светильники ONIX',
    category: 'Мерч',
    summary: 'Плафоны из 3D-печати.',
    description: 'Описание светильника.',
    kind: 'object',
    facts: [],
  },
] as const satisfies readonly ShowcaseItem[]

function renderListing() {
  return render(
    <MemoryRouter>
      <ShowcaseListing
        items={items}
        basePath="/catalog"
        sectionLabel="Прототипы и предметы"
        countLabel="Предметы и прототипы"
      />
    </MemoryRouter>,
  )
}

function cards() {
  return screen.getAllByTestId(/^showcase-card-/)
}

describe('ShowcaseListing', () => {
  it('filters by category and reports the result count', async () => {
    const user = userEvent.setup()
    renderListing()

    expect(cards()).toHaveLength(2)
    expect(screen.getByText('Предметы и прототипы')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Мерч' }))

    expect(cards()).toHaveLength(1)
    expect(screen.getByTestId('showcase-card-merch-01')).toBeInTheDocument()
    expect(screen.getByText('1 из 2')).toBeInTheDocument()
  })

  it('searches by title and resets filters from the empty state', async () => {
    const user = userEvent.setup()
    renderListing()

    await user.type(screen.getByTestId('showcase-search'), 'несуществующий')

    expect(screen.getByTestId('showcase-empty')).toBeInTheDocument()

    await user.click(within(screen.getByTestId('showcase-empty')).getByRole('button', {
      name: 'Сбросить фильтры',
    }))

    expect(cards()).toHaveLength(2)
    expect(screen.getByTestId('showcase-search')).toHaveValue('')
  })
})
