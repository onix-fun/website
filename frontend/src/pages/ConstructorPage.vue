<script setup lang="ts">
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { navItems } from '@/components/header'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import ConfiguratorForm from '@/components/forms/ConfiguratorForm.vue'
</script>

<template>
  <AppHeader logo="/favicon.svg" :items="navItems" />
  <main id="main-content">
    <Breadcrumbs />
    <ConfiguratorForm />
  </main>
  <AppFooter />
</template>
