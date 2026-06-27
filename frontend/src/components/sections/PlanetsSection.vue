<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface PlanetsData {
  title: string
  text: string
}

const data = ref<PlanetsData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/planets')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data">
    <h2>{{ data.title }}</h2>
    <p>{{ data.text }}</p>
  </section>
</template>
