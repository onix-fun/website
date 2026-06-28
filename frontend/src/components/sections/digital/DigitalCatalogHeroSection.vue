<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface HeroContent {
  badge: string
  heading: string
  description: string
}

interface DigitalCatalogContent {
  hero: HeroContent
  button_text: string
}

const content = ref<DigitalCatalogContent | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/digital_catalog_page')
    content.value = await res.json()
  } catch {
    content.value = null
  }
})
</script>

<template>
  <section v-if="content" class="hero-cta">
    <div class="cta-blur cta-blur--purple"></div>
    <div class="cta-blur cta-blur--orange"></div>
    <span class="cta-badge">{{ content.hero.badge }}</span>
    <h2 class="cta-heading">{{ content.hero.heading }}</h2>
    <p class="cta-description">{{ content.hero.description }}</p>
  </section>
</template>

<style scoped>
.hero-cta {
  position: relative;
  background: #1a1a1a;
  padding: 80px;
  margin: 0 -80px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.cta-blur {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
  pointer-events: none;
}

.cta-blur--purple {
  width: 600px;
  height: 600px;
  background: #7b61ff;
  top: -100px;
  left: -100px;
}

.cta-blur--orange {
  width: 400px;
  height: 400px;
  background: #ff4d00;
  bottom: -50px;
  right: -50px;
}

.cta-badge {
  font-size: 12px;
  font-weight: 400;
  color: #fff;
  font-family: Helvetica, sans-serif;
  position: relative;
  z-index: 1;
}

.cta-heading {
  font-size: 60px;
  font-weight: 700;
  color: #f5f0e8;
  font-family: Helvetica, sans-serif;
  margin: 0;
  line-height: 1.1;
  position: relative;
  z-index: 1;
  white-space: pre-line;
}

.cta-description {
  font-size: 16px;
  color: #f5f0e8;
  font-family: Helvetica, sans-serif;
  max-width: 500px;
  line-height: 1.5;
  margin: 0;
  position: relative;
  z-index: 1;
}
</style>
