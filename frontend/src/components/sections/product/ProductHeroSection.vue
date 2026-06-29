<script setup lang="ts">
import { computed, inject, onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

interface Spec {
  label: string
  value: string
}

interface GalleryItem {
  image_url: string
  bg_color: string
}

interface ProductDetails {
  description: string
  subtitle: string
  badge_text: string
  lead_time: string
  gallery: GalleryItem[]
  specifications: Spec[]
  box_contents: string[]
  story_paragraphs: string[]
}

export interface ProductData {
  id: number
  name: string
  name_ru: string
  slug: string
  price: number
  image_url: string
  badge: string
  colors: string[]
  bg_color: string
  category_id: number
  in_stock: boolean
  category: string
  category_slug: string
  details: ProductDetails
}

interface ContentData {
  price_label: string
  buttons: { order: string; similar: string }
  loading: string
  not_found: string
}

defineProps<{ notFound: boolean }>()

const router = useRouter()
const product = inject<Ref<ProductData | null>>('product')
const activeThumb = ref(0)

function goToPreorder() {
  if (product?.value?.slug) {
    router.push(`/checkout?product=${product.value.slug}`)
  }
}

const content = ref<ContentData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/product_hero_section')
    if (res.ok) content.value = await res.json()
  } catch {}
})

const priceFormatted = computed(() => {
  if (!product?.value) return ''
  return product.value.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'
})

const details = computed(() => product?.value?.details)

const mainImageBg = computed(() => {
  if (!product?.value) return '#f0edff'
  if (activeThumb.value === 0) return product.value.bg_color || '#f0edff'
  return product.value.details?.gallery?.[activeThumb.value]?.bg_color || '#f0edff'
})
</script>

<template>
  <div v-if="notFound" class="not-found">{{ content?.not_found || 'Товар не найден' }}</div>
  <section v-else-if="product && details" class="product-hero">
    <div class="product-hero__gallery">
      <div class="gallery__main" :style="{ background: mainImageBg, boxShadow: `0 8px 0 ${mainImageBg === '#f0edff' ? '#d0c8e8' : mainImageBg}` }">
        <div v-if="activeThumb === 0 && product.image_url" class="gallery__img" :style="{ backgroundImage: `url(${product.image_url})` }" />
        <div v-else-if="details.gallery?.[activeThumb]?.image_url" class="gallery__img" :style="{ backgroundImage: `url(${details.gallery[activeThumb].image_url})` }" />
        <div v-else class="gallery__placeholder" />
      </div>
      <div v-if="details.gallery?.length" class="gallery__thumbs">
        <button
          v-for="(thumb, i) in details.gallery"
          :key="i"
          class="thumb"
          :class="{ 'thumb--active': activeThumb === i }"
          :style="{ borderColor: activeThumb === i ? 'var(--accent)' : '#000' }"
          @click="activeThumb = i"
        >
          <div
            class="thumb__inner"
            :style="{
              background: thumb.bg_color || '#f0edff',
              backgroundImage: thumb.image_url ? `url(${thumb.image_url})` : undefined
            }"
          />
        </button>
      </div>
    </div>
    <div class="product-hero__info">
      <div class="info__badges">
        <span v-if="details.badge_text" class="badge badge--orange">{{ details.badge_text }}</span>
        <span v-if="details.subtitle" class="badge badge--dark">{{ details.subtitle }}</span>
      </div>
      <h1 class="info__title">{{ product.name }}</h1>
      <p v-if="details.description" class="info__description">{{ details.description }}</p>
      <div class="info__price">
        <span class="price__label">{{ content?.price_label || 'Ориентировочная стоимость' }}</span>
        <span class="price__value">{{ priceFormatted }}</span>
        <div v-if="details.lead_time" class="price__lead-time">
          <span class="green-dot" />
          <span>{{ details.lead_time }}</span>
        </div>
      </div>
      <div class="info__actions">
        <button class="btn btn--orange" @click="goToPreorder">{{ content?.buttons?.order || 'ОФОРМИТЬ ПРЕДЗАКАЗ' }}</button>
        <router-link to="/constructor" class="btn btn--green">{{ content?.buttons?.similar || 'СДЕЛАТЬ ПОХОЖИЙ' }}</router-link>
      </div>
    </div>
  </section>
  <div v-else class="loading">{{ content?.loading || 'Загрузка...' }}</div>
</template>

<style scoped>
.product-hero {
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px 80px;
  display: flex;
  gap: 80px;
  align-items: flex-start;
}

.product-hero__gallery {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 600px;
  flex-shrink: 0;
}

.gallery__main {
  width: 600px;
  height: 520px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.gallery__img {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.gallery__placeholder {
  width: 320px;
  height: 180px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
}

.gallery__thumbs {
  display: flex;
  gap: 12px;
}

.thumb {
  width: 100px;
  height: 100px;
  border-radius: 16px;
  border: 2px solid #000;
  overflow: hidden;
  padding: 0;
  background: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.thumb--active {
  border-color: var(--accent);
}

.thumb__inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.product-hero__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 8px;
}

.info__badges {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.badge {
  padding: 6px 14px;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: var(--text-2xs);
  font-weight: var(--fw-bold);
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.badge--orange {
  background: var(--accent);
  box-shadow: 0 3px 0 var(--accent-shadow);
  font-family: var(--font-body);
  font-size: var(--text-2xs);
  font-weight: var(--fw-bold);
  color: var(--white);
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 999px;
}

.badge--dark {
  background: var(--bg-dark);
  font-family: var(--font-body);
  font-size: var(--text-2xs);
  font-weight: var(--fw-bold);
  color: var(--white);
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 999px;
}

.info__title {
  font-family: var(--font-body);
  font-size: var(--text-6xl);
  font-weight: var(--fw-bold);
  color: var(--text-dark);
  margin: 0;
  line-height: var(--leading-tight);
}

.info__description {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--fw-regular);
  color: var(--text-muted);
  margin: 0;
  line-height: var(--leading-normal);
  max-width: 440px;
}

.info__price {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: var(--text-muted);
}

.price__value {
  font-family: var(--font-body);
  font-size: var(--text-5xl);
  font-weight: var(--fw-bold);
  color: var(--text-dark);
}

.price__lead-time {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 4px;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: var(--text-muted);
}

.green-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--green);
  flex-shrink: 0;
}

.info__actions {
  display: flex;
  gap: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: var(--text-2xs);
  font-weight: var(--fw-bold);
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(1px);
}

.btn--orange {
  background: var(--accent);
  box-shadow: 0 4px 0 var(--accent-shadow);
}

.btn--green {
  background: var(--green);
  box-shadow: 0 4px 0 var(--green-shadow);
}

.loading, .not-found {
  text-align: center;
  padding: 120px 80px;
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
