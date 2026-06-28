import { reactive } from 'vue'

export interface OrderData {
  product_slug?: string
  product_name: string
  product_image?: string
  material?: string
  plastic?: string
  price_range: string
  production_time: string
  delivery: string
  description?: string
  width_mm?: number | null
  height_mm?: number | null
  depth_mm?: number | null
  features?: string[]
  color_hex?: string
  budget_range?: string
  comments?: string
}

export const preorderData = reactive<{
  origin: string
  orderData: OrderData | null
}>({
  origin: '',
  orderData: null,
})

export async function setPreorderFromConfigurator() {
  const { configuratorState } = await import('./configurator')

  let priceRange = configuratorState.budgetRange || '4 900–5 200 ₽'

  const data: OrderData = {
    product_name: configuratorState.productType === 'desk'
      ? 'Настольный светильник'
      : configuratorState.productType === 'night'
        ? 'Ночник'
        : 'Индивидуальное изделие',
    material: '',
    plastic: configuratorState.material
      ? ({ pla: 'PLA', petg: 'PETG', asa: 'ASA' } as Record<string, string>)[configuratorState.material] || configuratorState.material
      : undefined,
    price_range: priceRange,
    production_time: '14–21 рабочий день',
    delivery: 'Рассчитывается отдельно',
    description: configuratorState.description || undefined,
    width_mm: configuratorState.widthMm,
    height_mm: configuratorState.heightMm,
    depth_mm: configuratorState.depthMm,
    features: configuratorState.features.length ? configuratorState.features : undefined,
    color_hex: configuratorState.colorHex || undefined,
    budget_range: configuratorState.budgetRange || undefined,
    comments: configuratorState.comments || undefined,
  }

  preorderData.origin = 'constructor'
  preorderData.orderData = data
}

export async function setPreorderFromCatalog(productSlug: string) {
  try {
    const res = await fetch(`/api/catalog/${productSlug}`)
    if (res.ok) {
      const product = await res.json()
      const priceFormatted = product.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'

      preorderData.orderData = {
        product_slug: productSlug,
        product_name: product.name || productSlug,
        product_image: product.image_url || undefined,
        price_range: priceFormatted || 'По запросу',
        production_time: product.details?.lead_time || 'Уточняется',
        delivery: 'Рассчитывается отдельно',
      }
      preorderData.origin = 'catalog'
      return
    }
  } catch {}

  preorderData.orderData = {
    product_slug: productSlug,
    product_name: productSlug,
    price_range: 'По запросу',
    production_time: 'Уточняется',
    delivery: 'Рассчитывается отдельно',
  }
  preorderData.origin = 'catalog'
}

export function clearPreorder() {
  preorderData.origin = ''
  preorderData.orderData = null
}
