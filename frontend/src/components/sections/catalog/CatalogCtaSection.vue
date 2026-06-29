<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppButton from '@/components/AppButton.vue'

interface CtaContent {
  heading: string
  description: string
  button_text: string
  button_link?: string
}

const content = ref<CtaContent | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/catalog_cta')
    content.value = await res.json()
  } catch {
    content.value = null
  }
})
</script>

<template>
  <section v-if="content" class="cta">
    <div class="cta__circle cta__circle--yellow" />
    <div class="cta__circle cta__circle--green" />
    <h2 class="cta__title">{{ content.heading }}</h2>
    <p class="cta__text">{{ content.description }}</p>
    <AppButton variant="dark" size="lg" :to="content.button_link || '/constructor'">
      {{ content.button_text }}
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 9H14" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M9 4L14 9L9 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </AppButton>
  </section>
</template>

<style scoped>
.cta {
  position: relative;
  background: var(--accent);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 16px;
  overflow: hidden;
  min-height: 533px;
}

.cta__circle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.cta__circle--yellow {
  width: 384px;
  height: 384px;
  background: var(--yellow);
  top: -80px;
  left: -80px;
}

.cta__circle--green {
  width: 256px;
  height: 256px;
  background: var(--green);
  bottom: -60px;
  right: -60px;
}

.cta__title {
  position: relative;
  font-family: var(--font-body);
  font-size: var(--text-7xl);
  font-weight: var(--fw-bold);
  color: var(--bg);
  text-align: center;
  margin: 0 0 24px;
  white-space: pre-line;
  line-height: var(--leading-xs);
}

.cta__text {
  position: relative;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--fw-regular);
  color: var(--white);
  text-align: center;
  margin: 0 0 32px;
  white-space: pre-line;
  line-height: var(--leading-normal);
}

</style>
