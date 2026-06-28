<script setup lang="ts">
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { navItems } from '@/components/header'
import HeroSection from '@/components/sections/HeroSection.vue'
import TickerSection from '@/components/sections/TickerSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import MaterialsSection from '@/components/sections/MaterialsSection.vue'
import ReviewsSection from '@/components/sections/ReviewsSection.vue'
import FaqSection from '@/components/sections/FaqSection.vue'
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
