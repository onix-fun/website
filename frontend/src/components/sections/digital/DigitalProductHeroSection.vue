<script setup lang="ts">
import { inject, type Ref } from 'vue'

interface Feature {
  icon: string
  title: string
  description: string
}

interface ArchitectureItem {
  title: string
  subtitle: string
}

interface Architecture {
  badge: string
  heading: string
  items: ArchitectureItem[]
  description: string
}

interface TechStackItem {
  category: string
  title: string
}

interface TechStack {
  badge: string
  heading: string
  items: TechStackItem[]
}

interface OpenSource {
  heading: string
  description: string
  button_text: string
  github_url: string
}

interface HeroContent {
  badge: string
  heading: string
  description: string
  badge_color: string
}

interface ProductContent {
  hero: HeroContent
  features: Feature[]
  architecture: Architecture
  tech_stack: TechStack
  open_source: OpenSource
}

export interface ProductData {
  id: number
  slug: string
  number: number
  title: string
  subtitle: string
  description: string
  content: ProductContent
}

defineProps<{ notFound: boolean }>()

const product = inject<Ref<ProductData | null>>('digitalProduct')
</script>

<template>
  <div v-if="notFound" class="not-found">Product not found</div>
  <section v-else-if="product && product.content" class="hero-section">
    <span class="hero-badge" :style="{ color: product.content.hero.badge_color }">
      {{ product.content.hero.badge }}
    </span>
    <h1 class="hero-heading">{{ product.content.hero.heading }}</h1>
    <p class="hero-description">{{ product.content.hero.description }}</p>
  </section>
</template>

<style scoped>
.hero-section {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 80px 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.not-found {
  padding: 200px 80px;
  text-align: center;
  font-family: Helvetica, sans-serif;
  font-size: 18px;
  color: #6b6555;
}

.hero-badge {
  font-size: 12px;
  font-weight: 400;
  font-family: Helvetica, sans-serif;
}

.hero-heading {
  font-family: 'Unbounded', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.1;
  white-space: pre-line;
  max-width: 742px;
}

.hero-description {
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #6b6555;
  margin: 0;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 24px 16px 40px;
  }

  .hero-heading {
    font-size: 24px;
  }
}
</style>
