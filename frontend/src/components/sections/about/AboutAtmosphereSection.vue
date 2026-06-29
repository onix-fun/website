<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface AboutAtmosphereData {
  label: string
  title: string
  image_url?: string
  description: string[]
}

const data = ref<AboutAtmosphereData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/about_atmosphere')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data" class="aa">
    <div class="aa__inner">
      <div class="aa__image">
        <img v-if="data.image_url" class="aa__image-el" :src="data.image_url" alt="Атмосфера мастерской Sparrow">
        <div v-else class="aa__image-placeholder" />
      </div>
      <div class="aa__content">
        <span class="aa__label">{{ data.label }}</span>
        <h2 class="aa__title">{{ data.title }}</h2>
        <p v-for="(p, i) in data.description" :key="i" class="aa__text">{{ p }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.aa {
  background: #1a1a1a;
  padding: 80px;
}

.aa__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 84px;
}

.aa__image {
  flex: 0 0 593px;
  height: 312px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 9px 0 #3e3e3e;
}

.aa__image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border-radius: 15px;
}

.aa__image-el {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.aa__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.aa__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: #ff4d00;
}

.aa__title {
  font-family: var(--font-body);
  font-size: var(--text-3xl);
  font-weight: var(--fw-bold);
  color: #f5f0e8;
  margin: 0;
}

.aa__text {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--fw-regular);
  color: #f5f0e8;
  margin: 0;
  line-height: var(--leading-relaxed);
}
</style>
