<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface MaterialsData {
  title: string
  items: string[]
}

const data = ref<MaterialsData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/materials')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data">
    <h2>{{ data.title }}</h2>
    <ul>
      <li v-for="item in data.items" :key="item">{{ item }}</li>
    </ul>
  </section>
</template>
