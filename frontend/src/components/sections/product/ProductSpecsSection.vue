<script setup lang="ts">
import { inject, computed, onMounted, ref, type Ref } from 'vue'

interface ContentData {
  badge: string
  heading: string
}

interface ProductData {
  details?: { specifications?: { label: string; value: string }[] }
}

const product = inject<Ref<ProductData | null>>('product')
const specs = computed(() => product?.value?.details?.specifications || [])

const content = ref<ContentData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/product_specs_section')
    if (res.ok) content.value = await res.json()
  } catch {}
})
</script>

<template>
  <section v-if="specs.length" class="specs">
    <div class="specs__inner">
      <span class="section-label">{{ content?.badge || 'ХАРАКТЕРИСТИКИ' }}</span>
      <h2 class="section-title">{{ content?.heading || 'Технические данные' }}</h2>
      <div class="specs__grid">
        <div v-for="(spec, i) in specs" :key="i" class="specs__row">
          <span class="specs__label">{{ spec.label }}</span>
          <span class="specs__value">{{ spec.value }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.specs {
  background: var(--bg-dark);
  padding: 80px;
}

.specs__inner {
  max-width: 1280px;
  margin: 0 auto;
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
  color: var(--bg);
  margin: 0;
  padding-top: 12px;
}

.specs__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  padding-top: 24px;
}

.specs__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  border-bottom: 1px solid #2a2a2a;
  min-height: 62px;
}

.specs__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: var(--bg);
}

.specs__value {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-bold);
  color: var(--bg);
}
</style>
