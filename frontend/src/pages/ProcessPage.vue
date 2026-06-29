<script setup lang="ts">
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { navItems } from '@/components/header'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import ProcessArsenalSection from '@/components/sections/process/ProcessArsenalSection.vue'
import ProcessHeroSection from '@/components/sections/process/ProcessHeroSection.vue'
import ProcessStagesSection from '@/components/sections/process/ProcessStagesSection.vue'
import ProcessCtaSection from '@/components/sections/process/ProcessCtaSection.vue'
</script>

<template>
  <div class="process-page">
    <AppHeader logo="/favicon.svg" :items="navItems" />
    <main>
      <Breadcrumbs />
      <ProcessHeroSection />
      <ProcessStagesSection />
      <ProcessArsenalSection />
      <ProcessCtaSection />
    </main>
    <AppFooter />
  </div>
</template>
