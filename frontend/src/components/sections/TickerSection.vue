<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface TickerData {
  items: string[]
}

const props = defineProps<{
  bgColor?: string
  shadowColor?: string
  textColor?: string
  fontSize?: string
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

const tickerStyle = computed(() => ({
  '--ticker-bg': props.bgColor || 'var(--yellow)',
  '--ticker-shadow': props.shadowColor || 'var(--yellow-shadow)',
  '--ticker-text': props.textColor || '#1a1a1a',
  '--ticker-font-size': props.fontSize || '12px',
}))
</script>

<template>
  <div
    v-if="data"
    class="ticker"
    :style="tickerStyle"
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
  font-size: var(--ticker-font-size);
  font-weight: 900;
  color: var(--ticker-text);
  text-transform: uppercase;
  flex-shrink: 0;
}

.ticker__item::before {
  content: '✦ ';
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
