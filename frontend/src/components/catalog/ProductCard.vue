<script setup lang="ts">
import { computed } from 'vue'

export interface Product {
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
}

const props = defineProps<{ product: Product }>()

const shadowColor = computed(() => {
  const bg = props.product.bg_color || '#fff0eb'
  return darken(bg, 20)
})

function darken(hex: string, amount: number): string {
  const c = hex.replace('#', '')
  const r = Math.max(0, parseInt(c.substring(0, 2), 16) - amount)
  const g = Math.max(0, parseInt(c.substring(2, 4), 16) - amount)
  const b = Math.max(0, parseInt(c.substring(4, 6), 16) - amount)
  return `rgb(${r}, ${g}, ${b})`
}

const priceFormatted = computed(() => {
  return props.product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'
})

const badgeStyle = computed(() => {
  if (props.product.badge === 'ПРЕМИУМ') {
    return { background: 'var(--purple)' }
  }
  return { background: 'var(--accent)' }
})

const productName = computed(() => props.product.name)

const productNameRu = computed(() => props.product.name_ru)
</script>

<template>
  <router-link :to="`/catalog/${product.slug}`" class="card" :style="{ background: product.bg_color, boxShadow: `0 8px 0 ${shadowColor}` }">
    <div class="card__image" :style="{ background: product.bg_color }">
      <div v-if="product.image_url" class="card__img-el" :style="{ backgroundImage: `url(${product.image_url})` }" />
      <div v-else class="card__img-placeholder" />

      <div v-if="product.badge" class="card__badge" :style="badgeStyle">
        {{ product.badge }}
      </div>

      <div v-if="product.colors.length" class="card__colors">
        <span
          v-for="(color, i) in product.colors"
          :key="i"
          class="card__color-dot"
          :style="{ background: color }"
        />
      </div>
    </div>

    <div class="card__info">
      <div class="card__header">
        <div class="card__names">
          <span class="card__name">{{ productName }}</span>
          <span class="card__name-ru">{{ productNameRu }}</span>
        </div>
        <span class="card__price">{{ priceFormatted }}</span>
      </div>

      <div class="card__action">
        <span class="card__btn">
          ПРЕДЗАКАЗ
        </span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.card {
  width: 296px;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.card__image {
  position: relative;
  width: 100%;
  height: 288px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card__img-el {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.card__img-placeholder {
  width: 256px;
  height: 144px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
}

.card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  font-family: var(--font-heading);
  font-size: 8px;
  font-weight: 900;
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.12);
}

.card__colors {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  gap: 4px;
}

.card__color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.12);
}

.card__info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.card__names {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding-bottom: 2px;
}

.card__name {
  font-family: var(--font-heading);
  font-size: 16px;
  font-weight: 900;
  color: var(--text-dark);
}

.card__name-ru {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 400;
  color: var(--text-muted);
}

.card__price {
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 900;
  color: var(--accent);
  white-space: nowrap;
}

.card__action {
  padding-top: 4px;
}

.card__btn {
  width: 100%;
  padding: 8px 0;
  border-radius: 999px;
  background: var(--green);
  box-shadow: 0 3px 0 var(--green-shadow);
  font-family: var(--font-heading);
  font-size: 9px;
  font-weight: 900;
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card__btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 0 var(--green-shadow);
}

.card__btn:active {
  transform: translateY(1px);
  box-shadow: 0 1px 0 var(--green-shadow);
}
</style>
