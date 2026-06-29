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
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  display: inline-block;
  width: fit-content;
}

.reviews__title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.reviews__title {
  font-family: var(--font-heading);
  font-size: 48px;
  font-weight: 900;
  color: var(--bg);
  margin: 0;
  line-height: 1.1;
}

.reviews__rating-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--accent);
  padding: 6px 14px;
  border-radius: 999px;
  box-shadow: 0 4px 0 var(--accent-shadow);
}

.reviews__rating-number {
  font-family: var(--font-body);
  font-size: 20px;
  font-weight: 700;
  color: var(--white);
}

.reviews__grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.review-card {
  flex: 1;
  min-width: 289px;
  border-radius: 24px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  opacity: 0.85;
  min-height: 280px;
}

.review-card__author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-card__avatar-letter {
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 900;
  color: var(--white);
}

.review-card__meta {
  display: flex;
  flex-direction: column;
}

.review-card__name {
  font-family: var(--font-heading);
  font-size: 16px;
  font-weight: 900;
  color: var(--bg);
}

.review-card__city {
  font-size: 12px;
  font-weight: 400;
  color: var(--bg);
  opacity: 0.8;
}

.review-card__stars {
  display: flex;
  gap: 4px;
  color: var(--yellow);
  font-size: 16px;
}

.review-card__text {
  margin: 0;
  font-size: 18px;
  font-weight: 400;
  color: var(--bg);
  line-height: 1.8;
  flex: 1;
}

@media (max-width: 768px) {
  .reviews {
    padding: 40px 16px;
  }

  .reviews__title {
    font-size: 32px;
  }

  .reviews__title-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .reviews__grid {
    flex-direction: column;
  }
}
</style>
