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
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  min-height: 397px;
  justify-content: center;
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
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: #fff;
  position: relative;
  z-index: 1;
}

.cta-heading {
  font-family: var(--font-heading);
  font-size: var(--text-5xl);
  font-weight: var(--fw-black);
  color: #f5f0e8;
  margin: 0;
  line-height: var(--leading-tight);
  position: relative;
  z-index: 1;
  white-space: pre-line;
}

.cta-description {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: #f5f0e8;
  max-width: 500px;
  line-height: var(--leading-normal);
  margin: 0;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .hero-cta {
    padding: 48px 16px;
    min-height: auto;
    margin: 0;
  }

  .cta-heading {
    font-size: var(--text-lg);
  }

  .cta-description {
    font-size: var(--text-sm);
  }
}
</style>
