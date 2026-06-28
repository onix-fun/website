<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import type { HeaderItem } from '@/components/header/types'
import AboutIcon from '@/assets/icons/about.svg'
import CatalogIcon from '@/assets/icons/catalog.svg'
import ProcessIcon from '@/assets/icons/process.svg'
import DigitalCatalogIcon from '@/assets/icons/digital-catalog.svg'
import ConstructorIcon from '@/assets/icons/constructor.svg'

const navItems: HeaderItem[] = [
  { id: 'about', to: '/about', title: 'About', icon: AboutIcon },
  { id: 'catalog', to: '/catalog', title: 'Catalog', icon: CatalogIcon },
  { id: 'process', to: '/process', title: 'Process', icon: ProcessIcon },
  { id: 'digital-catalog', to: '/digital-catalog', title: 'Digital Catalog', icon: DigitalCatalogIcon },
  { id: 'constructor', to: '/constructor', title: 'Constructor', icon: ConstructorIcon },
]

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

interface ProductData {
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

const route = useRoute()
const product = ref<ProductData | null>(null)
const activeThumb = ref(0)

onMounted(async () => {
  try {
    const res = await fetch(`/api/catalog/${route.params.slug}`)
    if (!res.ok) throw new Error('not found')
    product.value = await res.json()
  } catch {
    product.value = null
  }
})

const priceFormatted = computed(() => {
  if (!product.value) return ''
  return product.value.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'
})

const details = computed(() => product.value?.details)

const mainImageBg = computed(() => {
  if (activeThumb.value === 0) return product.value?.bg_color || '#f0edff'
  return product.value?.details?.gallery?.[activeThumb.value]?.bg_color || '#f0edff'
})
</script>

<template>
  <AppHeader logo="/favicon.svg" :items="navItems" />
  <main>
    <template v-if="product && details">
      <div class="page">
        <nav class="breadcrumbs">
          <router-link to="/" class="breadcrumbs__link">Главная</router-link>
          <svg class="breadcrumbs__chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3.5L8.5 7L5 10.5" stroke="#717182" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <router-link to="/catalog" class="breadcrumbs__link">Каталог</router-link>
          <svg class="breadcrumbs__chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3.5L8.5 7L5 10.5" stroke="#717182" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <router-link :to="`/catalog?category=${product.category_slug}`" class="breadcrumbs__link">{{ product.category }}</router-link>
          <svg class="breadcrumbs__chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3.5L8.5 7L5 10.5" stroke="#717182" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="breadcrumbs__current">{{ product.name }}</span>
        </nav>

        <section class="product-hero">
          <div class="product-hero__gallery">
            <div class="gallery__main" :style="{ background: mainImageBg, boxShadow: `0 8px 0 ${mainImageBg === '#f0edff' ? '#d0c8e8' : '#d0c8e8'}` }">
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
                <div class="thumb__inner" :style="{ background: thumb.bg_color || '#f0edff' }" />
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
              <span class="price__label">Ориентировочная стоимость</span>
              <span class="price__value">{{ priceFormatted }}</span>
              <div v-if="details.lead_time" class="price__lead-time">
                <span class="green-dot" />
                <span>{{ details.lead_time }}</span>
              </div>
            </div>

            <div class="info__actions">
              <button class="btn btn--orange">ОФОРМИТЬ ПРЕДЗАКАЗ</button>
              <router-link to="/constructor" class="btn btn--green">СДЕЛАТЬ ПОХОЖИЙ</router-link>
            </div>
          </div>
        </section>
      </div>

      <section class="specs">
        <div class="specs__inner">
          <span class="section-label">ХАРАКТЕРИСТИКИ</span>
          <h2 class="section-title">Технические данные</h2>
          <div class="specs__grid">
            <div v-for="(spec, i) in details.specifications" :key="i" class="specs__row">
              <span class="specs__label">{{ spec.label }}</span>
              <span class="specs__value">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="box">
        <div class="box__inner">
          <div class="box__left">
            <span class="section-label">КОМПЛЕКТАЦИЯ</span>
            <h2 class="section-title">В коробке</h2>
            <ul class="box__list">
              <li v-for="(item, i) in details.box_contents" :key="i" class="box__item">
                <span class="box__dot" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
          <div class="box__right">
            <div class="box__image" :style="{ background: product.bg_color || '#f0edff', boxShadow: `0 8px 0 ${product.bg_color === '#f0edff' ? '#d0c8e8' : '#d0c8e8'}` }">
              <div class="box__placeholder" />
            </div>
          </div>
        </div>
      </section>

      <section class="story">
        <div class="story__inner">
          <span class="section-label">ОБ ИЗДЕЛИИ</span>
          <h2 class="section-title">История модели</h2>
          <div class="story__paragraphs">
            <p v-for="(p, i) in details.story_paragraphs" :key="i" class="story__p">{{ p }}</p>
          </div>
        </div>
      </section>
    </template>

    <div v-else-if="product === null" class="not-found">
      <p>Товар не найден</p>
    </div>
    <div v-else class="loading">
      <p>Загрузка...</p>
    </div>
  </main>
  <AppFooter />
</template>

<style scoped>
.page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 80px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 24px 0 0;
  height: 44px;
}

.breadcrumbs__link {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-muted);
  text-decoration: none;
}

.breadcrumbs__chevron {
  flex-shrink: 0;
}

.breadcrumbs__current {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
}

.product-hero {
  display: flex;
  gap: 80px;
  padding: 64px 0;
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
  font-size: 9px;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.badge--orange {
  background: var(--accent);
  box-shadow: 0 3px 0 var(--accent-shadow);
}

.badge--dark {
  background: var(--bg-dark);
}

.info__title {
  font-family: var(--font-body);
  font-size: 60px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
  line-height: 1.1;
}

.info__description {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
  max-width: 440px;
}

.info__price {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price__label {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 400;
  color: var(--text-muted);
}

.price__value {
  font-family: var(--font-body);
  font-size: 48px;
  font-weight: 700;
  color: var(--text-dark);
}

.price__lead-time {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 4px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 400;
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
  font-size: 10px;
  font-weight: 700;
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

.specs {
  background: var(--bg-dark);
  padding: 80px 80px;
}

.specs__inner {
  max-width: 1280px;
  margin: 0 auto;
}

.box {
  background: var(--bg);
  padding: 80px 80px;
}

.box__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  gap: 80px;
}

.box__left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.box__right {
  width: 600px;
  flex-shrink: 0;
}

.section-label {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 400;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-title {
  font-family: var(--font-body);
  font-size: 36px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.specs .section-title {
  color: var(--bg);
}

.box .section-title {
  color: var(--text-dark);
}

.story .section-title {
  color: var(--bg);
}

.specs__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  padding-top: 24px;
}

.specs__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg);
  padding: 20px 32px;
  border: 1px solid var(--bg);
  min-height: 62px;
}

.specs__label {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 400;
  color: var(--text-dark);
}

.specs__value {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-dark);
}

.box__list {
  list-style: none;
  padding: 16px 0 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.box__item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  color: var(--text-dark);
}

.box__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

.box__image {
  width: 600px;
  height: 320px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.box__placeholder {
  width: 256px;
  height: 144px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
}

.story {
  background: var(--bg-dark);
  padding: 80px 320px;
}

.story__inner {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.story__paragraphs {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 16px;
}

.story__p {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  color: var(--bg);
  margin: 0;
  line-height: 1.5;
}

.not-found, .loading {
  text-align: center;
  padding: 120px 80px;
  color: var(--text-muted);
  font-size: 14px;
}
</style>
