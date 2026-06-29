<script setup lang="ts">
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { navItems } from '@/components/header'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import AboutHeroSection from '@/components/sections/about/AboutHeroSection.vue'
import AboutValuesSection from '@/components/sections/about/AboutValuesSection.vue'
import AboutAtmosphereSection from '@/components/sections/about/AboutAtmosphereSection.vue'
import AboutAuthorSection from '@/components/sections/about/AboutAuthorSection.vue'
import AboutContactsSection from '@/components/sections/about/AboutContactsSection.vue'
</script>

<template>
  <AppHeader logo="/favicon.svg" :items="navItems" />
  <main id="main-content">
    <Breadcrumbs />
    <AboutHeroSection />
    <AboutValuesSection />
    <AboutAtmosphereSection />
    <AboutAuthorSection />
    <AboutContactsSection />
  </main>
  <AppFooter />
</template>
