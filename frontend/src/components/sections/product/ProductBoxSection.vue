<script setup lang="ts">
import { inject, computed, onMounted, ref, type Ref } from 'vue'

interface ContentData {
  badge: string
  heading: string
}

interface ProductData {
  bg_color?: string
  details?: { box_contents?: string[] }
}

const product = inject<Ref<ProductData | null>>('product')
const boxContents = computed(() => product?.value?.details?.box_contents || [])
const bgColor = computed(() => product?.value?.bg_color || '#f0edff')

const content = ref<ContentData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/product_box_section')
    if (res.ok) content.value = await res.json()
  } catch {}
})
</script>

<template>
  <section v-if="boxContents.length" class="box">
    <div class="box__inner">
      <div class="box__left">
        <span class="section-label">{{ content?.badge || 'КОМПЛЕКТАЦИЯ' }}</span>
        <h2 class="section-title">{{ content?.heading || 'В коробке' }}</h2>
        <ul class="box__list">
          <li v-for="(item, i) in boxContents" :key="i" class="box__item">
            <span class="box__dot" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
      <div class="box__right">
        <div class="box__image" :style="{ background: bgColor }">
          <div class="box__placeholder" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.box {
  background: #ffffff;
  padding: 80px;
}

.box__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  gap: 80px;
  align-items: flex-start;
}

.box__left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 560px;
}

.box__right {
  width: 600px;
  flex-shrink: 0;
}

.section-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: var(--accent);
  text-transform: uppercase;
}

.section-title {
  font-family: var(--font-body);
  font-size: var(--text-3xl);
  font-weight: var(--fw-bold);
  color: var(--text-dark);
  margin: 0;
}

.box__list {
  list-style: none;
  padding: 8px 0 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.box__item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--fw-regular);
  color: var(--text-dark);
}

.box__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

.box__image {
  width: 600px;
  height: 320px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.box__placeholder {
  width: 256px;
  height: 144px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
}
</style>
