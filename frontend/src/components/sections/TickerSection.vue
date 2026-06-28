<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface TickerData {
  items: string[]
}

const props = defineProps<{
  bgColor?: string
  shadowColor?: string
}>()

const data = ref<TickerData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/ticker')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <div
    v-if="data"
    class="ticker"
    :style="{
      '--ticker-bg': bgColor || 'var(--yellow)',
      '--ticker-shadow': shadowColor || 'var(--yellow-shadow)',
    }"
  >
    <div class="ticker__track">
      <span
        v-for="(item, i) in [...data.items, ...data.items, ...data.items]"
        :key="i"
        class="ticker__item"
      >{{ item }}</span>
    </div>
  </div>
</template>

<style scoped>
.ticker {
  width: 100%;
  height: 49px;
  background: var(--ticker-bg);
  box-shadow: 0 5px 0 var(--ticker-shadow);
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 16px 0;
}

.ticker__track {
  display: flex;
  gap: 40px;
  white-space: nowrap;
  animation: ticker-scroll 30s linear infinite;
}

.ticker__item {
  font-family: var(--font-heading);
  font-size: 11px;
  font-weight: 900;
  color: var(--white);
  text-transform: uppercase;
  flex-shrink: 0;
}

@keyframes ticker-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.33%);
  }
}
</style>
