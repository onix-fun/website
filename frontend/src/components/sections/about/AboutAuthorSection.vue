<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface SocialLink {
  name: string
  url: string
}

interface AboutAuthorData {
  label: string
  name: string
  role: string
  image_url?: string
  bio: string[]
  social: SocialLink[]
}

const data = ref<AboutAuthorData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/about_author')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data" class="aauth">
    <div class="aauth__inner">
      <div class="aauth__image">
        <img v-if="data.image_url" class="aauth__image-el" :src="data.image_url" alt="Автор проекта Sparrow">
        <div v-else class="aauth__image-placeholder" />
      </div>
      <div class="aauth__content">
        <span class="aauth__label">{{ data.label }}</span>
        <h2 class="aauth__name">{{ data.name }}</h2>
        <span class="aauth__role">{{ data.role }}</span>
        <p v-for="(p, i) in data.bio" :key="i" class="aauth__bio">{{ p }}</p>
        <div class="aauth__social">
          <a
            v-for="(s, i) in data.social"
            :key="i"
            :href="s.url"
            class="aauth__social-btn"
          >{{ s.name }}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.aauth {
  background: #f5f0e8;
  padding: 80px;
}

.aauth__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  gap: 181px;
}

.aauth__image {
  flex: 0 0 459px;
  height: 459px;
  border-radius: 15px;
  overflow: hidden;
}

.aauth__image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #d4d0c8 0%, #c4c0b8 100%);
  border-radius: 15px;
}

.aauth__image-el {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.aauth__content {
  flex: 1;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 27px;
  padding-bottom: 16px;
}

.aauth__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--fw-regular);
  color: #ff4d00;
}

.aauth__name {
  font-family: var(--font-body);
  font-size: var(--text-3xl);
  font-weight: var(--fw-bold);
  color: #1a1a1a;
  margin: 0;
}

.aauth__role {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--fw-regular);
  color: #6b6555;
}

.aauth__bio {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--fw-regular);
  color: #6b6555;
  margin: 0;
  line-height: var(--leading-relaxed);
  white-space: pre-line;
}

.aauth__social {
  display: flex;
  gap: 10px;
}

.aauth__social-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffd600;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-size: var(--text-2xs);
  font-weight: var(--fw-bold);
  color: #1a1a1a;
  text-decoration: none;
  transition: transform 0.2s;
}

.aauth__social-btn:hover {
  transform: scale(1.1);
}
</style>
