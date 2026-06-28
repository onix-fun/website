<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

interface DigitalProduct {
  id: number
  slug: string
  number: number
  title: string
  subtitle: string
  description: string
}

const router = useRouter()
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
  <section v-if="products.length" class="cards-section">
    <div v-for="p in products" :key="p.id" class="product-card">
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
      <button class="product-card__btn" :class="`product-card__btn--${p.slug}`" @click="goToProduct(p.slug)">
        ПОДРОБНЕЕ →
      </button>
    </div>
  </section>
</template>

<style scoped>
.cards-section {
  max-width: 1440px;
  margin: 0 auto;
  padding: 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
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
</style>
