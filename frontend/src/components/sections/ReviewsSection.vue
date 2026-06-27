<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Review {
  id: number
  text: string
  author: string
}

interface ReviewsData {
  title: string
  reviews: Review[]
}

const data = ref<ReviewsData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/reviews')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data">
    <h2>{{ data.title }}</h2>
    <div class="reviews">
      <article v-for="review in data.reviews" :key="review.id">
        <p>{{ review.text }}</p>
        <cite>{{ review.author }}</cite>
      </article>
    </div>
  </section>
</template>
