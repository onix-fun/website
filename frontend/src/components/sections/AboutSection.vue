<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface AboutData {
  label: string
  title: string
  description: string
  tags: string[]
  image_url?: string
}

const data = ref<AboutData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/about')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data" class="about">
    <div class="about__inner">
      <div class="about__visual">
        <img class="about__image" src="/content/home/about.png" alt="Изображение мастерской Sparrow">
      </div>
      <div class="about__content">
        <span class="about__label">{{ data.label }}</span>
        <h2 class="about__title">{{ data.title }}</h2>
        <p class="about__description">{{ data.description }}</p>
        <div class="about__tags">
          <span v-for="tag in data.tags" :key="tag" class="about__tag">{{ tag }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  background: var(--bg-dark);
  padding: 0 112px;
  display: flex;
  align-items: center;
  min-height: 682px;
}

.about__inner {
  display: flex;
  align-items: center;
  gap: 73px;
  width: 100%;
  max-width: 1216px;
  margin: 0 auto;
}

.about__visual {
  flex: 0 0 578px;
  height: 578px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.about__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 23px;
}

.about__label {
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  font-weight: var(--fw-bold);
  color: var(--accent);
  display: inline-block;
  width: fit-content;
  text-transform: uppercase;
}

.about__title {
  font-family: var(--font-heading);
  font-size: var(--text-5xl);
  font-weight: var(--fw-black);
  color: var(--white);
  margin: 0;
  white-space: pre-line;
  line-height: var(--leading-tight);
}

.about__description {
  font-size: var(--text-sm);
  font-weight: var(--fw-regular);
  color: var(--bg);
  margin: 0;
  line-height: var(--leading-relaxed);
}

.about__tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 8px;
}

.about__tag {
  font-size: var(--text-2xs);
  font-weight: var(--fw-bold);
  color: var(--text-dark);
  background: var(--bg);
  padding: 8px 16px;
  border-radius: 999px;
}

@media (max-width: 768px) {
  .about {
    padding: 40px 16px;
    min-height: auto;
  }

  .about__inner {
    flex-direction: column;
    gap: 32px;
  }

  .about__visual {
    flex: 0 0 300px;
    height: 300px;
  }

  .about__title {
    font-size: var(--text-2xl);
  }
}
</style>
