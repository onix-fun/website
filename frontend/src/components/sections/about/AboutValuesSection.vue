<script setup lang="ts">
import { onMounted, ref } from 'vue'

import AppIcon from '@/components/icons/AppIcon.vue'

interface ValueCard {
  title: string
  description: string
  color: string
}

interface AboutValuesData {
  label: string
  values: ValueCard[]
}

const data = ref<AboutValuesData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/about_values')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})

function valueIcon(title: string): string {
  const normalized = title.toLowerCase()
  if (normalized.includes('чест')) return 'honesty'
  if (normalized.includes('каче')) return 'quality'
  if (normalized.includes('уник')) return 'sparkles'
  if (normalized.includes('диалог')) return 'dialog'
  return 'check'
}
</script>

<template>
  <section v-if="data" class="av">
    <div class="av__inner">
      <span class="av__label">{{ data.label }}</span>
      <div class="av__grid">
        <article v-for="(v, i) in data.values" :key="i" class="av__card">
          <div class="av__card-icon" :style="{ background: v.color }">
            <AppIcon :name="valueIcon(v.title)" :size="22" :stroke-width="2" />
          </div>
          <h3 class="av__card-title">{{ v.title }}</h3>
          <p class="av__card-desc">{{ v.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.av {
  background: #f5f0e8;
  padding: 0 80px 80px;
}

.av__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.av__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: #ff4d00;
}

.av__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.av__card {
  border: 1px solid #1a1a1a;
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.av__card-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #ffffff;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.16);
}

.av__card-title {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--fw-bold);
  color: #1a1a1a;
  margin: 0;
}

.av__card-desc {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: #6b6555;
  margin: 0;
  line-height: var(--leading-normal);
  white-space: pre-line;
}
</style>
