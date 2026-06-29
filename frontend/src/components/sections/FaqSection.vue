<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface FaqItem {
  question: string
  answer: string
}

interface FaqData {
  label: string
  title: string
  items: FaqItem[]
}

const data = ref<FaqData | null>(null)
const openIndex = ref<number | null>(null)

const cardBgColors = ['#fff0eb', '#fffbe8', '#eafff3', '#f0edff', '#fff0eb', '#eafff3']
const cardShadowColors = ['#e8d0c4', '#e8dcc4', '#c4e8d8', '#d0c8e8', '#e8d0c4', '#c4e8d8']

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}

onMounted(async () => {
  try {
    const res = await fetch('/api/content/faq')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data" class="faq">
    <div class="faq__inner">
      <div class="faq__header">
        <span class="faq__label">{{ data.label }}</span>
        <h2 class="faq__title">{{ data.title }}</h2>
      </div>
      <ul class="faq__grid">
        <li
          v-for="(item, i) in data.items"
          :key="i"
          class="faq-item"
          :class="{ 'faq-item--open': openIndex === i }"
          :style="{
            background: cardBgColors[i],
            boxShadow: `0 5px 0 ${cardShadowColors[i]}`,
          }"
          v-show="openIndex === null || openIndex === i"
        >
          <button class="faq-item__button" @click="toggle(i)" :aria-expanded="openIndex === i" :aria-controls="`faq-answer-${i}`">
            <span class="faq-item__question">{{ item.question }}</span>
            <span class="faq-item__icon" :class="{ 'faq-item__icon--open': openIndex === i }">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <line x1="3.5" y1="8" x2="12.5" y2="8" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>
                <line v-if="openIndex !== i" x1="8" y1="3.5" x2="8" y2="12.5" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </span>
          </button>
          <div v-if="openIndex === i" class="faq-item__answer" :id="`faq-answer-${i}`">
            {{ item.answer }}
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.faq {
  background: var(--bg);
  padding: 80px 208px;
}

.faq__inner {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-items: center;
}

.faq__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.faq__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-bold);
  color: var(--accent);
  text-transform: uppercase;
}

.faq__title {
  font-family: var(--font-heading);
  font-size: var(--text-5xl);
  font-weight: var(--fw-black);
  color: var(--text-dark);
  margin: 0;
  text-align: center;
}

.faq__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
}

.faq-item {
  border-radius: 16px;
  overflow: hidden;
}

.faq-item--open {
  grid-column: 1 / -1;
}

.faq-item--open .faq-item__answer {
  padding: 0 24px 24px;
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.faq-item__button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: none;
  border: none;
  cursor: pointer;
  gap: 16px;
}

.faq-item__question {
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  font-weight: var(--fw-black);
  color: var(--text-dark);
  text-align: left;
}

.faq-item__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  transition: transform 0.3s;
}

.faq-item__icon--open {
  transform: rotate(45deg);
}

.faq-item__answer {
  padding: 0 16px 16px;
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: var(--text-muted);
  line-height: var(--leading-normal);
}

@media (max-width: 768px) {
  .faq {
    padding: 40px 16px;
  }

  .faq__title {
    font-size: var(--text-2xl);
  }

  .faq__grid {
    grid-template-columns: 1fr;
  }
}
</style>
