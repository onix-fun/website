<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HeroPlanets from '@/assets/hero-planets.svg'

interface AboutHeroData {
  label: string
  title: string
  description: string
}

const data = ref<AboutHeroData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/about_hero')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data" class="ah">
    <div class="ah__orbs">
      <HeroPlanets />
    </div>
    <div class="ah__inner">
      <div class="ah__content">
        <span class="ah__label">{{ data.label }}</span>
        <h1 class="ah__title">{{ data.title }}</h1>
        <p class="ah__description">{{ data.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ah {
  position: relative;
  background: #f5f0e8;
  padding: 80px;
  overflow: hidden;
  min-height: 459px;
  display: flex;
  align-items: center;
}

.ah__orbs {
  position: absolute;
  top: 50%;
  left: 53%;
  transform: translate(-50%, -50%) rotate(-8deg);
  width: 80%;
  max-width: 900px;
  pointer-events: none;
  opacity: 0.65;
  z-index: 0;
}

.ah__orbs svg {
  display: block;
  width: 100%;
  height: auto;
}

.ah__inner {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
}

.ah__content {
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ah__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: #ff4d00;
}

.ah__title {
  font-family: var(--font-heading);
  font-size: var(--text-5xl);
  font-weight: var(--fw-black);
  color: #1a1a1a;
  margin: 0;
  line-height: var(--leading-tight);
  white-space: pre-line;
}

.ah__description {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--fw-regular);
  color: #6b6555;
  margin: 0;
  line-height: var(--leading-normal);
}

@media (max-width: 768px) {
  .ah {
    padding: 48px 16px;
    min-height: auto;
  }

  .ah__orbs {
    width: 130vw;
    max-width: none;
    opacity: 0.45;
    top: 50%;
    left: 53%;
    transform: translate(-50%, -50%) rotate(-8deg);
  }

  .ah__title {
    font-size: var(--text-2xl);
  }
}
</style>
