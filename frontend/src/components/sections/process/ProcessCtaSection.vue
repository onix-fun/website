<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface ProcessCtaData {
  title: string
  description: string
  button_text: string
  button_link: string
}

const data = ref<ProcessCtaData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/process_cta')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data" class="pc">
    <div class="pc__blur pc__blur--yellow" />
    <div class="pc__blur pc__blur--green" />
    <div class="pc__inner">
      <h2 class="pc__title">{{ data.title }}</h2>
      <p class="pc__desc">{{ data.description }}</p>
      <a :href="data.button_link" class="pc__button">{{ data.button_text }}</a>
    </div>
  </section>
</template>

<style scoped>
.pc {
  position: relative;
  background: #ff4d00;
  padding: 80px;
  overflow: hidden;
}

.pc__blur {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.15;
  pointer-events: none;
}

.pc__blur--yellow {
  width: 384px;
  height: 384px;
  background: #ffd600;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
}

.pc__blur--green {
  width: 256px;
  height: 256px;
  background: #58cc02;
  bottom: -80px;
  right: 10%;
}

.pc__inner {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  text-align: center;
}

.pc__title {
  font-family: Helvetica, sans-serif;
  font-size: 60px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.05;
}

.pc__desc {
  font-family: Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #fff;
  margin: 0;
  line-height: 1.6;
  max-width: 478px;
  white-space: pre-line;
}

.pc__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 152px;
  height: 49px;
  background: #1a1a1a;
  color: #fff;
  font-family: Helvetica, sans-serif;
  font-size: 11px;
  font-weight: 700;
  border-radius: 999px;
  text-decoration: none;
  text-align: center;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  transition: opacity 0.2s;
}

.pc__button:hover {
  opacity: 0.9;
}
</style>
