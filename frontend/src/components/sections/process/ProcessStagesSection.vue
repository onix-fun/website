<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Stage {
  title: string
  duration: string
  description: string
  color: string
  icon_bg: string
  tags: string[]
}

interface ProcessStagesData {
  stages: Stage[]
}

const data = ref<ProcessStagesData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/process_stages')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})

const stageIcons = [
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="6"/>
    <path d="M12 18v3"/>
    <line x1="9" y1="22" x2="15" y2="22"/>
    <circle cx="12" cy="9" r="1" fill="currentColor"/>
  </svg>`,
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 16a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8Z"/>
    <path d="M12 12 3.3 7.7M12 12l8.7-4.3M12 12v10"/>
  </svg>`,
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="5" y1="10" x2="19" y2="10"/>
    <line x1="6" y1="14" x2="18" y2="14"/>
    <line x1="7" y1="18" x2="17" y2="18"/>
  </svg>`,
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 9V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4"/>
    <rect x="3" y="9" width="18" height="8" rx="2"/>
    <path d="M8 17v3"/>
    <path d="M16 17v3"/>
    <rect x="6" y="11" width="12" height="3" rx="1" fill="currentColor"/>
  </svg>`,
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 12h8"/>
    <path d="M12 8v8"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
  </svg>`,
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2"/>
    <path d="M7 8h3"/>
    <path d="M14 8h3"/>
    <path d="M7 12h2"/>
    <path d="M15 12h2"/>
    <path d="M7 16h1"/>
    <path d="M16 16h1"/>
    <rect x="10" y="10" width="4" height="4" rx="1"/>
  </svg>`,
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 11 3 17v4h4l6-6"/>
    <path d="M21 3 11 13"/>
    <path d="M16 3h5v5"/>
  </svg>`,
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="M12 22V12"/>
    <path d="M9 13h6"/>
    <path d="M9 16h4"/>
  </svg>`
]

function iconFor(index: number): string {
  return stageIcons[index] || stageIcons[0]
}
</script>

<template>
  <section v-if="data" class="ps">
    <div class="ps__inner">
      <svg class="ps__line" viewBox="0 0 6 100" preserveAspectRatio="none">
        <line x1="3" y1="0" x2="3" y2="100" stroke="#ff4d00" stroke-width="3" stroke-linecap="round" />
        <line x1="3.5" y1="0" x2="3.5" y2="100" stroke="#7b61ff" stroke-width="2" stroke-linecap="round" />
        <line x1="4" y1="0" x2="4" y2="100" stroke="#58cc02" stroke-width="1" stroke-linecap="round" />
      </svg>
      <div
        v-for="(stage, i) in data.stages"
        :key="i"
        class="ps__item"
        :class="i % 2 === 0 ? 'ps__item--left' : 'ps__item--right'"
      >
        <div class="ps__connector">
          <div class="ps__dot" :style="{ background: stage.color }" />
        </div>
        <div class="ps__card" :style="{ background: stage.color, boxShadow: `0 7px 0 ${stage.color}66` }">
          <div class="ps__card-top">
            <div
              class="ps__card-icon"
              :style="{
                background: stage.icon_bg === 'white' ? '#f5f0e8' : '#1a1a1a',
                color: stage.icon_bg === 'white' ? '#1a1a1a' : '#f5f0e8'
              }"
              v-html="iconFor(i)"
            />
          </div>
          <h3 class="ps__card-title ps__text-light">{{ stage.title }}</h3>
          <p class="ps__card-desc ps__text-light">{{ stage.description }}</p>
          <div class="ps__card-tags">
            <div v-for="(tag, j) in stage.tags" :key="j" class="ps__card-tag">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="7" cy="7" r="3.5" />
              </svg>
              <span
                class="ps__card-tag-text"
                :style="{
                  background: stage.icon_bg === 'white' ? '#1a1a1a' : '#1a1a1a',
                  color: '#f5f0e8'
                }"
              >{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ps {
  background: #f5f0e8;
  padding: 80px;
}

.ps__inner {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
}

.ps__line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 6px;
  transform: translateX(-50%);
  z-index: 0;
}

.ps__item {
  position: relative;
  display: flex;
  align-items: flex-start;
  z-index: 1;
  margin-bottom: 40px;
}

.ps__item--left {
  flex-direction: row;
  padding-right: calc(50% + 30px);
}

.ps__item--right {
  flex-direction: row-reverse;
  padding-left: calc(50% + 30px);
}

.ps__card {
  flex: 1;
  border-radius: 24px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ps__card-top {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 4px;
}

.ps__card-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ps__card-title {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--fw-bold);
  margin: 0;
}

.ps__card-duration {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  margin: 0;
}

.ps__card-desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--fw-regular);
  margin: 0;
  line-height: var(--leading-normal);
  white-space: pre-line;
}

.ps__text-light {
  color: #fff;
}

.ps__text-dark {
  color: #1a1a1a;
}

.ps__text-light-muted {
  color: rgba(255, 255, 255, 0.7);
}

.ps__text-dark-muted {
  color: #6b6555;
}

.ps__card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
  align-items: center;
}

.ps__card-tag {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ps__card-tag svg {
  color: #f5f0e8;
  opacity: 0.6;
  flex-shrink: 0;
}

.ps__card-tag-text {
  font-family: var(--font-body);
  font-size: var(--text-2xs);
  font-weight: var(--fw-bold);
  padding: 5px 10px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ps__connector {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  flex-shrink: 0;
}

.ps__item--left .ps__connector {
  order: 1;
}

.ps__item--right .ps__connector {
  order: -1;
}

.ps__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #f5f0e8;
}

@media (max-width: 1024px) {
  .ps {
    padding: 60px 24px;
  }

  .ps__line {
    left: 20px;
  }

  .ps__item {
    padding-left: 50px !important;
    padding-right: 0 !important;
    flex-direction: row !important;
  }

  .ps__item--right {
    flex-direction: row !important;
  }

  .ps__connector {
    order: -1;
    width: 30px;
  }

  .ps__card {
    min-width: 0;
  }
}
</style>
