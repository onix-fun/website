<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { navItems } from '@/components/header'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import type { BreadcrumbData } from '@/components/Breadcrumbs.vue'
import ProductHeroSection from '@/components/sections/product/ProductHeroSection.vue'
import ProductSpecsSection from '@/components/sections/product/ProductSpecsSection.vue'
import ProductBoxSection from '@/components/sections/product/ProductBoxSection.vue'
import ProductStorySection from '@/components/sections/product/ProductStorySection.vue'
import type { ProductData } from '@/components/sections/product/ProductHeroSection.vue'

const route = useRoute()
const product = ref<ProductData | null>(null)
const notFound = ref(false)

provide('product', product)

const breadcrumbDynamic = computed<BreadcrumbData | undefined>(() => {
  if (!product.value) return undefined
  return { name: product.value.name }
})
provide('breadcrumbData', breadcrumbDynamic)

onMounted(async () => {
  try {
    const res = await fetch(`/api/catalog/${route.params.slug}`)
    if (!res.ok) throw new Error('not found')
    product.value = await res.json()
  } catch {
    product.value = null
    notFound.value = true
  }
})
</script>

<template>
  <AppHeader logo="/favicon.svg" :items="navItems" />
  <main id="main-content">
    <Breadcrumbs />
    <ProductHeroSection :not-found="notFound" />
    <ProductSpecsSection />
    <ProductBoxSection />
    <ProductStorySection />
  </main>
  <AppFooter />
</template>
