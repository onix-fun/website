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
      <div class="faq__grid">
        <div
          v-for="(item, i) in data.items"
          :key="i"
          class="faq-item"
          :style="{
            background: cardBgColors[i],
            boxShadow: `0 5px 0 ${cardShadowColors[i]}`,
          }"
        >
          <button class="faq-item__button" @click="toggle(i)">
            <span class="faq-item__question">{{ item.question }}</span>
            <span class="faq-item__icon" :class="{ 'faq-item__icon--open': openIndex === i }">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <line x1="3.5" y1="8" x2="12.5" y2="8" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>
                <line v-if="openIndex !== i" x1="8" y1="3.5" x2="8" y2="12.5" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </span>
          </button>
          <div v-if="openIndex === i" class="faq-item__answer">
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  background: var(--bg);
  padding: 144px 208px;
}

.faq__inner {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  gap: 64px;
  align-items: center;
}

.faq__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.faq__label {
  font-family: var(--font-heading);
  font-size: 9px;
  font-weight: 900;
  color: var(--white);
  background: var(--accent);
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.faq__title {
  font-family: var(--font-heading);
  font-size: 64px;
  font-weight: 900;
  color: var(--text-dark);
  margin: 0;
  padding-top: 12px;
  text-align: center;
}

.faq__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  width: 100%;
}

.faq-item {
  width: 312px;
  border-radius: 16px;
  overflow: hidden;
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
  font-size: 14px;
  font-weight: 900;
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
  font-size: 12px;
  font-weight: 400;
  color: var(--text-muted);
  line-height: 1.5;
}
</style>
