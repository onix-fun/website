<script setup lang="ts">
import { inject, computed, onMounted, ref, type Ref } from 'vue'

interface ContentData {
  badge: string
  heading: string
}

interface ProductData {
  content?: {
    architecture?: {
      badge?: string
      heading?: string
      items: { title: string; subtitle: string }[]
      description: string
    }
  }
}

const product = inject<Ref<ProductData | null>>('digitalProduct')
const arch = computed(() => product?.value?.content?.architecture)

const content = ref<ContentData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/digital_architecture_section')
    if (res.ok) content.value = await res.json()
  } catch {}
})
</script>

<template>
  <section v-if="arch?.items?.length" class="arch-section">
    <span class="arch-badge">{{ arch.badge || content?.badge || 'КАК ЭТО РАБОТАЕТ' }}</span>
    <h2 class="arch-heading">{{ arch.heading || content?.heading || 'Архитектура системы' }}</h2>
    <div class="arch-flow">
      <template v-for="(item, i) in arch.items" :key="i">
        <div class="arch-item">
          <span class="arch-item__title">{{ item.title }}</span>
          <span class="arch-item__subtitle">{{ item.subtitle }}</span>
        </div>
        <svg v-if="i < arch.items.length - 1" class="arch-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M8 4l6 6-6 6" stroke="#58cc02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </template>
    </div>
    <p class="arch-desc">{{ arch.description }}</p>
  </section>
</template>

<style scoped>
.arch-section {
  background: #1a1a1a;
  padding: 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.arch-badge {
  font-size: 12px;
  font-weight: 400;
  color: #58cc02;
  font-family: Helvetica, sans-serif;
}

.arch-heading {
  font-size: 36px;
  font-weight: 700;
  color: #f5f0e8;
  font-family: Helvetica, sans-serif;
  margin: 0;
}

.arch-flow {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.arch-item {
  background: #f5f0e8;
  border: 1px solid #f5f0e8;
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  min-width: 200px;
}

.arch-item__title {
  font-size: 11px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: Helvetica, sans-serif;
}

.arch-item__subtitle {
  font-size: 11px;
  font-weight: 400;
  color: #1a1a1a;
  font-family: Helvetica, sans-serif;
}

.arch-arrow {
  flex-shrink: 0;
}

.arch-desc {
  font-size: 13px;
  line-height: 1.6;
  color: #f5f0e8;
  font-family: Helvetica, sans-serif;
  max-width: 1200px;
  margin: 0;
}
</style>
