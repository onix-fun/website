<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { navItems } from '@/components/header'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import PreorderForm from '@/components/forms/PreorderForm.vue'
import { setPreorderFromConfigurator, setPreorderFromCatalog } from '@/stores/preorder'

const route = useRoute()

onMounted(async () => {
  if (route.query.from === 'constructor') {
    await setPreorderFromConfigurator()
  } else if (route.query.product) {
    await setPreorderFromCatalog(route.query.product as string)
  }
})
</script>

<template>
  <AppHeader logo="/favicon.svg" :items="navItems" />
  <main id="main-content">
    <Breadcrumbs />
    <PreorderForm />
  </main>
  <AppFooter />
</template>
