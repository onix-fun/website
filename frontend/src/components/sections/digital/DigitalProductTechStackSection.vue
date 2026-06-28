<script setup lang="ts">
import { inject, computed, onMounted, ref, type Ref } from 'vue'

interface ContentData {
  badge: string
  heading: string
}

interface ProductData {
  content?: {
    tech_stack?: {
      items: { category: string; title: string }[]
    }
  }
}

const product = inject<Ref<ProductData | null>>('digitalProduct')
const tech = computed(() => product?.value?.content?.tech_stack)

const content = ref<ContentData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/digital_techstack_section')
    if (res.ok) content.value = await res.json()
  } catch {}
})
</script>

<template>
  <section v-if="tech" class="tech-section">
    <span class="section-badge section-badge--orange">{{ content?.badge || 'ТЕХНОЛОГИИ' }}</span>
    <h2 class="section-heading">{{ content?.heading || 'Стек' }}</h2>
    <div class="tech-grid">
      <div v-for="(item, i) in tech.items" :key="i" class="tech-card">
        <span class="tech-category">{{ item.category }}</span>
        <span class="tech-title">{{ item.title }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tech-section {
  max-width: 1440px;
  margin: 0 auto;
  padding: 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-badge {
  font-size: 12px;
  font-weight: 400;
  color: #ff4d00;
  font-family: Helvetica, sans-serif;
}

.section-badge--orange {
  color: #ff4d00;
}

.section-heading {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: Helvetica, sans-serif;
  margin: 0;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.tech-card {
  background: #fff;
  border: 1px solid #1a1a1a;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tech-category {
  font-size: 11px;
  font-weight: 400;
  color: #6b6555;
  font-family: Helvetica, sans-serif;
}

.tech-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: Helvetica, sans-serif;
}
</style>
