<script setup lang="ts">
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import TickerSection from '@/components/sections/TickerSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import MaterialsSection from '@/components/sections/MaterialsSection.vue'
import ReviewsSection from '@/components/sections/ReviewsSection.vue'
import FaqSection from '@/components/sections/FaqSection.vue'
import AboutIcon from '@/assets/icons/about.svg'
import CatalogIcon from '@/assets/icons/catalog.svg'
import ProcessIcon from '@/assets/icons/process.svg'
import DigitalCatalogIcon from '@/assets/icons/digital-catalog.svg'
import ConstructorIcon from '@/assets/icons/constructor.svg'
import type { HeaderItem } from '@/components/header/types'

const navItems: HeaderItem[] = [
  { id: 'about', to: '/about', title: 'About', icon: AboutIcon },
  { id: 'catalog', to: '/catalog', title: 'Catalog', icon: CatalogIcon },
  { id: 'process', to: '/process', title: 'Process', icon: ProcessIcon },
  { id: 'digital-catalog', to: '/digital-catalog', title: 'Digital Catalog', icon: DigitalCatalogIcon },
  { id: 'constructor', to: '/constructor', title: 'Constructor', icon: ConstructorIcon },
]
</script>

<template>
  <AppHeader logo="/favicon.svg" :items="navItems" />
  <main>
    <HeroSection />
    <TickerSection bg-color="var(--yellow)" shadow-color="var(--yellow-shadow)" />
    <AboutSection />
    <TickerSection bg-color="var(--green)" shadow-color="var(--green-shadow)" />
    <MaterialsSection />
    <ReviewsSection />
    <FaqSection />
  </main>
  <AppFooter />
</template>
