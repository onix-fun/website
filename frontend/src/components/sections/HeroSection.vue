<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HeroPlanets from '@/assets/hero-planets.svg'
import AppButton from '@/components/AppButton.vue'

interface Cta {
  text: string
  link: string
}

interface HeroData {
  badge: string
  title: string
  subtitle: string
  cta_primary: Cta
  cta_secondary: Cta
}

const data = ref<HeroData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/hero')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data" class="hero">
    <div class="hero__orbs">
      <HeroPlanets />
    </div>

    <div class="hero__content">
      <div class="hero__badge">{{ data.badge }}</div>

      <h1 class="hero__title">{{ data.title }}</h1>

      <p class="hero__subtitle">{{ data.subtitle }}</p>

      <div class="hero__actions">
        <AppButton variant="orange" size="md" :href="data.cta_primary.link">{{ data.cta_primary.text }}</AppButton>
        <AppButton variant="green" size="md" :href="data.cta_secondary.link">{{ data.cta_secondary.text }}</AppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 709px;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 120px 16px 0;
}

.hero__orbs {
  position: absolute;
  top: 50%;
  left: 53%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 1163px;
  pointer-events: none;
  opacity: 0.65;
  z-index: 0;
}

.hero__orbs svg {
  display: block;
  width: 100%;
  height: auto;
}

.hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero__badge {
  font-family: var(--font-heading);
  font-size: var(--text-xs);
  font-weight: var(--fw-bold);
  color: var(--white);
  background: #fc3200;
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.hero__title {
  font-family: var(--font-heading);
  font-size: var(--text-5xl);
  font-weight: var(--fw-black);
  text-align: center;
  color: #1a1a1a;
  white-space: pre-line;
  margin: 0 0 8px;
  line-height: var(--leading-xs);
}

.hero__subtitle {
  font-size: var(--text-sm);
  font-weight: var(--fw-regular);
  text-align: center;
  color: #6b6555;
  margin: 0 0 24px;
}

.hero__actions {
  display: flex;
  gap: 12px;
}


@media (max-width: 768px) {
  .hero {
    min-height: 100dvh;
    padding: 80px 20px 48px;
  }

  .hero__orbs {
    display: none;
    width: 130vw;
    max-width: none;
    opacity: 0.45;
    top: auto;
    bottom: -20%;
    left: 50%;
    transform: translate(-50%, 0) scaleY(-1) rotate(360);
  }

  .hero__orbs svg {
    display: block;
    width: 100%;
    max-width: none;
    height: auto;
  }

  .hero__title {
    font-size: var(--text-2xl);
  }

  .hero__subtitle {
    font-size: var(--text-xs);
  }

  .hero__actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
