<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { configuratorState, files, persistConfigurator } from '../../stores/configurator'

const router = useRouter()

const productOptions = ['Настольный светильник', 'Ночник'] as const

const featureOptions = [
  { id: 'smart', label: 'Умная подсветка' },
  { id: 'rgbic', label: 'RGBIC' },
  { id: 'rgb', label: 'RGB' },
  { id: 'bluetooth', label: 'Bluetooth' },
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'battery', label: 'Аккумулятор' },
  { id: 'app', label: 'Управление через приложение' },
  { id: 'usbc', label: 'USB Type-C' },
] as const

const materialOptions = [
  { id: 'pla', label: 'PLA', fullName: 'Полимолочная кислота', color: '#00c45a', tags: ['Био', '14 цв', 'Мат'] },
  { id: 'petg', label: 'PETG', fullName: 'Полиэтилентерефталат', color: '#7b61ff', tags: ['Прозр', '8 цв', 'Проч'] },
  { id: 'asa', label: 'ASA', fullName: 'Акрилонитрил-стирол-акрилат', color: '#ff4d00', tags: ['УФ', '12 цв', 'Жёст'] },
] as const

const colorSwatches = [
  '#1a1a1a', '#ffffff', '#ff4d00', '#58cc02', '#ffd600',
  '#7b61ff', '#00c45a', '#ec8383', '#96d3e6', '#f5f0e8',
  '#c84b00', '#3e9e00', '#b08d4a', '#6b6555', '#1a1a2e',
] as const

function toggleFeature(id: string) {
  const idx = configuratorState.features.indexOf(id)
  if (idx === -1) configuratorState.features.push(id)
  else configuratorState.features.splice(idx, 1)
}

function addFiles(list: FileList) {
  files.push(...Array.from(list))
}

function removeFile(i: number) {
  files.splice(i, 1)
}

function setDimension(key: 'widthMm' | 'heightMm' | 'depthMm', e: Event) {
  const val = (e.target as HTMLInputElement).value
  configuratorState[key] = val === '' ? null : Number(val)
}

watch(configuratorState, persistConfigurator, { deep: true })
</script>

<template>
  <section class="cf-hero">
    <div class="cf-hero__inner">
      <p class="cf-hero__label">КОНФИГУРАТОР</p>
      <h1 class="cf-hero__title">Создай свой<br>светильник</h1>
      <p class="cf-hero__desc">
        Опишите идею — мы воплотим её в жизнь. Каждый светильник<br>
        уникален и создаётся специально для вас.
      </p>
    </div>
  </section>

  <div class="cf-form">
    <!-- Section 01: Product type -->
    <section class="cf-section">
      <div class="cf-section__header">
        <div class="cf-step">01</div>
        <h2 class="cf-section__title">Что необходимо изготовить</h2>
      </div>
      <div class="cf-section__body">
        <div class="cf-product-grid">
          <button
            v-for="opt in productOptions"
            :key="opt"
            :class="['cf-product-card', { active: configuratorState.productType === opt }]"
            @click="configuratorState.productType = opt"
          >
            <div v-if="opt === 'Настольный светильник'" class="cf-product-icon cf-product-icon--desk">
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                <path d="M2 18L7 4L16 2L25 4L30 18" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M16 2V0" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M10 18L16 14L22 18" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
              </svg>
            </div>
            <div v-else class="cf-product-icon cf-product-icon--night">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="16" stroke="currentColor" stroke-width="4"/>
                <path d="M18 6V12" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M18 24V30" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M6 18H12" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M24 18H30" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="cf-product-label">{{ opt }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Section 02: Description -->
    <section class="cf-section">
      <div class="cf-section__header">
        <div class="cf-step">02</div>
        <h2 class="cf-section__title">Описание идеи</h2>
      </div>
      <div class="cf-section__body">
        <textarea
          class="cf-textarea"
          rows="6"
          :value="configuratorState.description"
          @input="configuratorState.description = ($event.target as HTMLTextAreaElement).value"
          placeholder="Опишите максимально подробно: назначение, атмосферу, стиль интерьера, пожелания по свету и форме. Чем подробнее — тем точнее результат."
        />
      </div>
    </section>

    <!-- Section 03: Files -->
    <section class="cf-section">
      <div class="cf-section__header">
        <div class="cf-step">03</div>
        <h2 class="cf-section__title">Загрузка файлов</h2>
      </div>
      <div class="cf-section__body">
        <div class="cf-dropzone" @dragover.prevent @drop.prevent="addFiles(($event as DragEvent).dataTransfer!.files)">
          <div class="cf-dropzone__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 4V20" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 4L8 8" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 4L16 8" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="cf-dropzone__text">
            <p class="cf-dropzone__title">Перетащите файлы или нажмите</p>
            <p class="cf-dropzone__hint">Изображения, фото, эскизы, референсы — любые форматы</p>
          </div>
          <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.dwg,.dxf,.svg" hidden @change="addFiles(($event.target as HTMLInputElement).files!)" />
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
    <section class="cf-section">
      <div class="cf-section__header">
        <div class="cf-step">04</div>
        <h2 class="cf-section__title">Примерные размеры</h2>
      </div>
      <div class="cf-section__body">
        <div class="cf-dim-grid">
          <label class="cf-field">
            <span class="cf-field__label">Ширина (мм)</span>
            <input
              class="cf-input"
              type="number" min="1"
              :value="configuratorState.widthMm ?? ''"
              @input="setDimension('widthMm', $event)"
              placeholder="например, 240"
            />
          </label>
          <label class="cf-field">
            <span class="cf-field__label">Высота (мм)</span>
            <input
              class="cf-input"
              type="number" min="1"
              :value="configuratorState.heightMm ?? ''"
              @input="setDimension('heightMm', $event)"
              placeholder="например, 240"
            />
          </label>
          <label class="cf-field">
            <span class="cf-field__label">Глубина (мм)</span>
            <input
              class="cf-input"
              type="number" min="1"
              :value="configuratorState.depthMm ?? ''"
              @input="setDimension('depthMm', $event)"
              placeholder="например, 240"
            />
          </label>
        </div>
        <p class="cf-dim-note">* Размеры являются приблизительными. Точные параметры согласовываются при обсуждении проекта.</p>
      </div>
    </section>

    <!-- Section 05: Features -->
    <section class="cf-section">
      <div class="cf-section__header">
        <div class="cf-step">05</div>
        <h2 class="cf-section__title">Дополнительные функции</h2>
      </div>
      <div class="cf-section__body">
        <div class="cf-chips">
          <button
            v-for="opt in featureOptions"
            :key="opt.id"
            :class="['cf-chip', { active: configuratorState.features.includes(opt.id) }]"
            @click="toggleFeature(opt.id)"
          >
            <svg v-if="opt.id === 'smart'" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="3" stroke="currentColor" stroke-width="1"/>
              <path d="M7 1V3" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
              <path d="M7 11V13" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
              <path d="M1 7H3" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
              <path d="M11 7H13" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
            </svg>
            <svg v-else-if="opt.id === 'rgbic'" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="4" width="12" height="6" rx="1" stroke="currentColor" stroke-width="1"/>
              <rect x="1" y="4" width="12" height="3" rx="1" stroke="currentColor" stroke-width="1"/>
              <rect x="1" y="7" width="12" height="3" rx="1" stroke="currentColor" stroke-width="1"/>
            </svg>
            <svg v-else-if="opt.id === 'rgb'" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1"/>
              <circle cx="7" cy="4" r="1" fill="currentColor"/>
              <circle cx="9" cy="7" r="1" fill="currentColor"/>
              <circle cx="8" cy="10" r="1" fill="currentColor"/>
              <circle cx="5" cy="10" r="1" fill="currentColor"/>
              <circle cx="4" cy="7" r="1" fill="currentColor"/>
            </svg>
            <svg v-else-if="opt.id === 'bluetooth'" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 2L10 8L7 12V2L10 6L4 12" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else-if="opt.id === 'wifi'" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 5C3 3 5 2 7 2C9 2 11 3 13 5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
              <path d="M3 7.5C4.5 6.5 5.5 6 7 6C8.5 6 9.5 6.5 11 7.5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
              <path d="M5 10C6 9.5 6.5 9 7 9C7.5 9 8 9.5 9 10" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
              <circle cx="7" cy="12" r="0.5" fill="currentColor"/>
            </svg>
            <svg v-else-if="opt.id === 'battery'" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="2" width="11" height="10" rx="2" stroke="currentColor" stroke-width="1"/>
              <rect x="12" y="5" width="1" height="4" rx="0.5" stroke="currentColor" stroke-width="1"/>
              <rect x="2" y="3" width="9" height="8" rx="1" fill="currentColor"/>
            </svg>
            <svg v-else-if="opt.id === 'app'" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1"/>
              <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1"/>
            </svg>
            <svg v-else-if="opt.id === 'usbc'" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="5" width="10" height="4" rx="2" stroke="currentColor" stroke-width="1"/>
              <path d="M5 9L7 12L9 9" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ opt.label }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Section 06: Material -->
    <section class="cf-section">
      <div class="cf-section__header">
        <div class="cf-step">06</div>
        <h2 class="cf-section__title">Материал корпуса</h2>
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
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M8 3L4 7" stroke="white" stroke-width="1"/>
                  <path d="M3 4L5 6" stroke="white" stroke-width="1"/>
                </svg>
                {{ tag }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- Section 07: Color -->
    <section class="cf-section">
      <div class="cf-section__header">
        <div class="cf-step">07</div>
        <h2 class="cf-section__title">Цвет корпуса</h2>
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
        <p class="cf-color-note">Доступно более 40 цветов. Если нужного оттенка нет — укажите в комментарии.</p>
      </div>
    </section>

    <!-- Section 08: Budget -->
    <section class="cf-section">
      <div class="cf-section__header">
        <div class="cf-step">08</div>
        <h2 class="cf-section__title">Предпочитаемый бюджет</h2>
      </div>
      <div class="cf-section__body">
        <input
          class="cf-input cf-input--budget"
          type="text"
          inputmode="numeric"
          :value="configuratorState.budgetRange"
          @input="configuratorState.budgetRange = ($event.target as HTMLInputElement).value"
          placeholder="например, 5 000–8 000 ₽"
        />
      </div>
    </section>

    <!-- Section 09: Comments -->
    <section class="cf-section">
      <div class="cf-section__header">
        <div class="cf-step">09</div>
        <h2 class="cf-section__title">Дополнительные комментарии</h2>
      </div>
      <div class="cf-section__body">
        <textarea
          class="cf-textarea"
          rows="4"
          :value="configuratorState.comments"
          @input="configuratorState.comments = ($event.target as HTMLTextAreaElement).value"
          placeholder="Любые дополнительные пожелания, вопросы или уточнения..."
        />
      </div>
    </section>

    <!-- Submit -->
    <div class="cf-submit">
      <p class="cf-disclaimer">
        Отправляя заявку, вы оформляете предзаказ, а не покупаете готовый<br>
        товар. Стоимость и сроки согласовываются индивидуально.
      </p>
      <button class="cf-submit-btn" @click="router.push('/checkout')">
        ОТПРАВИТЬ ЗАЯВКУ
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M4 2L10 8L4 14" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
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
}

.cf-hero__desc {
  font-family: Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #f5f0e8;
  margin: 0;
  padding-top: 8px;
  line-height: 1.6;
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
