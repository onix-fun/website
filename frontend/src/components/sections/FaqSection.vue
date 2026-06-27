<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface FaqItem {
  question: string
  answer: string
}

interface FaqData {
  title: string
  items: FaqItem[]
}

const data = ref<FaqData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/faq')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data">
    <h2>{{ data.title }}</h2>
    <dl>
      <div v-for="item in data.items" :key="item.question">
        <dt>{{ item.question }}</dt>
        <dd>{{ item.answer }}</dd>
      </div>
    </dl>
  </section>
</template>
