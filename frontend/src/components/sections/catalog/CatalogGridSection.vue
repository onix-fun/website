<script setup lang="ts">
import { computed, inject, onMounted, ref, type Ref } from 'vue'
import ProductCard from '@/components/catalog/ProductCard.vue'
import type { Product } from '@/components/catalog/ProductCard.vue'

interface Category {
  id: number
  name: string
  slug: string
}

interface CatalogData {
  categories: Category[]
  products: Product[]
}

const data = ref<CatalogData | null>(null)
const pageContent = ref<{ empty_state?: string } | null>(null)
const activeCategory = inject<Ref<string>>('activeCategory')!

onMounted(async () => {
  try {
    const res = await fetch('/api/catalog')
    data.value = await res.json()
  } catch {
    data.value = null
  }

  try {
    const res = await fetch('/api/content/catalog_page')
    if (res.ok) pageContent.value = await res.json()
  } catch {
    pageContent.value = null
  }
})

const filteredProducts = computed(() => {
  if (!data.value) return []
  if (activeCategory.value === 'all') return data.value.products
  return data.value.products.filter(
    p => p.category_id === data.value!.categories.find(c => c.slug === activeCategory.value)?.id
  )
})
</script>

<template>
  <div v-if="data && filteredProducts.length" class="product-grid">
    <ProductCard
      v-for="product in filteredProducts"
      :key="product.id"
      :product="product"
    />
  </div>
  <div v-else-if="data && !filteredProducts.length" class="catalog__empty">
    {{ pageContent?.empty_state || 'Нет товаров в этой категории' }}
  </div>
</template>

<style scoped>
.product-grid {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 80px 64px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 64px 24px;
  justify-items: center;
}

@media (max-width: 1024px) {
  .product-grid {
    gap: 48px 16px;
  }
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr;
    gap: 40px;
    justify-items: stretch;
  }
}

.catalog__empty {
  text-align: center;
  padding: 64px 0;
  color: var(--text-muted);
  font-size: 14px;
}
</style>
