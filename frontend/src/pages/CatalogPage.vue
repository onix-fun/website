<script setup lang="ts">
import { provide, ref } from 'vue'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { navItems } from '@/components/header'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import CatalogFiltersSection from '@/components/sections/catalog/CatalogFiltersSection.vue'
import CatalogGridSection from '@/components/sections/catalog/CatalogGridSection.vue'
import CatalogCtaSection from '@/components/sections/catalog/CatalogCtaSection.vue'

const activeCategory = ref('all')
provide('activeCategory', activeCategory)
</script>

<template>
  <AppHeader logo="/favicon.svg" :items="navItems" />
  <main>
    <Breadcrumbs />
    <h1 class="catalog-page__title">Каталог</h1>
    <CatalogFiltersSection />
    <CatalogGridSection />
    <CatalogCtaSection />
  </main>
  <AppFooter />
</template>

<style scoped>
.catalog-page__title {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 80px 16px;
  font-family: var(--font-body);
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark);
}
</style>
