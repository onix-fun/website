<script setup lang="ts">
import { inject, onMounted, ref, type Ref } from 'vue'

interface Category {
  id: number
  name: string
  slug: string
}

interface CatalogData {
  categories: Category[]
}

const data = ref<CatalogData | null>(null)
const activeCategory = inject<Ref<string>>('activeCategory')!

onMounted(async () => {
  try {
    const res = await fetch('/api/catalog')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})

function setCategory(slug: string) {
  activeCategory.value = slug
}
</script>

<template>
  <div v-if="data" class="filters">
    <button
      class="filter-btn"
      :class="{ 'filter-btn--active': activeCategory === 'all' }"
      @click="setCategory('all')"
    >
      Все
    </button>
    <button
      v-for="cat in data.categories"
      :key="cat.id"
      class="filter-btn"
      :class="{ 'filter-btn--active': activeCategory === cat.slug }"
      @click="setCategory(cat.slug)"
    >
      {{ cat.name }}
    </button>
  </div>
</template>

<style scoped>
.filters {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 80px 32px;
  display: flex;
  gap: 8px;
}

.filter-btn {
  height: 35px;
  padding: 10px 16px;
  border-radius: 999px;
  background: var(--bg-dark);
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  color: var(--white);
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
}

.filter-btn--active {
  background: var(--accent);
  box-shadow: 0 4px 0 var(--accent-shadow);
}

.filter-btn:hover {
  transform: translateY(-1px);
}

.filter-btn:active {
  transform: translateY(1px);
}
</style>
