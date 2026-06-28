<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import ProductCard from '@/components/catalog/ProductCard.vue'
import type { Product } from '@/components/catalog/ProductCard.vue'
import type { HeaderItem } from '@/components/header/types'
import CatalogIcon from '@/assets/icons/catalog.svg'
import AboutIcon from '@/assets/icons/about.svg'
import ProcessIcon from '@/assets/icons/process.svg'
import DigitalCatalogIcon from '@/assets/icons/digital-catalog.svg'
import ConstructorIcon from '@/assets/icons/constructor.svg'

const navItems: HeaderItem[] = [
  { id: 'about', to: '/about', title: 'About', icon: AboutIcon },
  { id: 'catalog', to: '/catalog', title: 'Catalog', icon: CatalogIcon },
  { id: 'process', to: '/process', title: 'Process', icon: ProcessIcon },
  { id: 'digital-catalog', to: '/digital-catalog', title: 'Digital Catalog', icon: DigitalCatalogIcon },
  { id: 'constructor', to: '/constructor', title: 'Constructor', icon: ConstructorIcon },
]

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
const activeCategory = ref('all')

onMounted(async () => {
  try {
    const res = await fetch('/api/catalog')
    data.value = await res.json()
  } catch {
    data.value = null
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
  <AppHeader logo="/favicon.svg" :items="navItems" />
  <main>
    <div class="catalog">
      <nav class="breadcrumbs">
        <router-link to="/" class="breadcrumbs__link">Главная</router-link>
        <svg class="breadcrumbs__chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3.5L8.5 7L5 10.5" stroke="#717182" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="breadcrumbs__current">Каталог</span>
      </nav>

      <h1 class="catalog__title">Каталог</h1>

      <div v-if="data" class="filters">
        <button
          v-for="cat in data.categories"
          :key="cat.id"
          class="filter-btn"
          :class="{ 'filter-btn--active': activeCategory === cat.slug }"
          @click="activeCategory = cat.slug"
        >
          {{ cat.name }}
        </button>
      </div>

      <div v-if="data && filteredProducts.length" class="product-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
      <div v-else-if="data && !filteredProducts.length" class="catalog__empty">
        Нет товаров в этой категории
      </div>
    </div>

    <section class="cta">
      <div class="cta__circle cta__circle--yellow" />
      <div class="cta__circle cta__circle--green" />
      <h2 class="cta__title">Твой свет<br>уже ждёт</h2>
      <p class="cta__text">
        Оставь заявку — обсудим размер, цвет и материал. Первая<br>консультация бесплатно.
      </p>
      <router-link to="/constructor" class="cta__btn">
        Создать свой
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 9H14" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <path d="M9 4L14 9L9 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </router-link>
    </section>
  </main>
  <AppFooter />
</template>

<style scoped>
.catalog {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 80px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 0 0;
  height: 44px;
}

.breadcrumbs__link {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-muted);
  text-decoration: none;
}

.breadcrumbs__chevron {
  flex-shrink: 0;
}

.breadcrumbs__current {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
}

.catalog__title {
  font-family: var(--font-body);
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
  padding: 32px 0 16px;
}

.filters {
  display: flex;
  gap: 8px;
  padding-bottom: 32px;
}

.filter-btn {
  padding: 10px 20px;
  border-radius: 999px;
  background: var(--bg-dark);
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
}

.filter-btn--active {
  background: var(--accent);
  box-shadow: 0 4px 0 var(--accent-shadow);
}

.filter-btn:hover {
  transform: translateY(-1px);
}

.filter-btn:active {
  transform: translateY(1px);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding-bottom: 64px;
}

.catalog__empty {
  text-align: center;
  padding: 64px 0;
  color: var(--text-muted);
  font-size: 14px;
}

.cta {
  position: relative;
  background: var(--accent);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 16px;
  overflow: hidden;
  min-height: 533px;
}

.cta__circle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.cta__circle--yellow {
  width: 384px;
  height: 384px;
  background: var(--yellow);
  top: -80px;
  left: -80px;
}

.cta__circle--green {
  width: 256px;
  height: 256px;
  background: var(--green);
  bottom: -60px;
  right: -60px;
}

.cta__title {
  position: relative;
  font-family: var(--font-body);
  font-size: 72px;
  font-weight: 700;
  color: var(--bg);
  text-align: center;
  margin: 0 0 24px;
  white-space: pre-line;
  line-height: 1.15;
}

.cta__text {
  position: relative;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  color: var(--white);
  text-align: center;
  margin: 0 0 32px;
  white-space: pre-line;
  line-height: 1.5;
}

.cta__btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border-radius: 999px;
  background: var(--bg-dark);
  box-shadow: 0 6px 0 rgb(0, 0, 0);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  color: var(--white);
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.cta__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 0 rgb(0, 0, 0);
}

.cta__btn:active {
  transform: translateY(1px);
  box-shadow: 0 3px 0 rgb(0, 0, 0);
}
</style>
