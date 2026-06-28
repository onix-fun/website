<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface ValueCard {
  title: string
  description: string
  color: string
}

interface AboutValuesData {
  label: string
  values: ValueCard[]
}

const data = ref<AboutValuesData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/about_values')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data" class="av">
    <div class="av__inner">
      <span class="av__label">{{ data.label }}</span>
      <div class="av__grid">
        <article v-for="(v, i) in data.values" :key="i" class="av__card">
          <div class="av__card-dot" :style="{ background: v.color }" />
          <h3 class="av__card-title">{{ v.title }}</h3>
          <p class="av__card-desc">{{ v.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.av {
  background: #f5f0e8;
  padding: 0 80px 80px;
}

.av__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.av__label {
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #ff4d00;
}

.av__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.av__card {
  border: 1px solid #1a1a1a;
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.av__card-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.av__card-title {
  font-family: Helvetica, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.av__card-desc {
  font-family: Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #6b6555;
  margin: 0;
  line-height: 1.5;
  white-space: pre-line;
}
</style>
