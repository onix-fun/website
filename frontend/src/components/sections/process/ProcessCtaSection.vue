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
    <div class="pc__blur pc__blur--yellow-sm" />
    <div class="pc__inner">
      <h2 class="pc__title">{{ data.title }}</h2>
      <p class="pc__desc">{{ data.description }}</p>
      <a :href="data.button_link" class="pc__button">
        {{ data.button_text }}
        <svg class="pc__button-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <line x1="3" y1="9" x2="14" y2="9" stroke="white" stroke-width="2"/>
          <line x1="9.5" y1="4" x2="14.5" y2="9" stroke="white" stroke-width="2"/>
          <line x1="9.5" y1="14" x2="14.5" y2="9" stroke="white" stroke-width="2"/>
        </svg>
      </a>
    </div>
  </section>
</template>

<style scoped>
.pc {
  position: relative;
  background: #ff4d00;
  padding: 80px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 533px;
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
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
}

.pc__blur--yellow-sm {
  width: 256px;
  height: 256px;
  background: #ffd600;
  bottom: -80px;
  right: 10%;
}

.pc__inner {
  position: relative;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  text-align: center;
}

.pc__title {
  font-family: 'Unbounded', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: #f5f0e8;
  margin: 0;
  line-height: 1.1;
  white-space: pre-line;
}

.pc__desc {
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #fff;
  margin: 0;
  line-height: 1.5;
  max-width: 400px;
  white-space: pre-line;
}

.pc__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 53px;
  padding: 0 32px;
  background: #1a1a1a;
  color: #fff;
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 700;
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.pc__button:hover {
  transform: translateY(-1px);
  box-shadow: 0 7px 0 rgba(0, 0, 0, 0.3);
}

.pc__button:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
}

.pc__button-icon {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .pc {
    padding: 48px 16px;
    min-height: 369px;
  }

  .pc__title {
    font-size: 32px;
  }

  .pc__blur--yellow {
    width: 256px;
    height: 256px;
    top: -80px;
  }

  .pc__blur--yellow-sm {
    width: 160px;
    height: 160px;
    bottom: -40px;
    right: 0;
  }
}
</style>
