<script setup lang="ts">
import { inject, computed, onMounted, ref, type Ref } from 'vue'

interface ContentData {
  heading: string
  button_text: string
}

interface ProductData {
  content?: {
    open_source?: {
      description: string
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
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M19 8l-7 8-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h2 class="oss-heading">{{ content?.heading || 'Открытый код' }}</h2>
    <p class="oss-description">{{ oss.description }}</p>
    <a :href="oss.github_url" target="_blank" class="oss-btn">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M9 1.5l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13 5.5H5a3 3 0 0 0-3 3v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      {{ content?.button_text || 'НА GITHUB' }}
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
  border-top: 1px solid #1a1a1a;
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
  font-size: 30px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: Helvetica, sans-serif;
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
