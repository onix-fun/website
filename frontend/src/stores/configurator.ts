import { reactive } from 'vue'

const STORAGE_KEY = 'sparrow_configurator'

export interface ConfiguratorData {
  productType: string | null
  description: string
  widthMm: number | null
  heightMm: number | null
  depthMm: number | null
  features: string[]
  material: string | null
  colorHex: string | null
  budgetRange: string
  comments: string
}

function loadFromStorage(): ConfiguratorData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {
    productType: null,
    description: '',
    widthMm: null,
    heightMm: null,
    depthMm: null,
    features: [],
    material: null,
    colorHex: null,
    budgetRange: '',
    comments: '',
  }
}

const saved = loadFromStorage()

export const configuratorState = reactive<ConfiguratorData>({
  productType: saved.productType,
  description: saved.description,
  widthMm: saved.widthMm,
  heightMm: saved.heightMm,
  depthMm: saved.depthMm,
  features: saved.features,
  material: saved.material,
  colorHex: saved.colorHex,
  budgetRange: saved.budgetRange,
  comments: saved.comments,
})

export const files = reactive<File[]>([])

const serializable: (keyof ConfiguratorData)[] = [
  'productType', 'description', 'widthMm', 'heightMm', 'depthMm',
  'features', 'material', 'colorHex', 'budgetRange', 'comments',
]

export function persistConfigurator(): void {
  const data: Record<string, unknown> = {}
  for (const key of serializable) {
    data[key] = configuratorState[key]
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function clearConfigurator(): void {
  localStorage.removeItem(STORAGE_KEY)
  configuratorState.productType = null
  configuratorState.description = ''
  configuratorState.widthMm = null
  configuratorState.heightMm = null
  configuratorState.depthMm = null
  configuratorState.features = []
  configuratorState.material = null
  configuratorState.colorHex = null
  configuratorState.budgetRange = ''
  configuratorState.comments = ''
  files.splice(0, files.length)
}
