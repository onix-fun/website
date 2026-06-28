<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface CtaContent {
  heading: string
  description: string
  button_text: string
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
    <router-link to="/constructor" class="cta__btn">
      {{ content.button_text }}
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 9H14" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M9 4L14 9L9 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </router-link>
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
  font-size: 72px;
  font-weight: 700;
  color: var(--bg);
  text-align: center;
  margin: 0 0 24px;
  white-space: pre-line;
  line-height: 1.15;
}

.cta__text {
  position: relative;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  color: var(--white);
  text-align: center;
  margin: 0 0 32px;
  white-space: pre-line;
  line-height: 1.5;
}

.cta__btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border-radius: 999px;
  background: var(--bg-dark);
  box-shadow: 0 6px 0 rgb(0, 0, 0);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  color: var(--white);
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.cta__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 0 rgb(0, 0, 0);
}

.cta__btn:active {
  transform: translateY(1px);
  box-shadow: 0 3px 0 rgb(0, 0, 0);
}
</style>
