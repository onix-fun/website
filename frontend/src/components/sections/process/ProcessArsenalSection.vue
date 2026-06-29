<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface ArsenalItem {
  title: string
  description: string
  color: string
}

interface ProcessArsenalData {
  label: string
  title: string
  items: ArsenalItem[]
}

const data = ref<ProcessArsenalData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/process_arsenal')
    if (res.ok) data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data" class="pa">
    <div class="pa__inner">
      <div class="pa__header">
        <span class="pa__label">{{ data.label }}</span>
        <h2 class="pa__title">{{ data.title }}</h2>
      </div>
      <div class="pa__grid">
        <article v-for="item in data.items" :key="item.title" class="pa__card">
          <span class="pa__dot" :style="{ background: item.color }" />
          <h3 class="pa__card-title">{{ item.title }}</h3>
          <p class="pa__card-description">{{ item.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pa {
  background: #1a1a1a;
  padding: 80px;
}

.pa__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.pa__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pa__label {
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #ff4d00;
}

.pa__title {
  font-family: 'Unbounded', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: #f5f0e8;
  margin: 0;
  line-height: 1.1;
}

.pa__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.pa__card {
  min-height: 180px;
  border: 1px solid #1a1a1a;
  border-radius: 24px;
  background: #ffd600;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pa__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.pa__card-title {
  font-family: Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.pa__card-description {
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #1a1a1a;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 1024px) {
  .pa {
    padding: 48px 24px;
  }

  .pa__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .pa__title {
    font-size: 32px;
  }

  .pa__grid {
    grid-template-columns: 1fr;
  }
}
</style>
