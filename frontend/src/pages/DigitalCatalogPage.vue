<script setup lang="ts">
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { navItems } from '@/components/header'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import DigitalCatalogHeroSection from '@/components/sections/digital/DigitalCatalogHeroSection.vue'
import DigitalCatalogGridSection from '@/components/sections/digital/DigitalCatalogGridSection.vue'
</script>

<template>
  <AppHeader logo="/favicon.svg" :items="navItems" />
  <main id="main-content">
    <Breadcrumbs />
    <DigitalCatalogHeroSection />
    <DigitalCatalogGridSection />
  </main>
  <AppFooter />
</template>
