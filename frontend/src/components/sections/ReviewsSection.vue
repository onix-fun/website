<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Review {
  id: number
  name: string
  city: string
  text: string
  color: string
}

interface ReviewsData {
  label: string
  title: string
  rating: number
  review_count: number
  reviews: Review[]
}

const data = ref<ReviewsData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/reviews')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})

function stars(rating: number): string[] {
  return Array.from({ length: 5 }, (_, i) => i < Math.round(rating) ? '★' : '☆')
}
</script>

<template>
  <section v-if="data" class="reviews">
    <div class="reviews__inner">
      <div class="reviews__header">
        <div class="reviews__header-left">
          <span class="reviews__label">{{ data.label }}</span>
          <div class="reviews__title-row">
            <h2 class="reviews__title">{{ data.title }}</h2>
            <div class="reviews__rating-pill">
              <span class="reviews__rating-number">{{ data.rating }}</span>
              <span class="reviews__stars">
                <span v-for="(s, i) in stars(data.rating)" :key="i">{{ s }}</span>
              </span>
              <span class="reviews__count">{{ data.review_count }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="reviews__grid">
        <div
          v-for="review in data.reviews"
          :key="review.id"
          class="review-card"
          :style="{ background: review.color }"
        >
          <div class="review-card__author">
            <div class="review-card__avatar" :style="{ background: review.color }">
              <span class="review-card__avatar-letter">{{ review.name.charAt(0) }}</span>
            </div>
            <div class="review-card__meta">
              <span class="review-card__name">{{ review.name }}</span>
              <span class="review-card__city">{{ review.city }}</span>
            </div>
          </div>
          <div class="review-card__stars">
            <span v-for="i in 5" :key="i">★</span>
          </div>
          <p class="review-card__text">"{{ review.text }}"</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reviews {
  background: var(--bg-dark);
  padding: 70px 80px 118px;
}

.reviews__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  gap: 64px;
}

.reviews__header {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 8px;
}

.reviews__label {
  font-family: var(--font-heading);
  font-size: 9px;
  font-weight: 900;
  color: var(--white);
  background: var(--accent);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
  text-transform: uppercase;
}

.reviews__title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.reviews__title {
  font-family: var(--font-heading);
  font-size: 64px;
  font-weight: 900;
  color: var(--bg);
  margin: 0;
  line-height: 1.1;
  padding-top: 12px;
}

.reviews__rating-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  padding: 10px 20px;
  border-radius: 999px;
  box-shadow: 0 4px 0 var(--accent-shadow);
}

.reviews__rating-number {
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 900;
  color: var(--white);
}

.reviews__stars {
  display: flex;
  gap: 2px;
  color: var(--yellow);
  font-size: 12px;
}

.reviews__count {
  font-size: 8px;
  font-weight: 600;
  color: var(--white);
}

.reviews__grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.review-card {
  flex: 1;
  min-width: 280px;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 6px 0 rgba(0,0,0,0.3);
}

.review-card__author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-card__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 0 rgba(0,0,0,0.15);
}

.review-card__avatar-letter {
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 900;
  color: var(--white);
}

.review-card__meta {
  display: flex;
  flex-direction: column;
}

.review-card__name {
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 900;
  color: var(--bg);
}

.review-card__city {
  font-size: 10px;
  font-weight: 400;
  color: var(--bg);
  opacity: 0.8;
}

.review-card__stars {
  display: flex;
  gap: 2px;
  color: var(--yellow);
  font-size: 12px;
}

.review-card__text {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: var(--bg);
  line-height: 1.6;
}
</style>
