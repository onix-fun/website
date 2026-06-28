<script setup lang="ts">
import { onMounted, ref } from 'vue'

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
      <svg width="1163" height="1176" viewBox="0 0 1163 1176" fill="none">
        <ellipse cx="348" cy="305" rx="348" ry="305" stroke="#929292" stroke-width="1" />
        <ellipse cx="263" cy="230" rx="263" ry="230" stroke="#929292" stroke-width="1" />
        <ellipse cx="523" cy="298" rx="523" ry="298" stroke="#929292" stroke-width="1" />
        <ellipse cx="447" cy="391" rx="447" ry="391" stroke="#929292" stroke-width="1" />
      </svg>
    </div>

    <div class="hero__badge">{{ data.badge }}</div>

    <h1 class="hero__title">{{ data.title }}</h1>

    <p class="hero__subtitle">{{ data.subtitle }}</p>

    <div class="hero__actions">
      <a :href="data.cta_primary.link" class="btn btn--primary">{{ data.cta_primary.text }}</a>
      <a :href="data.cta_secondary.link" class="btn btn--secondary">{{ data.cta_secondary.text }}</a>
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.5;
}

.hero__orbs svg {
  width: 100%;
  height: 100%;
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
</style>
