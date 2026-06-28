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
  return null
})

const isDigital = computed(() => page.value === 'digital-catalog' || page.value === 'digital-product')
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
