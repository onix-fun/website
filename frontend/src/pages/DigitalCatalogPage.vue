<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import type { HeaderItem } from '@/components/header/types'
import CatalogIcon from '@/assets/icons/catalog.svg'
import AboutIcon from '@/assets/icons/about.svg'
import ProcessIcon from '@/assets/icons/process.svg'
import DigitalCatalogIcon from '@/assets/icons/digital-catalog.svg'
import ConstructorIcon from '@/assets/icons/constructor.svg'

const router = useRouter()

const navItems: HeaderItem[] = [
  { id: 'about', to: '/about', title: 'About', icon: AboutIcon },
  { id: 'catalog', to: '/catalog', title: 'Catalog', icon: CatalogIcon },
  { id: 'process', to: '/process', title: 'Process', icon: ProcessIcon },
  { id: 'digital-catalog', to: '/digital-catalog', title: 'Digital Catalog', icon: DigitalCatalogIcon },
  { id: 'constructor', to: '/constructor', title: 'Constructor', icon: ConstructorIcon },
]

interface DigitalProduct {
  id: number
  slug: string
  number: number
  title: string
  subtitle: string
  description: string
}

const products = ref<DigitalProduct[]>([])

onMounted(async () => {
  try {
    const res = await fetch('/api/digital-catalog')
    products.value = await res.json()
  } catch {
    products.value = []
  }
})

function goToProduct(slug: string) {
  router.push(`/digital-catalog/${slug}`)
}
</script>

<template>
  <AppHeader logo="/favicon.svg" :items="navItems" />
  <main>
    <div class="dc-page">
      <nav class="breadcrumbs">
        <router-link to="/" class="breadcrumbs__link">Главная</router-link>
        <svg class="breadcrumbs__chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3.5L8.5 7L5 10.5" stroke="#717182" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="breadcrumbs__current">Цифровые продукты</span>
      </nav>
      <section class="hero-cta">
        <div class="cta-blur cta-blur--purple"></div>
        <div class="cta-blur cta-blur--orange"></div>
        <span class="cta-badge">ЦИФРОВЫЕ ПРОДУКТЫ</span>
        <h2 class="cta-heading">Open-source<br>инфраструктура</h2>
        <p class="cta-description">
          Sparrow разрабатывает не только светильники. Наши цифровые продукты — открытые, модульные и готовые к использованию.
        </p>
      </section>

      <section v-if="products.length" class="cards-section">
        <div
          v-for="p in products"
          :key="p.id"
          class="product-card"
        >
          <div class="product-card__number">{{ String(p.number).padStart(2, '0') }}</div>
          <div class="product-card__icon" :class="`product-card__icon--${p.slug}`">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="10" y="10" width="20" height="20" rx="10" fill="currentColor"/>
              <text x="20" y="25" text-anchor="middle" fill="#fff" font-size="14" font-weight="700" font-family="Helvetica">{{ p.number }}</text>
            </svg>
          </div>
          <h2 class="product-card__title">{{ p.title }}</h2>
          <p class="product-card__subtitle">{{ p.subtitle }}</p>
          <p class="product-card__description">{{ p.description }}</p>
          <button
            class="product-card__btn"
            :class="`product-card__btn--${p.slug}`"
            @click="goToProduct(p.slug)"
          >
            ПОДРОБНЕЕ →
          </button>
        </div>
      </section>
    </div>
  </main>
  <AppFooter />
</template>

<style scoped>
.dc-page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 80px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 40px 0 48px;
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

.cards-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 80px 0;
}

.product-card {
  background: #fff;
  border-radius: 24px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  box-shadow: -1px 8px 0 rgba(0,0,0,0.1);
}

.product-card__number {
  font-size: 40px;
  font-weight: 700;
  font-family: Helvetica, sans-serif;
  color: #1a1a1a;
}

.product-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card__icon--air {
  color: #58cc02;
}

.product-card__icon--account {
  color: #7b61ff;
}

.product-card__title {
  font-size: 24px;
  font-weight: 700;
  font-family: Helvetica, sans-serif;
  color: #1a1a1a;
  margin: 0;
}

.product-card__subtitle {
  font-size: 13px;
  font-weight: 700;
  color: #6b6555;
  font-family: Helvetica, sans-serif;
  margin: 0;
}

.product-card__description {
  font-size: 14px;
  line-height: 1.5;
  color: #6b6555;
  font-family: Helvetica, sans-serif;
  margin: 0;
}

.product-card__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 14px 32px;
  border: none;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 700;
  font-family: Helvetica, sans-serif;
  cursor: pointer;
  color: #fff;
  box-shadow: 0 4px 0 0;
}

.product-card__btn--air {
  background: #58cc02;
  box-shadow-color: #3e9e00;
}

.product-card__btn--account {
  background: #7b61ff;
  box-shadow-color: #584a9f;
}

.hero-cta {
  position: relative;
  background: #1a1a1a;
  border-radius: 0;
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
