<script setup lang="ts">
import { inject, computed, onMounted, ref, type Ref } from 'vue'

interface ContentData {
  badge: string
  heading: string
}

interface ProductData {
  details?: { story_paragraphs?: string[] }
}

const product = inject<Ref<ProductData | null>>('product')
const storyParagraphs = computed(() => product?.value?.details?.story_paragraphs || [])

const content = ref<ContentData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/product_story_section')
    if (res.ok) content.value = await res.json()
  } catch {}
})
</script>

<template>
  <section v-if="storyParagraphs.length" class="story">
    <div class="story__inner">
      <span class="section-label">{{ content?.badge || 'ОБ ИЗДЕЛИИ' }}</span>
      <h2 class="section-title">{{ content?.heading || 'История модели' }}</h2>
      <div class="story__paragraphs">
        <p v-for="(p, i) in storyParagraphs" :key="i" class="story__p">{{ p }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.story {
  background: var(--bg-dark);
  padding: 80px 320px;
}

.story__inner {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: var(--accent);
  text-transform: uppercase;
}

.section-title {
  font-family: var(--font-body);
  font-size: var(--text-3xl);
  font-weight: var(--fw-bold);
  color: var(--bg);
  margin: 0;
}

.story__paragraphs {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 16px;
}

.story__p {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--fw-regular);
  color: var(--bg);
  margin: 0;
  line-height: var(--leading-relaxed);
}

@media (max-width: 1024px) {
  .story {
    padding: 80px;
  }
}

@media (max-width: 768px) {
  .story {
    padding: 40px 16px;
  }
}
</style>
