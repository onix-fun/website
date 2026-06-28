<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface AboutHeroData {
  label: string
  title: string
  description: string
}

const data = ref<AboutHeroData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/about_hero')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data" class="ah">
    <div class="ah__inner">
      <div class="ah__content">
        <span class="ah__label">{{ data.label }}</span>
        <h1 class="ah__title">{{ data.title }}</h1>
        <p class="ah__description">{{ data.description }}</p>
      </div>
      <div class="ah__visual">
        <svg class="ah__orbs" width="652" height="646" viewBox="0 0 652 646" fill="none">
          <ellipse cx="408.5" cy="322" rx="328" ry="294" stroke="#929292" stroke-width="1" />
          <ellipse cx="337" cy="244" rx="243" ry="218" stroke="#929292" stroke-width="1" />
          <ellipse cx="565" cy="325" rx="503" ry="291" stroke="#929292" stroke-width="1" />
          <ellipse cx="495" cy="426" rx="427" ry="373" stroke="#929292" stroke-width="1" />
          <g filter="url(#ah-shadow-1)">
            <circle cx="81" cy="291" r="40" fill="#f09c9c" />
            <circle cx="86" cy="280" r="4" fill="#ec8383" />
            <circle cx="73" cy="276" r="4" fill="#ec8383" />
            <circle cx="90" cy="293" r="3" fill="#ec8383" />
            <circle cx="78" cy="296" r="2" fill="#ec8383" />
            <circle cx="85" cy="300" r="2" fill="#ec8383" />
            <circle cx="73" cy="289" r="2" fill="#ec8383" />
          </g>
          <g filter="url(#ah-shadow-2)">
            <circle cx="278" cy="35" r="14.5" fill="#96d3e6" />
            <path d="M286.5 32.5C284.5 38.5 281 41 278 37C281 34.5 283.5 30 286.5 32.5Z" fill="#059714" />
            <path d="M288 46C283 45.5 278.5 41.5 278.5 41.5C282.5 39.5 286.5 40 288 46Z" fill="#059714" />
            <path d="M272.5 49C274.5 44.5 279 43 279.5 43C278.5 47 276 49 272.5 49Z" fill="#059714" />
          </g>
          <g filter="url(#ah-shadow-3)">
            <circle cx="531" cy="490" r="20" fill="#cc861d" />
            <circle cx="535" cy="485" r="2" fill="#6a4000" />
            <circle cx="527" cy="484" r="3" fill="#6a4000" />
            <circle cx="536" cy="493" r="1.5" fill="#6a4000" />
            <circle cx="528" cy="493" r="1" fill="#6a4000" />
            <circle cx="533" cy="496" r="1.5" fill="#6a4000" />
            <circle cx="532" cy="487" r="1.5" fill="#6a4000" />
          </g>
          <defs>
            <filter id="ah-shadow-1" x="0" y="210" width="122" height="122" filterUnits="userSpaceOnUse">
              <feDropShadow dx="-3" dy="2" stdDeviation="4" flood-opacity="0.18" />
            </filter>
            <filter id="ah-shadow-2" x="248" y="9" width="55" height="55" filterUnits="userSpaceOnUse">
              <feDropShadow dx="-1" dy="0" stdDeviation="1.5" flood-opacity="0.29" />
            </filter>
            <filter id="ah-shadow-3" x="496" y="455" width="50" height="50" filterUnits="userSpaceOnUse">
              <feDropShadow dx="-2" dy="2" stdDeviation="3" flood-opacity="0.28" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ah {
  background: #f5f0e8;
  padding: 80px;
  overflow: hidden;
}

.ah__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
}

.ah__content {
  flex: 1;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ah__label {
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #ff4d00;
}

.ah__title {
  font-family: Helvetica, sans-serif;
  font-size: 72px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.05;
  white-space: pre-line;
}

.ah__description {
  font-family: Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #6b6555;
  margin: 0;
  line-height: 1.6;
}
</style>
