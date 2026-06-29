<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface ProcessHeroData {
  label: string
  title: string
  description: string
}

const data = ref<ProcessHeroData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/process_hero')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data" class="ph">
    <div class="ph__blur ph__blur--orange" />
    <div class="ph__blur ph__blur--green" />
    <div class="ph__inner">
      <span class="ph__label">{{ data.label }}</span>
      <h1 class="ph__title">{{ data.title }}</h1>
      <p class="ph__description">{{ data.description }}</p>
    </div>
  </section>
</template>

<style scoped>
.ph {
  position: relative;
  background: #1a1a1a;
  padding: 80px;
  overflow: hidden;
}

.ph__blur {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.15;
  pointer-events: none;
}

.ph__blur--orange {
  width: 600px;
  height: 600px;
  background: #ff4d00;
  top: -200px;
  left: -100px;
}

.ph__blur--green {
  width: 400px;
  height: 400px;
  background: #58cc02;
  bottom: -150px;
  right: -50px;
}

.ph__inner {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ph__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: #ff4d00;
}

.ph__title {
  font-family: var(--font-heading);
  font-size: var(--text-5xl);
  font-weight: var(--fw-black);
  color: #f5f0e8;
  margin: 0;
  line-height: var(--leading-tight);
  white-space: pre-line;
  max-width: 645px;
}

.ph__description {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--fw-regular);
  color: #f5f0e8;
  margin: 0;
  line-height: var(--leading-relaxed);
  max-width: 500px;
  white-space: pre-line;
}
</style>
