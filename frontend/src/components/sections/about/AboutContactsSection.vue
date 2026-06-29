<script setup lang="ts">
import { onMounted, ref } from 'vue'

import AppIcon from '@/components/icons/AppIcon.vue'
import AppButton from '@/components/AppButton.vue'

interface ContactItem {
  label: string
  value: string
}

interface Cta {
  text: string
  link: string
}

interface AboutContactsData {
  label: string
  title: string
  contacts: ContactItem[]
  cta: Cta
}

const data = ref<AboutContactsData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/about_contacts')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})

function contactIcon(label: string): string {
  const normalized = label.toLowerCase()
  if (normalized.includes('mail') || normalized.includes('почт') || normalized.includes('email')) return 'mail'
  if (normalized.includes('тел') || normalized.includes('phone')) return 'phone'
  if (normalized.includes('адрес') || normalized.includes('локац') || normalized.includes('город')) return 'map-pin'
  return 'chat'
}
</script>

<template>
  <section v-if="data" class="ac">
    <div class="ac__inner">
      <div class="ac__content">
        <span class="ac__label">{{ data.label }}</span>
        <h2 class="ac__title">{{ data.title }}</h2>
        <div class="ac__list">
          <div v-for="(c, i) in data.contacts" :key="i" class="ac__item">
            <span class="ac__item-icon">
              <AppIcon :name="contactIcon(c.label)" :size="18" :stroke-width="2" />
            </span>
            <span class="ac__item-text">
              <span class="ac__item-label">{{ c.label }}</span>
              <span class="ac__item-value">{{ c.value }}</span>
            </span>
          </div>
        </div>
        <AppButton variant="orange" size="lg" :href="data.cta.link">
          {{ data.cta.text }}
          <AppIcon name="arrow-right" :size="14" :stroke-width="2" />
        </AppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ac {
  background: #f5f0e8;
  padding: 0 80px 80px;
}

.ac__inner {
  max-width: 1280px;
  margin: 0 auto;
}

.ac__content {
  max-width: 372px;
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.ac__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: #ff4d00;
}

.ac__title {
  font-family: var(--font-body);
  font-size: var(--text-5xl);
  font-weight: var(--fw-bold);
  color: #1a1a1a;
  margin: 0;
  white-space: pre-line;
  line-height: var(--leading-tight);
}

.ac__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ac__item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ac__item-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #1a1a1a;
  color: #f5f0e8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ac__item-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.ac__item-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: #6b6555;
}

.ac__item-value {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--fw-bold);
  color: #1a1a1a;
}

</style>
