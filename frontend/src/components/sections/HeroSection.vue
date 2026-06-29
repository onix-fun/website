<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HeroPlanets from '@/assets/hero-planets.svg'

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
        <a :href="data.cta_primary.link" class="btn btn--primary">{{ data.cta_primary.text }}</a>
        <a :href="data.cta_secondary.link" class="btn btn--secondary">{{ data.cta_secondary.text }}</a>
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
  left: 50%;
  width: 100%;
  max-width: 1163px;
  pointer-events: none;
  opacity: 0.5;
  z-index: 0;
}

.hero__orbs svg {
  display: block;
  width: 100%;
  height: auto;
  transform: translate(calc(-43%), -55%);
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
  font-size: 9px;
  font-weight: 900;
  color: var(--white);
  background: var(--accent);
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hero__title {
  font-family: var(--font-heading);
  font-size: 48px;
  font-weight: 900;
  text-align: center;
  color: var(--text-dark);
  white-space: pre-line;
  margin: 0 0 8px;
  line-height: 1.15;
  text-shadow: 0 4px 4px rgba(0,0,0,0.15);
}

.hero__subtitle {
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  color: var(--accent);
  margin: 0 0 24px;
}

.hero__actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  padding: 10px 24px;
  border-radius: 999px;
  color: var(--white);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(1px);
}

.btn--primary {
  background: var(--accent);
  box-shadow: 0 4px 0 var(--accent-shadow);
}

.btn--secondary {
  background: var(--green);
  box-shadow: 0 4px 0 var(--green-shadow);
}

@media (max-width: 768px) {
  .hero {
    min-height: 100dvh;
    padding: 80px 20px 48px;
  }

  .hero__orbs {
    position: absolute;
    top: auto;
    bottom: 0;
    left: 0;
    width: 100%;
    max-width: none;
    opacity: 0.2;
    pointer-events: none;
  }

  .hero__orbs svg {
    display: block;
    width: 100%;
    max-width: none;
    height: auto;
    transform: none;
  }

  .hero__title {
    font-size: 32px;
  }

  .hero__subtitle {
    font-size: 12px;
  }

  .hero__actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
