<script setup lang="ts">
import { inject, computed, onMounted, ref, type Ref } from 'vue'

import AppIcon from '@/components/icons/AppIcon.vue'

interface ContentData {
  heading: string
  button_text: string
}

interface ProductData {
  content?: {
    open_source?: {
      description: string
      button_text?: string
      github_url: string
    }
  }
}

const product = inject<Ref<ProductData | null>>('digitalProduct')
const oss = computed(() => product?.value?.content?.open_source)

const content = ref<ContentData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/digital_opensource_section')
    if (res.ok) content.value = await res.json()
  } catch {}
})
</script>

<template>
  <section v-if="oss" class="oss-section">
    <div class="oss-icon">
      <AppIcon name="code" :size="28" :stroke-width="2" />
    </div>
    <h2 class="oss-heading">{{ content?.heading || 'Открытый код' }}</h2>
    <p class="oss-description">{{ oss.description }}</p>
    <a :href="oss.github_url" target="_blank" class="oss-btn">
      <AppIcon name="github" :size="16" :stroke-width="1.7" />
      {{ oss.button_text || content?.button_text || 'НА GITHUB' }}
      <AppIcon name="arrow-right" :size="14" :stroke-width="2" />
    </a>
  </section>
</template>

<style scoped>
.oss-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px;
  text-align: center;
  border-top: 1px solid #d4d0c8;
}

.oss-icon {
  width: 64px;
  height: 64px;
  background: #1a1a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.oss-heading {
  font-family: 'Unbounded', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: #1a1a1a;
  margin: 0;
}

.oss-description {
  font-size: 14px;
  line-height: 1.5;
  color: #6b6555;
  font-family: Helvetica, sans-serif;
  max-width: 500px;
  margin: 0;
}

.oss-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1a1a1a;
  color: #fff;
  text-decoration: none;
  padding: 14px 32px;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 700;
  font-family: Helvetica, sans-serif;
  box-shadow: 0 4px 0 rgba(0,0,0,0.3);
}
</style>
