<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface ProductData {
  image: string
  title: string
  text: string
}

const data = ref<ProductData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/product')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data">
    <figure>
      <img :src="data.image" :alt="data.title" />
    </figure>
    <article>
      <h3>{{ data.title }}</h3>
      <p>{{ data.text }}</p>
    </article>
  </section>
</template>
