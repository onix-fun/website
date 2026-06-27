<script setup lang="ts">
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import PlanetsSection from '@/components/sections/PlanetsSection.vue'
import ProductSection from '@/components/sections/ProductSection.vue'
import MaterialsSection from '@/components/sections/MaterialsSection.vue'
import ReviewsSection from '@/components/sections/ReviewsSection.vue'
import FaqSection from '@/components/sections/FaqSection.vue'
import HomeIcon from '@/assets/icons/home.svg'
import SearchIcon from '@/assets/icons/search.svg'
import GalleryIcon from '@/assets/icons/gallery.svg'
import SettingsIcon from '@/assets/icons/settings.svg'
import ProfileIcon from '@/assets/icons/profile.svg'
import type { HeaderItem } from '@/components/header/types'

const navItems: HeaderItem[] = [
  { id: 'home', to: '/', title: 'Home', icon: HomeIcon },
  { id: 'search', to: '/search', title: 'Search', icon: SearchIcon, disabled: true },
  { id: 'gallery', to: '/gallery', title: 'Gallery', icon: GalleryIcon, disabled: true },
  { id: 'settings', to: '/settings', title: 'Settings', icon: SettingsIcon, disabled: true },
  { id: 'profile', to: '/profile', title: 'Profile', icon: ProfileIcon, disabled: true },
]
</script>

<template>
  <AppHeader logo="/favicon.svg" :items="navItems" />
  <main>
    <PlanetsSection />
    <ProductSection />
    <MaterialsSection />
    <ReviewsSection />
    <FaqSection />
  </main>
  <AppFooter />
</template>
