<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import { useRoute } from 'vue-router'

export interface BreadcrumbData {
  name?: string
  category?: string
  category_slug?: string
  badge?: string
}

const route = useRoute()
const provided = inject<Ref<BreadcrumbData | null>>('breadcrumbData')

const dynamicData = computed(() => provided?.value ?? null)

const page = computed(() => {
  const path = route.path
  if (path === '/catalog') return 'catalog'
  if (path.startsWith('/catalog/')) return 'product'
  if (path === '/digital-catalog') return 'digital-catalog'
  if (path.startsWith('/digital-catalog/')) return 'digital-product'
  if (path === '/about') return 'about'
  if (path === '/constructor') return 'constructor'
  if (path === '/process') return 'process'
  if (path === '/checkout') return 'checkout'
  if (path.startsWith('/checkout/')) return 'checkout-result'
  if (path === '/500') return 'error-500'
  return 'not-found'
})

const isDigital = computed(() =>
  page.value === 'digital-catalog' || page.value === 'digital-product' || page.value === 'about' || page.value === 'constructor' || page.value === 'process' || page.value === 'checkout'
)
</script>

<template>
  <div v-if="page" :class="[`bc-${page}`, isDigital ? 'bc--digital' : 'bc--default']">
    <nav class="bc-nav">
      <router-link to="/" class="bc-link">Главная</router-link>
      <svg class="bc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M5 3.5L8.5 7L5 10.5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>

      <template v-if="page === 'catalog'">
        <span class="bc-current">Каталог</span>
      </template>

      <template v-else-if="page === 'product'">
        <template v-if="dynamicData">
          <router-link to="/catalog" class="bc-link">Каталог</router-link>
          <svg class="bc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3.5L8.5 7L5 10.5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <router-link v-if="dynamicData.category_slug" :to="`/catalog?category=${dynamicData.category_slug}`" class="bc-link">{{ dynamicData.category }}</router-link>
          <svg v-if="dynamicData.category_slug" class="bc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3.5L8.5 7L5 10.5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="bc-current">{{ dynamicData.name }}</span>
        </template>
      </template>

      <template v-else-if="page === 'digital-catalog'">
        <span class="bc-current">Цифровые продукты</span>
      </template>

      <template v-else-if="page === 'digital-product'">
        <template v-if="dynamicData">
          <router-link to="/digital-catalog" class="bc-link">Цифровые продукты</router-link>
          <svg class="bc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3.5L8.5 7L5 10.5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="bc-current">{{ dynamicData.badge }}</span>
        </template>
      </template>

      <template v-else-if="page === 'about'">
        <span class="bc-current">О нас</span>
      </template>

      <template v-else-if="page === 'constructor'">
        <span class="bc-current">Конфигуратор</span>
      </template>

      <template v-else-if="page === 'process'">
        <span class="bc-current">Процесс</span>
      </template>

      <template v-else-if="page === 'checkout'">
        <span class="bc-current">Предзаказ</span>
      </template>

      <template v-else-if="page === 'checkout-result'">
        <router-link to="/checkout" class="bc-link">Предзаказ</router-link>
        <svg class="bc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3.5L8.5 7L5 10.5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="bc-current">Результат</span>
      </template>

      <template v-else-if="page === 'not-found'">
        <span class="bc-current">Ошибка 404</span>
      </template>

      <template v-else-if="page === 'error-500'">
        <span class="bc-current">Ошибка 500</span>
      </template>
    </nav>
  </div>
</template>

<style scoped>
.bc-catalog,
.bc-product {
  max-width: 1280px;
  margin: 0 auto;
}

.bc-catalog {
  padding: 12px 80px 0;
}

.bc-product {
  padding: 24px 80px 0;
}

.bc-digital-catalog {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 80px 48px;
}

.bc-digital-product {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 80px 0;
}

.bc-about {
  background: #f5f0e8;
  padding: 40px 80px 48px;
  max-width: 1440px;
  margin: 0 auto;
}

.bc-process,
.bc-constructor,
.bc-not-found,
.bc-error-500,
.bc-checkout,
.bc-checkout-result {
  background: #f5f0e8;
  padding: 24px 80px;
}

.bc-constructor .bc-nav,
.bc-not-found .bc-nav,
.bc-error-500 .bc-nav,
.bc-checkout .bc-nav,
.bc-process .bc-nav,
.bc-checkout-result .bc-nav {
  max-width: 1280px;
  margin: 0 auto;
}

.bc--default .bc-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.bc--default .bc-link {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-muted);
  text-decoration: none;
}

.bc--default .bc-current {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
}

.bc--digital .bc-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bc--digital .bc-link {
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #6b6555;
  text-decoration: none;
}

.bc--digital .bc-current {
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #ff4d00;
}

.bc-chevron {
  flex-shrink: 0;
}
</style>
