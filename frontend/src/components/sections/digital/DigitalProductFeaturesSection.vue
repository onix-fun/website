<script setup lang="ts">
import { inject, computed, onMounted, ref, type Ref } from 'vue'

import AirSmartControl from '@/assets/icons/digital/air-smart-control.svg'
import AirMqtt from '@/assets/icons/digital/air-mqtt.svg'
import AirSecurity from '@/assets/icons/digital/air-security.svg'
import AirAnalytics from '@/assets/icons/digital/air-analytics.svg'
import AirIntegration from '@/assets/icons/digital/air-integration.svg'
import AccountJwt from '@/assets/icons/digital/account-jwt.svg'
import AccountApiGrpc from '@/assets/icons/digital/account-api-grpc.svg'
import AccountVue from '@/assets/icons/digital/account-vue.svg'
import AccountSwagger from '@/assets/icons/digital/account-swagger.svg'
import AccountDocker from '@/assets/icons/digital/account-docker.svg'

interface ContentData {
  badge: string
}

const iconMap: Record<string, unknown> = {
  'air-smart-control': AirSmartControl,
  'air-mqtt': AirMqtt,
  'air-security': AirSecurity,
  'air-analytics': AirAnalytics,
  'air-integration': AirIntegration,
  'account-jwt': AccountJwt,
  'account-api-grpc': AccountApiGrpc,
  'account-vue': AccountVue,
  'account-swagger': AccountSwagger,
  'account-docker': AccountDocker,
}

interface ProductData {
  title: string
  content?: {
    hero?: { badge_color?: string }
    features?: { icon: string; title: string; description: string }[]
  }
}

const product = inject<Ref<ProductData | null>>('digitalProduct')
const features = computed(() => product?.value?.content?.features || [])
const badgeColor = computed(() => product?.value?.content?.hero?.badge_color || '#ff4d00')

const content = ref<ContentData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/digital_features_section')
    if (res.ok) content.value = await res.json()
  } catch {}
})

function featureIcon(name: string): unknown {
  return iconMap[name] || null
}
</script>

<template>
  <section v-if="features.length" class="features-section">
    <span class="section-badge">{{ content?.badge || 'ВОЗМОЖНОСТИ' }}</span>
    <h2 class="section-heading">Что даёт {{ product?.title }}</h2>
    <div class="features-grid">
      <div v-for="(f, i) in features" :key="i" class="feature-card">
        <div class="feature-icon" :style="{ background: badgeColor }">
          <component :is="featureIcon(f.icon)" class="feature-icon__svg" />
        </div>
        <h3 class="feature-title">{{ f.title }}</h3>
        <p class="feature-desc">{{ f.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-section {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 80px 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-badge {
  font-size: 12px;
  font-weight: 400;
  color: #ff4d00;
  font-family: Helvetica, sans-serif;
}

.section-heading {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: Helvetica, sans-serif;
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background: #fff;
  border: 1px solid #1a1a1a;
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon__svg {
  width: 20px;
  height: 20px;
  color: #0a0a0a;
}

.feature-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: Helvetica, sans-serif;
  margin: 0;
}

.feature-desc {
  font-size: 13px;
  line-height: 1.5;
  color: #6b6555;
  font-family: Helvetica, sans-serif;
  margin: 0;
}
</style>
