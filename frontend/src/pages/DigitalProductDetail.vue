<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import type { HeaderItem } from '@/components/header/types'
import CatalogIcon from '@/assets/icons/catalog.svg'
import AboutIcon from '@/assets/icons/about.svg'
import ProcessIcon from '@/assets/icons/process.svg'
import DigitalCatalogIcon from '@/assets/icons/digital-catalog.svg'
import ConstructorIcon from '@/assets/icons/constructor.svg'

import AirSmartControl from '@/assets/icons/digital/air-smart-control.svg'
import AirMqtt from '@/assets/icons/digital/air-mqtt.svg'
import AirSecurity from '@/assets/icons/digital/air-security.svg'
import AirAnalytics from '@/assets/icons/digital/air-analytics.svg'
import AirIntegration from '@/assets/icons/digital/air-integration.svg'
import AccountJwt from '@/assets/icons/digital/account-jwt.svg'
import AccountApiGrpc from '@/assets/icons/digital/account-api-grpc.svg'
import AccountVue from '@/assets/icons/digital/account-vue.svg'
import AccountSwagger from '@/assets/icons/digital/account-swagger.svg'
import AccountDocker from '@/assets/icons/digital/account-docker.svg'

const navItems: HeaderItem[] = [
  { id: 'about', to: '/about', title: 'About', icon: AboutIcon },
  { id: 'catalog', to: '/catalog', title: 'Catalog', icon: CatalogIcon },
  { id: 'process', to: '/process', title: 'Process', icon: ProcessIcon },
  { id: 'digital-catalog', to: '/digital-catalog', title: 'Digital Catalog', icon: DigitalCatalogIcon },
  { id: 'constructor', to: '/constructor', title: 'Constructor', icon: ConstructorIcon },
]

const iconMap: Record<string, unknown> = {
  'air-smart-control': AirSmartControl,
  'air-mqtt': AirMqtt,
  'air-security': AirSecurity,
  'air-analytics': AirAnalytics,
  'air-integration': AirIntegration,
  'account-jwt': AccountJwt,
  'account-api-grpc': AccountApiGrpc,
  'account-vue': AccountVue,
  'account-swagger': AccountSwagger,
  'account-docker': AccountDocker,
}

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

interface ProductData {
  id: number
  slug: string
  number: number
  title: string
  subtitle: string
  description: string
  content: ProductContent
}

const route = useRoute()
const product = ref<ProductData | null>(null)
const notFound = ref(false)

onMounted(async () => {
  try {
    const slug = route.params.slug
    const res = await fetch(`/api/digital-catalog/${slug}`)
    if (!res.ok) {
      notFound.value = true
      return
    }
    product.value = await res.json()
  } catch {
    notFound.value = true
  }
})

function featureIcon(name: string): unknown {
  return iconMap[name] || null
}
</script>

<template>
  <AppHeader logo="/favicon.svg" :items="navItems" />
  <main>
    <div v-if="notFound" class="not-found">
      <p>Product not found</p>
    </div>

    <div v-else-if="product" class="dp-page">
      <nav class="breadcrumbs">
        <router-link to="/" class="breadcrumbs__link">Главная</router-link>
        <svg class="breadcrumbs__chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3.5L8.5 7L5 10.5" stroke="#717182" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <router-link to="/digital-catalog" class="breadcrumbs__link">Цифровые продукты</router-link>
        <svg class="breadcrumbs__chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3.5L8.5 7L5 10.5" stroke="#717182" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="breadcrumbs__current">{{ product.content.hero.badge }}</span>
      </nav>

      <section class="hero-section">
        <span class="hero-badge" :style="{ color: product.content.hero.badge_color }">
          {{ product.content.hero.badge }}
        </span>
        <h1 class="hero-heading">{{ product.content.hero.heading }}</h1>
        <p class="hero-description">{{ product.content.hero.description }}</p>
      </section>

      <section class="features-section">
        <span class="section-badge">ВОЗМОЖНОСТИ</span>
        <h2 class="section-heading">Что даёт {{ product.title }}</h2>
        <div class="features-grid">
          <div
            v-for="(f, i) in product.content.features"
            :key="i"
            class="feature-card"
          >
            <div class="feature-icon" :style="{ background: product.content.hero.badge_color }">
              <component :is="featureIcon(f.icon)" class="feature-icon__svg" />
            </div>
            <h3 class="feature-title">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.description }}</p>
          </div>
        </div>
      </section>

      <section class="arch-section">
        <span class="arch-badge">{{ product.content.architecture.badge }}</span>
        <h2 class="arch-heading">{{ product.content.architecture.heading }}</h2>
        <div class="arch-flow">
          <template v-for="(item, i) in product.content.architecture.items" :key="i">
            <div class="arch-item">
              <span class="arch-item__title">{{ item.title }}</span>
              <span class="arch-item__subtitle">{{ item.subtitle }}</span>
            </div>
            <svg v-if="i < product.content.architecture.items.length - 1" class="arch-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 4l6 6-6 6" stroke="#58cc02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
        </div>
        <p class="arch-desc">{{ product.content.architecture.description }}</p>
      </section>

      <section class="tech-section">
        <span class="section-badge section-badge--orange">{{ product.content.tech_stack.badge }}</span>
        <h2 class="section-heading">{{ product.content.tech_stack.heading }}</h2>
        <div class="tech-grid">
          <div
            v-for="(item, i) in product.content.tech_stack.items"
            :key="i"
            class="tech-card"
          >
            <span class="tech-category">{{ item.category }}</span>
            <span class="tech-title">{{ item.title }}</span>
          </div>
        </div>
      </section>

      <section class="oss-section">
        <div class="oss-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M19 8l-7 8-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 class="oss-heading">{{ product.content.open_source.heading }}</h2>
        <p class="oss-description">{{ product.content.open_source.description }}</p>
        <a
          :href="product.content.open_source.github_url"
          target="_blank"
          class="oss-btn"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 1.5l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13 5.5H5a3 3 0 0 0-3 3v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ product.content.open_source.button_text }}
        </a>
      </section>
    </div>
  </main>
  <AppFooter />
</template>

<style scoped>
.dp-page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 80px;
}

.not-found {
  padding: 200px 80px;
  text-align: center;
  font-family: Helvetica, sans-serif;
  font-size: 18px;
  color: #6b6555;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 40px 0 0;
}

.breadcrumbs__link {
  color: #6b6555;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  font-family: Helvetica, sans-serif;
}

.breadcrumbs__chevron {
  flex-shrink: 0;
}

.breadcrumbs__current {
  color: #ff4d00;
  font-size: 14px;
  font-weight: 700;
  font-family: Helvetica, sans-serif;
}

.hero-section {
  padding: 40px 0 80px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
}

.hero-badge {
  font-size: 12px;
  font-weight: 400;
  font-family: Helvetica, sans-serif;
}

.hero-heading {
  font-size: 60px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: Helvetica, sans-serif;
  margin: 0;
  line-height: 1.1;
  white-space: pre-line;
}

.hero-description {
  font-size: 16px;
  line-height: 1.5;
  color: #6b6555;
  font-family: Helvetica, sans-serif;
  margin: 0;
}

.section-badge {
  font-size: 12px;
  font-weight: 400;
  color: #ff4d00;
  font-family: Helvetica, sans-serif;
}

.section-badge--orange {
  color: #ff4d00;
}

.section-heading {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: Helvetica, sans-serif;
  margin: 0;
}

.features-section {
  padding: 0 0 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background: #fff;
  border: 1px solid #1a1a1a;
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon__svg {
  width: 20px;
  height: 20px;
  color: #0a0a0a;
}

.feature-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: Helvetica, sans-serif;
  margin: 0;
}

.feature-desc {
  font-size: 13px;
  line-height: 1.5;
  color: #6b6555;
  font-family: Helvetica, sans-serif;
  margin: 0;
}

.arch-section {
  background: #1a1a1a;
  margin: 0 -80px;
  padding: 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.arch-badge {
  font-size: 12px;
  font-weight: 400;
  color: #58cc02;
  font-family: Helvetica, sans-serif;
}

.arch-heading {
  font-size: 36px;
  font-weight: 700;
  color: #f5f0e8;
  font-family: Helvetica, sans-serif;
  margin: 0;
}

.arch-flow {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.arch-item {
  background: #f5f0e8;
  border: 1px solid #f5f0e8;
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  min-width: 200px;
}

.arch-item__title {
  font-size: 11px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: Helvetica, sans-serif;
}

.arch-item__subtitle {
  font-size: 11px;
  font-weight: 400;
  color: #1a1a1a;
  font-family: Helvetica, sans-serif;
}

.arch-arrow {
  flex-shrink: 0;
}

.arch-desc {
  font-size: 13px;
  line-height: 1.6;
  color: #f5f0e8;
  font-family: Helvetica, sans-serif;
  max-width: 1200px;
  margin: 0;
}

.tech-section {
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.tech-card {
  background: #fff;
  border: 1px solid #1a1a1a;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tech-category {
  font-size: 11px;
  font-weight: 400;
  color: #6b6555;
  font-family: Helvetica, sans-serif;
}

.tech-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: Helvetica, sans-serif;
}

.oss-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px;
  text-align: center;
  border-top: 1px solid #1a1a1a;
}

.oss-icon {
  width: 64px;
  height: 64px;
  background: #1a1a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.oss-heading {
  font-size: 30px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: Helvetica, sans-serif;
  margin: 0;
}

.oss-description {
  font-size: 14px;
  line-height: 1.5;
  color: #6b6555;
  font-family: Helvetica, sans-serif;
  max-width: 500px;
  margin: 0;
}

.oss-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1a1a1a;
  color: #fff;
  text-decoration: none;
  padding: 14px 32px;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 700;
  font-family: Helvetica, sans-serif;
  box-shadow: 0 4px 0 rgba(0,0,0,0.3);
}
</style>
