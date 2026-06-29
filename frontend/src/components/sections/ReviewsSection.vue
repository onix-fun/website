<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'

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
const trackRef = ref<HTMLElement | null>(null)
const isPaused = ref(false)
let animationId: number | null = null
let scrollPosition = 0
const scrollSpeed = 0.5

onMounted(async () => {
  try {
    const res = await fetch('/api/content/reviews')
    data.value = await res.json()
  } catch {
    data.value = null
  }
  startAutoScroll()
})

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
})

function startAutoScroll() {
  const scroll = () => {
    if (!trackRef.value || isPaused.value) {
      animationId = requestAnimationFrame(scroll)
      return
    }
    scrollPosition += scrollSpeed
    if (scrollPosition >= trackRef.value.scrollWidth / 2) {
      scrollPosition = 0
    }
    trackRef.value.style.transform = `translateX(-${scrollPosition}px)`
    animationId = requestAnimationFrame(scroll)
  }
  animationId = requestAnimationFrame(scroll)
}

function onMouseEnter() {
  isPaused.value = true
}

function onMouseLeave() {
  isPaused.value = false
}
</script>

<template>
  <section v-if="data" class="reviews">
    <div class="reviews__inner">
      <div class="reviews__header">
        <span class="reviews__label">{{ data.label }}</span>
        <div class="reviews__title-row">
          <h2 class="reviews__title">{{ data.title }}</h2>
          <div class="reviews__rating-pill">
            <span class="reviews__rating-number">{{ data.rating }}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1l1.8 3.6 4 .6-2.9 2.8.7 4L7 10.2 3.4 12l.7-4-2.9-2.8 4-.6L7 1Z" fill="#fff" stroke="#fff" stroke-width="0.5"/>
            </svg>
          </div>
        </div>
      </div>

      <div
        class="reviews__track-wrapper"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
      >
        <ul ref="trackRef" class="reviews__track">
          <li
            v-for="review in [...data.reviews, ...data.reviews]"
            :key="review.id + '-' + Math.random()"
            class="review-card"
          >
            <div class="review-card__bg" :style="{ background: review.color }" />
            <div class="review-card__author">
              <div class="review-card__avatar" :style="{ background: review.color }">
                <span class="review-card__avatar-letter">{{ review.name.charAt(0) }}</span>
              </div>
              <div class="review-card__meta">
                <span class="review-card__name">{{ review.name }}</span>
                <span class="review-card__city">{{ review.city }}</span>
              </div>
            </div>
            <p class="review-card__text">"{{ review.text }}"</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reviews {
  background: #1a1a1a;
  padding: 70px 0 118px;
  overflow: hidden;
}

.reviews__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 80px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.reviews__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reviews__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-bold);
  color: #ff4d00;
  text-transform: uppercase;
}

.reviews__title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.reviews__title {
  font-family: var(--font-heading);
  font-size: var(--text-5xl);
  font-weight: var(--fw-black);
  color: #f5f0e8;
  margin: 0;
  line-height: var(--leading-tight);
}

.reviews__rating-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ff4d00;
  padding: 6px 14px;
  border-radius: 999px;
  box-shadow: 0 4px 0 #c84b00;
  flex-shrink: 0;
}

.reviews__rating-number {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--fw-bold);
  color: #ffffff;
  line-height: var(--leading-tight);
}

.reviews__track-wrapper {
  width: 100%;
  overflow: hidden;
  padding: 20px 0;
  margin: -20px 0;
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
}

.reviews__track {
  display: flex;
  gap: 24px;
  width: max-content;
  will-change: transform;
  list-style: none;
  padding: 10px 0;
  margin: 0;
}

.review-card {
  position: relative;
  flex: 0 0 380px;
  min-height: 280px;
  border-radius: 24px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transform: rotate(-1.5deg);
  overflow: hidden;
}

.review-card:nth-child(even) {
  transform: rotate(1.5deg);
}

.review-card__bg {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  opacity: 0.45;
  z-index: 0;
}

.review-card__author {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
}

.review-card__avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-card__avatar-letter {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: var(--fw-black);
  color: #ffffff;
}

.review-card__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.review-card__name {
  font-family: var(--font-heading);
  font-size: var(--text-md);
  font-weight: var(--fw-black);
  color: #ffffff;
}

.review-card__city {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: rgba(255, 255, 255, 0.85);
}

.review-card__text {
  position: relative;
  z-index: 1;
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--fw-regular);
  color: #ffffff;
  line-height: var(--leading-relaxed);
  flex: 1;
}

@media (max-width: 768px) {
  .reviews {
    padding: 48px 0;
  }

  .reviews__inner {
    padding: 0 16px;
    gap: 32px;
  }

  .reviews__title {
    font-size: var(--text-2xl);
  }

  .reviews__title-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .reviews__track {
    gap: 16px;
  }

  .review-card {
    flex: 0 0 300px;
    min-height: 240px;
    padding: 28px;
  }

  .review-card__text {
    font-size: var(--text-base);
  }
}
</style>
