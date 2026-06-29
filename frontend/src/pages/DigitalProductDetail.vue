<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { navItems } from '@/components/header'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import type { BreadcrumbData } from '@/components/Breadcrumbs.vue'
import DigitalProductHeroSection from '@/components/sections/digital/DigitalProductHeroSection.vue'
import DigitalProductFeaturesSection from '@/components/sections/digital/DigitalProductFeaturesSection.vue'
import DigitalProductArchitectureSection from '@/components/sections/digital/DigitalProductArchitectureSection.vue'
import DigitalProductTechStackSection from '@/components/sections/digital/DigitalProductTechStackSection.vue'
import DigitalProductOpenSourceSection from '@/components/sections/digital/DigitalProductOpenSourceSection.vue'
import type { ProductData } from '@/components/sections/digital/DigitalProductHeroSection.vue'

const route = useRoute()
const product = ref<ProductData | null>(null)
const notFound = ref(false)

provide('digitalProduct', product)

const breadcrumbDynamic = computed<BreadcrumbData | undefined>(() => {
  const badge = product.value?.content?.hero?.badge
  return badge ? { badge } : undefined
})
provide('breadcrumbData', breadcrumbDynamic)

onMounted(async () => {
  try {
    const slug = route.params.slug
    const res = await fetch(`/api/digital-catalog/${slug}`)
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
    <DigitalProductHeroSection :not-found="notFound" />
    <DigitalProductFeaturesSection />
    <DigitalProductArchitectureSection />
    <DigitalProductTechStackSection />
    <DigitalProductOpenSourceSection />
  </main>
  <AppFooter />
</template>
