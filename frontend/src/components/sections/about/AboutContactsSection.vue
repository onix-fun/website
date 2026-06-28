<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface ContactItem {
  label: string
  value: string
}

interface Cta {
  text: string
  link: string
}

interface AboutContactsData {
  label: string
  title: string
  contacts: ContactItem[]
  cta: Cta
}

const data = ref<AboutContactsData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/about_contacts')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data" class="ac">
    <div class="ac__inner">
      <div class="ac__content">
        <span class="ac__label">{{ data.label }}</span>
        <h2 class="ac__title">{{ data.title }}</h2>
        <div class="ac__list">
          <div v-for="(c, i) in data.contacts" :key="i" class="ac__item">
            <span class="ac__item-label">{{ c.label }}</span>
            <span class="ac__item-value">{{ c.value }}</span>
          </div>
        </div>
        <a :href="data.cta.link" class="ac__cta">{{ data.cta.text }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ac {
  background: #f5f0e8;
  padding: 0 80px 80px;
}

.ac__inner {
  max-width: 1280px;
  margin: 0 auto;
}

.ac__content {
  max-width: 372px;
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.ac__label {
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #ff4d00;
}

.ac__title {
  font-family: Helvetica, sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  white-space: pre-line;
  line-height: 1.1;
}

.ac__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ac__item {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.ac__item-label {
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #6b6555;
}

.ac__item-value {
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
}

.ac__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 15px 32px;
  background: #ff4d00;
  box-shadow: 0 4px 0 #c84b00;
  border-radius: 999px;
  font-family: Helvetica, sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: transform 0.2s;
}

.ac__cta:hover {
  transform: translateY(-1px);
}

.ac__cta:active {
  transform: translateY(1px);
}
</style>
