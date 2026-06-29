<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Material {
  name: string
  full_name: string
  description: string
  color: string
  tags: string[]
}

interface MaterialsData {
  label: string
  title: string
  materials: Material[]
}

const data = ref<MaterialsData | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/content/materials')
    data.value = await res.json()
  } catch {
    data.value = null
  }
})
</script>

<template>
  <section v-if="data" class="materials">
    <div class="materials__inner">
      <div class="materials__header">
        <span class="materials__label">{{ data.label }}</span>
        <h2 class="materials__title">{{ data.title }}</h2>
      </div>
      <div class="materials__grid">
        <div v-for="mat in data.materials" :key="mat.name" class="material-card">
          <div
            class="material-card__circle"
            :style="{ background: mat.color, boxShadow: `0 8px 0 ${mat.color}cc` }"
          >
            <span class="material-card__initial">{{ mat.name }}</span>
          </div>
          <div class="material-card__info">
            <p class="material-card__name">{{ mat.full_name }}</p>
            <p class="material-card__desc">{{ mat.description }}</p>
          </div>
          <div class="material-card__tags">
            <span
              v-for="tag in mat.tags"
              :key="tag"
              class="material-card__tag"
              :style="{ background: mat.color, boxShadow: '0 2px 0 rgba(0,0,0,0.08)' }"
            >{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.materials {
  background: var(--bg);
  padding: 91px 80px 73px;
}

.materials__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  gap: 64px;
}

.materials__header {
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding-top: 8px;
}

.materials__label {
  font-family: var(--font-heading);
  font-size: 9px;
  font-weight: 900;
  color: var(--white);
  background: var(--accent);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
  text-transform: uppercase;
}

.materials__title {
  font-family: var(--font-heading);
  font-size: 64px;
  font-weight: 900;
  color: var(--text-dark);
  margin: 0;
  white-space: pre-line;
  line-height: 1.1;
}

.materials__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(24px, 5vw, 68px);
  align-items: start;
}

.material-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.material-card__circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.material-card__initial {
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 900;
  color: var(--white);
}

.material-card__info {
  max-width: 220px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.material-card__name {
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.material-card__desc {
  font-size: 10px;
  font-weight: 400;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
}

.material-card__tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.material-card__tag {
  font-family: var(--font-heading);
  font-size: 8px;
  font-weight: 900;
  color: var(--text-dark);
  padding: 2px 8px;
  border-radius: 999px;
  white-space: nowrap;
}

@media (max-width: 1180px) {
  .materials {
    padding: 72px 40px 64px;
  }

  .materials__inner {
    padding: 0;
    gap: 48px;
  }

  .materials__grid {
    gap: 28px;
  }

  .material-card__circle {
    width: clamp(118px, 15vw, 144px);
    height: clamp(118px, 15vw, 144px);
  }
}

@media (max-width: 900px) {
  .materials__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 40px;
  }

  .materials__title {
    font-size: clamp(42px, 7vw, 56px);
  }
}

@media (max-width: 768px) {
  .materials {
    padding: 40px 16px;
  }

  .materials__title {
    font-size: 32px;
  }

  .materials__grid {
    display: grid;
    grid-template-columns: 1fr;
    flex-direction: column;
    gap: 32px;
  }

  .material-card__circle {
    width: 120px;
    height: 120px;
  }
}
</style>
