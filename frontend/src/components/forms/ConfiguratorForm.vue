<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { configuratorState, files, persistConfigurator } from '../../stores/configurator'

import AppIcon from '@/components/icons/AppIcon.vue'

const router = useRouter()

interface FeatureOption {
  id: string
  label: string
}

interface MaterialOption {
  id: string
  label: string
  fullName: string
  color: string
  tags: string[]
}

interface ConfiguratorSection {
  step: string
  title: string
  note?: string
  placeholder?: string
  title_text?: string
  hint?: string
  width_label?: string
  height_label?: string
  depth_label?: string
}

interface ConfiguratorOptions {
  hero?: {
    label: string
    title: string
    description: string
  }
  product_types?: string[]
  features?: FeatureOption[]
  materials?: MaterialOption[]
  colors?: string[]
  sections?: Record<string, ConfiguratorSection>
  submit?: {
    disclaimer: string
    button_text: string
  }
}

const fallbackHero = {
  label: 'КОНФИГУРАТОР',
  title: 'Создай свой светильник',
  description: 'Опишите идею — мы воплотим её в жизнь. Каждый светильник уникален и создаётся специально для вас.',
}

const fallbackSections: Record<string, ConfiguratorSection> = {
  product_type: { step: '01', title: 'Что необходимо изготовить' },
  features: { step: '02', title: 'Дополнительные функции' },
  material: { step: '03', title: 'Материал корпуса' },
  color: { step: '04', title: 'Цвет корпуса', note: 'Доступно более 40 цветов. Если нужного оттенка нет — укажите в комментарии.' },
  dimensions: {
    step: '05',
    title: 'Примерные размеры',
    width_label: 'Ширина (мм)',
    height_label: 'Высота (мм)',
    depth_label: 'Глубина (мм)',
    placeholder: 'например, 240',
    note: '* Размеры являются приблизительными. Точные параметры согласовываются при обсуждении проекта.',
  },
  files: {
    step: '06',
    title: 'Загрузка файлов',
    title_text: 'Перетащите файлы или нажмите',
    hint: 'Изображения, фото, эскизы, референсы — любые форматы',
  },
  description: {
    step: '07',
    title: 'Описание идеи',
    placeholder: 'Опишите максимально подробно: назначение, атмосферу, стиль интерьера, пожелания по свету и форме. Чем подробнее — тем точнее результат.',
  },
}

const fallbackSubmit = {
  disclaimer: 'Отправляя заявку, вы оформляете предзаказ, а не покупаете готовый товар. Стоимость и сроки согласовываются индивидуально.',
  button_text: 'ОТПРАВИТЬ ЗАЯВКУ',
}

const fallbackProductOptions = ['Настольный светильник', 'Ночник']

const fallbackFeatureOptions: FeatureOption[] = [
  { id: 'smart', label: 'Умная подсветка' },
  { id: 'rgbic', label: 'RGBIC' },
  { id: 'rgb', label: 'RGB' },
  { id: 'bluetooth', label: 'Bluetooth' },
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'battery', label: 'Аккумулятор' },
  { id: 'app', label: 'Управление через приложение' },
  { id: 'usbc', label: 'USB Type-C' },
] 

const fallbackMaterialOptions: MaterialOption[] = [
  { id: 'pla', label: 'PLA', fullName: 'Полимолочная кислота', color: '#00c45a', tags: ['Био', '14 цв', 'Мат'] },
  { id: 'petg', label: 'PETG', fullName: 'Полиэтилентерефталат', color: '#7b61ff', tags: ['Прозр', '8 цв', 'Проч'] },
  { id: 'asa', label: 'ASA', fullName: 'Акрилонитрил-стирол-акрилат', color: '#ff4d00', tags: ['УФ', '12 цв', 'Жёст'] },
] 

const fallbackColorSwatches = [
  '#1a1a1a', '#ffffff', '#ff4d00', '#58cc02', '#ffd600',
  '#7b61ff', '#00c45a', '#ec8383', '#96d3e6', '#f5f0e8',
  '#c84b00', '#3e9e00', '#b08d4a', '#6b6555', '#1a1a2e',
]

const options = ref<ConfiguratorOptions | null>(null)

const hero = computed(() => options.value?.hero || fallbackHero)
const sections = computed(() => ({ ...fallbackSections, ...(options.value?.sections || {}) }))
const submitContent = computed(() => options.value?.submit || fallbackSubmit)
const productOptions = computed(() => options.value?.product_types?.length ? options.value.product_types : fallbackProductOptions)
const featureOptions = computed(() => options.value?.features?.length ? options.value.features : fallbackFeatureOptions)
const materialOptions = computed(() => options.value?.materials?.length ? options.value.materials : fallbackMaterialOptions)
const colorSwatches = computed(() => options.value?.colors?.length ? options.value.colors : fallbackColorSwatches)

onMounted(async () => {
  try {
    const res = await fetch('/api/configurator/options')
    if (res.ok) options.value = await res.json()
  } catch {
    options.value = null
  }
})

function toggleFeature(id: string) {
  const idx = configuratorState.features.indexOf(id)
  if (idx === -1) configuratorState.features.push(id)
  else configuratorState.features.splice(idx, 1)
}

function productTypeIcon(label: string): string {
  return label.toLowerCase().includes('ноч') ? 'lamp-night' : 'lamp-desk'
}

function featureIcon(id: string): string {
  const map: Record<string, string> = {
    smart: 'sparkles',
    rgbic: 'sparkles',
    rgb: 'sparkles',
    bluetooth: 'brief',
    wifi: 'wifi',
    battery: 'shield',
    app: 'phone',
    usbc: 'usbc',
  }

  return map[id] || 'check'
}

function addFiles(list: FileList) {
  files.push(...Array.from(list))
}

function removeFile(i: number) {
  files.splice(i, 1)
}

const fileInput = ref<HTMLInputElement | null>(null)

function triggerFilePicker() {
  fileInput.value?.click()
}

function setDimension(key: 'widthMm' | 'heightMm' | 'depthMm', e: Event) {
  const val = (e.target as HTMLInputElement).value
  configuratorState[key] = val === '' ? null : Number(val)
}

const uploading = ref(false)

async function submitForm() {
  if (uploading.value) return
  uploading.value = true

  try {
    const uploadedUrls: string[] = []

    for (const file of files) {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'configurator')

      const res = await fetch('/api/upload', { method: 'POST', body: form })
      if (res.ok) {
        const data = await res.json()
        uploadedUrls.push(data.url)
      }
    }

    configuratorState.fileUrls = uploadedUrls
    persistConfigurator()

    router.push('/checkout?from=constructor')
  } finally {
    uploading.value = false
  }
}

watch(configuratorState, persistConfigurator, { deep: true })
</script>

<template>
  <section class="cf-hero">
    <div class="cf-hero__inner">
      <p class="cf-hero__label">{{ hero.label }}</p>
      <h1 class="cf-hero__title">{{ hero.title }}</h1>
      <p class="cf-hero__desc">{{ hero.description }}</p>
    </div>
  </section>

  <div class="cf-form">
    <!-- Section 01: Product type -->
    <section class="cf-section cf-section--product">
      <div class="cf-section__header">
        <div class="cf-step">{{ sections.product_type.step }}</div>
        <h2 class="cf-section__title">{{ sections.product_type.title }}</h2>
      </div>
      <div class="cf-section__body">
        <div class="cf-product-grid">
          <button
            v-for="opt in productOptions"
            :key="opt"
            :class="['cf-product-card', { active: configuratorState.productType === opt }]"
            @click="configuratorState.productType = opt"
          >
            <div class="cf-product-icon">
              <AppIcon :name="productTypeIcon(opt)" :size="36" :stroke-width="2.4" />
            </div>
            <span class="cf-product-label">{{ opt }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Section 02: Description -->
    <section class="cf-section cf-section--description">
      <div class="cf-section__header">
        <div class="cf-step">{{ sections.description.step }}</div>
        <h2 class="cf-section__title">{{ sections.description.title }}</h2>
      </div>
      <div class="cf-section__body">
        <textarea
          class="cf-textarea"
          rows="6"
          :value="configuratorState.description"
          @input="configuratorState.description = ($event.target as HTMLTextAreaElement).value"
          :placeholder="sections.description.placeholder"
        />
      </div>
    </section>

    <!-- Section 03: Files -->
    <section class="cf-section cf-section--files">
      <div class="cf-section__header">
        <div class="cf-step">{{ sections.files.step }}</div>
        <h2 class="cf-section__title">{{ sections.files.title }}</h2>
      </div>
      <div class="cf-section__body">
        <div class="cf-dropzone" @click="triggerFilePicker" @dragover.prevent @drop.prevent="addFiles(($event as DragEvent).dataTransfer!.files)">
          <div class="cf-dropzone__icon">
            <AppIcon name="upload" :size="26" :stroke-width="2.2" />
          </div>
          <div class="cf-dropzone__text">
            <p class="cf-dropzone__title">{{ sections.files.title_text }}</p>
            <p class="cf-dropzone__hint">{{ sections.files.hint }}</p>
          </div>
          <input ref="fileInput" type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.dwg,.dxf,.svg" hidden @change="addFiles(($event.target as HTMLInputElement).files!)" />
        </div>
        <div v-if="files.length" class="cf-file-list">
          <div v-for="(f, i) in files" :key="i" class="cf-file-item">
            <span class="cf-file-name">{{ f.name }}</span>
            <span class="cf-file-size">{{ (f.size / 1024).toFixed(1) }} KB</span>
            <button class="cf-file-remove" @click="removeFile(i)">✕</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 04: Dimensions -->
    <section class="cf-section cf-section--dimensions">
      <div class="cf-section__header">
        <div class="cf-step">{{ sections.dimensions.step }}</div>
        <h2 class="cf-section__title">{{ sections.dimensions.title }}</h2>
      </div>
      <div class="cf-section__body">
        <div class="cf-dim-grid">
          <label class="cf-field">
            <span class="cf-field__label">{{ sections.dimensions.width_label }}</span>
            <input
              class="cf-input"
              type="number" min="1"
              :value="configuratorState.widthMm ?? ''"
              @input="setDimension('widthMm', $event)"
              :placeholder="sections.dimensions.placeholder"
            />
          </label>
          <label class="cf-field">
            <span class="cf-field__label">{{ sections.dimensions.height_label }}</span>
            <input
              class="cf-input"
              type="number" min="1"
              :value="configuratorState.heightMm ?? ''"
              @input="setDimension('heightMm', $event)"
              :placeholder="sections.dimensions.placeholder"
            />
          </label>
          <label class="cf-field">
            <span class="cf-field__label">{{ sections.dimensions.depth_label }}</span>
            <input
              class="cf-input"
              type="number" min="1"
              :value="configuratorState.depthMm ?? ''"
              @input="setDimension('depthMm', $event)"
              :placeholder="sections.dimensions.placeholder"
            />
          </label>
        </div>
        <p class="cf-dim-note">{{ sections.dimensions.note }}</p>
      </div>
    </section>

    <!-- Section 05: Features -->
    <section class="cf-section cf-section--features">
      <div class="cf-section__header">
        <div class="cf-step">{{ sections.features.step }}</div>
        <h2 class="cf-section__title">{{ sections.features.title }}</h2>
      </div>
      <div class="cf-section__body">
        <div class="cf-chips">
          <button
            v-for="opt in featureOptions"
            :key="opt.id"
            :class="['cf-chip', { active: configuratorState.features.includes(opt.id) }]"
            @click="toggleFeature(opt.id)"
          >
            <AppIcon :name="featureIcon(opt.id)" :size="15" :stroke-width="2" />
            <span>{{ opt.label }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Section 06: Material -->
    <section class="cf-section cf-section--material">
      <div class="cf-section__header">
        <div class="cf-step">{{ sections.material.step }}</div>
        <h2 class="cf-section__title">{{ sections.material.title }}</h2>
      </div>
      <div class="cf-section__body">
        <div class="cf-material-grid">
          <button
            v-for="mat in materialOptions"
            :key="mat.id"
            :class="['cf-material-card', { active: configuratorState.material === mat.id }]"
            @click="configuratorState.material = mat.id"
          >
            <div class="cf-mat-circle" :style="{ background: mat.color }">
              <span>{{ mat.label }}</span>
            </div>
            <p class="cf-mat-name">{{ mat.fullName }}</p>
            <div class="cf-mat-tags">
              <span v-for="tag in mat.tags" :key="tag" class="cf-mat-tag" :style="{ background: mat.color }">
                <AppIcon name="check" :size="11" :stroke-width="2" />
                {{ tag }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- Section 07: Color -->
    <section class="cf-section cf-section--color">
      <div class="cf-section__header">
        <div class="cf-step">{{ sections.color.step }}</div>
        <h2 class="cf-section__title">{{ sections.color.title }}</h2>
      </div>
      <div class="cf-section__body">
        <div class="cf-swatches">
          <button
            v-for="c in colorSwatches"
            :key="c"
            :class="['cf-swatch', { active: configuratorState.colorHex === c }]"
            :style="{ background: c }"
            @click="configuratorState.colorHex = c"
          />
        </div>
        <p class="cf-color-note">{{ sections.color.note }}</p>
      </div>
    </section>

    <!-- Submit -->
    <div class="cf-submit">
      <p class="cf-disclaimer">
        {{ submitContent.disclaimer }}
      </p>
      <button class="cf-submit-btn" :disabled="uploading" @click="submitForm">
        {{ submitContent.button_text }}
        <AppIcon name="arrow-right" :size="14" :stroke-width="2" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.cf-hero {
  background: #1a1a1a;
  padding: 80px;
}

.cf-hero__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cf-hero__label {
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #ff4d00;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cf-hero__title {
  font-family: Helvetica, sans-serif;
  font-size: 60px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.05;
  white-space: pre-line;
}

.cf-hero__desc {
  font-family: Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #f5f0e8;
  margin: 0;
  padding-top: 8px;
  line-height: 1.6;
  max-width: 520px;
}

.cf-form {
  max-width: 1280px;
  margin: 0 auto;
  padding: 80px;
  display: flex;
  flex-direction: column;
  gap: 64px;
}

.cf-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.cf-section--product {
  order: 1;
}

.cf-section--features {
  order: 2;
}

.cf-section--material {
  order: 3;
}

.cf-section--color {
  order: 4;
}

.cf-section--dimensions {
  order: 5;
}

.cf-section--files {
  order: 6;
}

.cf-section--description {
  order: 7;
}

.cf-section__header {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
}

.cf-step {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ff4d00;
  box-shadow: 0 4px 0 #c84b00;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Helvetica, sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
}

.cf-section__title {
  font-family: Helvetica, sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.cf-section__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cf-product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.cf-product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 0;
  background: #f5f0e8;
  border: 2px solid #1a1a1a;
  border-radius: 24px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  color: #1a1a1a;
}

.cf-product-card:hover {
  border-color: #ff4d00;
}

.cf-product-card.active {
  border-color: #ff4d00;
  background: #fff5f0;
}

.cf-product-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cf-product-icon svg {
  color: #1a1a1a;
}

.cf-product-card.active .cf-product-icon svg {
  color: #ff4d00;
}

.cf-product-label {
  font-family: Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: inherit;
}

.cf-textarea {
  width: 100%;
  padding: 20px 24px;
  border: 1px solid #1a1a1a;
  border-radius: 20px;
  background: #ffffff;
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #1a1a1a;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  min-height: 80px;
}

.cf-textarea::placeholder {
  color: #6b6555;
}

.cf-textarea:focus {
  border-color: #ff4d00;
}

.cf-dropzone {
  border: 2px dashed #ff4d00;
  border-radius: 24px;
  padding: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.cf-dropzone:hover {
  background: #fff5f0;
}

.cf-dropzone__icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #ff4d00;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cf-dropzone__text {
  text-align: center;
}

.cf-dropzone__title {
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.cf-dropzone__hint {
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #6b6555;
  margin: 0;
}

.cf-file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cf-file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #ffffff;
  border: 1px solid #1a1a1a;
  border-radius: 8px;
  font-family: Helvetica, sans-serif;
  font-size: 14px;
}

.cf-file-name {
  flex: 1;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cf-file-size {
  color: #6b6555;
  white-space: nowrap;
}

.cf-file-remove {
  background: none;
  border: none;
  color: #6b6555;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
}

.cf-file-remove:hover {
  color: #ff4d00;
}

.cf-dim-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.cf-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cf-field__label {
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #6b6555;
}

.cf-input {
  padding: 17px 20px;
  border: 1px solid #1a1a1a;
  border-radius: 14px;
  background: #ffffff;
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #1a1a1a;
  outline: none;
  box-sizing: border-box;
  width: 100%;
  -moz-appearance: textfield;
}

.cf-input::-webkit-inner-spin-button {
  display: none;
}

.cf-input::placeholder {
  color: #6b6555;
}

.cf-input:focus {
  border-color: #ff4d00;
}

.cf-dim-note {
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #6b6555;
  margin: 12px 0 0;
  padding: 0;
}

.cf-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.cf-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: #1a1a1a;
  border: 1px solid #1a1a1a;
  border-radius: 9999px;
  font-family: Helvetica, sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.cf-chip:hover {
  border-color: #ff4d00;
}

.cf-chip.active {
  border-color: #ff4d00;
  background: #ff4d00;
}

.cf-chip svg {
  flex-shrink: 0;
}

.cf-material-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.cf-material-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 0;
  background: #f5f0e8;
  border: 2px solid #1a1a1a;
  border-radius: 24px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.cf-material-card:hover {
  border-color: #ff4d00;
}

.cf-material-card.active {
  border-color: #ff4d00;
}

.cf-mat-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 0 var(--mat-shadow, currentColor);
}

.cf-mat-circle span {
  font-family: Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}

.cf-mat-name {
  font-family: Helvetica, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: #6b6555;
  margin: 0;
  text-align: center;
}

.cf-mat-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.cf-mat-tag {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-family: Helvetica, sans-serif;
  font-size: 9px;
  font-weight: 700;
  color: #ffffff;
}

.cf-mat-tag svg {
  width: 11px;
  height: 11px;
}

.cf-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.cf-swatch {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid #1a1a1a;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.15);
}

.cf-swatch:hover {
  transform: scale(1.08);
}

.cf-swatch.active {
  border-color: #ff4d00;
  transform: scale(1.08);
}

.cf-color-note {
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #6b6555;
  margin: 8px 0 0;
  padding: 0;
}

.cf-input--budget {
  max-width: 400px;
}

.cf-submit {
  order: 8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 0;
  border-top: 1px solid #1a1a1a;
}

.cf-disclaimer {
  font-family: Arial, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #1a1a1a;
  text-align: center;
  margin: 0;
  max-width: 480px;
  line-height: 1.5;
}

.cf-submit-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 48px;
  background: #ff4d00;
  border: none;
  border-radius: 9999px;
  box-shadow: 0 4px 0 #c84b00;
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: background 0.2s;
}

.cf-submit-btn:hover {
  background: #e04400;
}

.cf-submit-btn svg {
  width: 14px;
  height: 14px;
}
</style>
