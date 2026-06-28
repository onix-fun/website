<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { configuratorState, files, clearConfigurator } from '../../stores/configurator'

const router = useRouter()
const submitting = ref(false)
const submitted = ref(false)
const error = ref('')

const contactName = ref('')
const contactPhone = ref('')
const contactEmail = ref('')

async function submit() {
  if (!contactName.value.trim() || !contactPhone.value.trim()) {
    error.value = 'Заполните имя и телефон'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const formData = new FormData()
    formData.append('data', JSON.stringify({
      product_type: configuratorState.productType,
      description: configuratorState.description,
      width_mm: configuratorState.widthMm,
      height_mm: configuratorState.heightMm,
      depth_mm: configuratorState.depthMm,
      features: configuratorState.features,
      material: configuratorState.material,
      color_hex: configuratorState.colorHex,
      budget_range: configuratorState.budgetRange,
      comments: configuratorState.comments,
      contact_name: contactName.value.trim(),
      contact_phone: contactPhone.value.trim(),
      contact_email: contactEmail.value.trim(),
    }))

    for (const f of files) {
      formData.append('files', f)
    }

    const res = await fetch('/api/configurator/orders', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      throw new Error(await res.text())
    }

    submitted.value = true
    clearConfigurator()
  } catch (e: any) {
    error.value = e.message || 'Ошибка отправки'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div v-if="submitted" class="pf-success">
    <h2>Заявка отправлена!</h2>
    <p>Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
    <button class="pf-btn pf-btn--primary" @click="router.push('/')">На главную</button>
  </div>

  <div v-else class="pf-layout">
    <div class="pf-summary">
      <h2 class="pf-heading">Проверьте вашу заявку</h2>

      <div class="pf-row">
        <span class="pf-label">Тип изделия</span>
        <span class="pf-value">{{ configuratorState.productType || '—' }}</span>
      </div>
      <div v-if="configuratorState.description" class="pf-row">
        <span class="pf-label">Описание</span>
        <span class="pf-value">{{ configuratorState.description }}</span>
      </div>
      <div v-if="configuratorState.widthMm || configuratorState.heightMm || configuratorState.depthMm" class="pf-row">
        <span class="pf-label">Габариты</span>
        <span class="pf-value">
          {{ configuratorState.widthMm ?? '?' }} × {{ configuratorState.heightMm ?? '?' }} × {{ configuratorState.depthMm ?? '?' }} мм
        </span>
      </div>
      <div v-if="configuratorState.features.length" class="pf-row">
        <span class="pf-label">Особенности</span>
        <span class="pf-value">{{ configuratorState.features.join(', ') }}</span>
      </div>
      <div v-if="configuratorState.material" class="pf-row">
        <span class="pf-label">Материал</span>
        <span class="pf-value">{{ configuratorState.material }}</span>
      </div>
      <div v-if="configuratorState.colorHex" class="pf-row">
        <span class="pf-label">Цвет</span>
        <span class="pf-value">{{ configuratorState.colorHex }}</span>
      </div>
      <div v-if="files.length" class="pf-row">
        <span class="pf-label">Файлы</span>
        <span class="pf-value">{{ files.length }} файл(а)</span>
      </div>
      <div v-if="configuratorState.budgetRange" class="pf-row">
        <span class="pf-label">Бюджет</span>
        <span class="pf-value">{{ configuratorState.budgetRange }}</span>
      </div>
      <div v-if="configuratorState.comments" class="pf-row">
        <span class="pf-label">Комментарии</span>
        <span class="pf-value">{{ configuratorState.comments }}</span>
      </div>
    </div>

    <div class="pf-contact">
      <h3 class="pf-heading pf-heading--sm">Контактные данные</h3>
      <p class="pf-subtitle">Оставьте свои контакты, и мы свяжемся с вами</p>

      <div class="pf-fields">
        <label class="pf-field">
          <span>Имя <span class="pf-req">*</span></span>
          <input v-model="contactName" type="text" placeholder="Ваше имя" />
        </label>
        <label class="pf-field">
          <span>Телефон <span class="pf-req">*</span></span>
          <input v-model="contactPhone" type="tel" placeholder="+7 (999) 123-45-67" />
        </label>
        <label class="pf-field">
          <span>Email</span>
          <input v-model="contactEmail" type="email" placeholder="example@mail.ru" />
        </label>
      </div>

      <div v-if="error" class="pf-error">{{ error }}</div>

      <div class="pf-nav">
        <button class="pf-btn pf-btn--ghost" :disabled="submitting" @click="router.push('/constructor')">Назад</button>
        <button class="pf-btn pf-btn--primary" :disabled="submitting" @click="submit">
          {{ submitting ? 'Отправка…' : 'Отправить заявку' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pf-success {
  width: 100%;
  text-align: center;
  padding: 80px 0;
  font-family: Helvetica, sans-serif;
}

.pf-success h2 {
  font-size: 28px;
  color: #3a3026;
  margin: 0 0 16px;
}

.pf-success p {
  font-size: 16px;
  color: #6b6555;
  margin: 0 0 32px;
}

.pf-layout {
  display: flex;
  gap: 48px;
}

.pf-summary {
  flex: 1;
  min-width: 0;
}

.pf-contact {
  width: 400px;
  flex-shrink: 0;
}

.pf-heading {
  font-family: Helvetica, sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #3a3026;
  margin: 0 0 24px;
}

.pf-heading--sm {
  font-size: 22px;
  margin-bottom: 8px;
}

.pf-subtitle {
  font-family: Helvetica, sans-serif;
  font-size: 16px;
  color: #6b6555;
  margin: 0 0 24px;
}

.pf-row {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #e8e2d6;
  font-family: Helvetica, sans-serif;
  font-size: 15px;
}

.pf-label {
  width: 120px;
  flex-shrink: 0;
  color: #b0a898;
}

.pf-value {
  color: #3a3026;
  word-break: break-word;
}

.pf-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pf-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  color: #3a3026;
}

.pf-field input {
  padding: 12px;
  border: 1px solid #d4cdbe;
  border-radius: 8px;
  font-family: Helvetica, sans-serif;
  font-size: 15px;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
}

.pf-field input:focus {
  border-color: #ff4d00;
}

.pf-field input::placeholder {
  color: #b0a898;
}

.pf-req {
  color: #ff4d00;
}

.pf-error {
  margin-top: 16px;
  padding: 12px;
  background: #fff0f0;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  color: #cc0000;
}

.pf-nav {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.pf-btn {
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-family: Helvetica, sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.pf-btn--primary {
  background: #ff4d00;
  color: #fff;
}

.pf-btn--primary:disabled {
  background: #d4cdbe;
  cursor: default;
}

.pf-btn--primary:not(:disabled):hover {
  background: #e04400;
}

.pf-btn--ghost {
  background: transparent;
  color: #6b6555;
  border: 1px solid #d4cdbe;
}

.pf-btn--ghost:disabled {
  opacity: 0.5;
  cursor: default;
}

.pf-btn--ghost:not(:disabled):hover {
  background: #eee8dc;
}
</style>
