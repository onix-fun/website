<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { preorderData, clearPreorder } from '@/stores/preorder'

const router = useRouter()

const name = ref('')
const email = ref('')
const phone = ref('')
const address = ref('')
const comment = ref('')

const agreeTerms = ref(false)
const agreePrivacy = ref(false)
const agreeCorrect = ref(false)
const agreePrelim = ref(false)

const submitting = ref(false)
const error = ref('')

const allChecked = computed(() =>
  agreeTerms.value && agreePrivacy.value && agreeCorrect.value && agreePrelim.value
)

async function submit() {
  if (!name.value.trim()) {
    error.value = 'Укажите имя'
    return
  }
  if (!phone.value.trim()) {
    error.value = 'Укажите телефон'
    return
  }
  if (!allChecked.value) {
    error.value = 'Примите все соглашения'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const res = await fetch('/api/preorders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        address: address.value.trim(),
        comment: comment.value.trim(),
        order_data: preorderData.orderData || {},
        origin: preorderData.origin,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text)
    }

    const { id } = await res.json()
    clearPreorder()
    router.push(`/checkout/${id}/result`)
  } catch (e: any) {
    error.value = e.message || 'Ошибка отправки'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="co-page">

    <!-- Yellow banner -->
    <div class="co-banner">
      <div class="co-inner">
        <span class="co-banner-dot" />
        <p class="co-banner-text">
          Вы оформляете предварительную заявку на изготовление изделия — не покупку готового товара.
        </p>
      </div>
    </div>

    <!-- Hero -->
    <section class="co-hero">
      <div class="co-inner">
        <span class="co-hero-label">ОФОРМЛЕНИЕ</span>
        <h1 class="co-hero-title">Предзаказ</h1>
        <p class="co-hero-desc">
          Заполните форму — мы свяжемся с вами для согласования всех деталей,
          после чего подтвердим итоговую стоимость и начнём изготовление.
        </p>
      </div>
    </section>

    <!-- Steps -->
    <section class="co-steps">
      <div class="co-inner">
        <div class="co-steps-row">
          <div class="co-step">
            <div class="co-step-circle"><span class="co-step-num">01</span></div>
            <span class="co-step-label">Получение заявки</span>
          </div>
          <div class="co-step-connector" />
          <div class="co-step">
            <div class="co-step-circle"><span class="co-step-num">02</span></div>
            <span class="co-step-label">Оценка проекта</span>
          </div>
          <div class="co-step-connector" />
          <div class="co-step">
            <div class="co-step-circle"><span class="co-step-num">03</span></div>
            <span class="co-step-label">Согласование деталей</span>
          </div>
          <div class="co-step-connector" />
          <div class="co-step">
            <div class="co-step-circle"><span class="co-step-num">04</span></div>
            <span class="co-step-label">Подтверждение стоимости</span>
          </div>
          <div class="co-step-connector" />
          <div class="co-step">
            <div class="co-step-circle"><span class="co-step-num">05</span></div>
            <span class="co-step-label">Начало изготовления</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Form + sidebar -->
    <section class="co-form-section">
      <div class="co-inner">
        <div class="co-form-layout">

          <!-- Left: contact form -->
          <div class="co-form-card">
            <h2 class="co-form-heading">Контактные данные</h2>

            <div class="co-field">
              <label class="co-label">Имя</label>
              <input
                v-model="name"
                class="co-input"
                type="text"
                placeholder="Иван Иванов"
              />
            </div>

            <div class="co-field">
              <label class="co-label">Email</label>
              <input
                v-model="email"
                class="co-input"
                type="email"
                placeholder="ivan@example.com"
              />
            </div>

            <div class="co-field">
              <label class="co-label">Телефон</label>
              <input
                v-model="phone"
                class="co-input"
                type="tel"
                placeholder="+7 (999) 000-00-00"
              />
            </div>

            <div class="co-field">
              <label class="co-label">Адрес доставки</label>
              <input
                v-model="address"
                class="co-input"
                type="text"
                placeholder="Город, улица, дом, квартира"
              />
            </div>

            <div class="co-field">
              <label class="co-label">Комментарий</label>
              <textarea
                v-model="comment"
                class="co-textarea"
                placeholder="Любые дополнительные пожелания..."
              />
            </div>
          </div>

          <!-- Right: order summary -->
          <aside class="co-summary">
            <h3 class="co-summary-title">Сводка заказа</h3>

            <div v-if="preorderData.orderData" class="co-summary-card">
              <div class="co-summary-img" />
              <div class="co-summary-info">
                <p class="co-summary-name">{{ preorderData.orderData.product_name }}</p>
                <p class="co-summary-meta">
                  {{ [preorderData.orderData.material, preorderData.orderData.plastic].filter(Boolean).join(', ') }}
                </p>
              </div>
            </div>

            <div class="co-summary-divider">
              <div class="co-summary-row">
                <span class="co-summary-label">Ориентировочная стоимость</span>
                <span class="co-summary-value">{{ preorderData.orderData?.price_range || '—' }}</span>
              </div>
              <div class="co-summary-row">
                <span class="co-summary-label">Срок изготовления</span>
                <span class="co-summary-value">{{ preorderData.orderData?.production_time || '—' }}</span>
              </div>
              <div class="co-summary-row">
                <span class="co-summary-label">Доставка</span>
                <span class="co-summary-value">{{ preorderData.orderData?.delivery || '—' }}</span>
              </div>
            </div>

            <div class="co-summary-notice">
              <p>
                Это предварительные данные. Итоговые<br>
                стоимость и сроки уточняются после<br>
                согласования с мастером.
              </p>
            </div>
          </aside>

        </div>

        <!-- Checkboxes -->
        <div class="co-checkboxes">
          <label class="co-checkbox">
            <input v-model="agreeTerms" type="checkbox" class="co-checkbox-input" />
            <span class="co-checkbox-box" />
            <span class="co-checkbox-label">Согласен с пользовательским соглашением</span>
          </label>
          <label class="co-checkbox">
            <input v-model="agreePrivacy" type="checkbox" class="co-checkbox-input" />
            <span class="co-checkbox-box" />
            <span class="co-checkbox-label">Согласен с политикой конфиденциальности</span>
          </label>
          <label class="co-checkbox">
            <input v-model="agreeCorrect" type="checkbox" class="co-checkbox-input" />
            <span class="co-checkbox-box" />
            <span class="co-checkbox-label">Подтверждаю корректность введённых данных</span>
          </label>
          <label class="co-checkbox co-checkbox--wide">
            <input v-model="agreePrelim" type="checkbox" class="co-checkbox-input" />
            <span class="co-checkbox-box" />
            <span class="co-checkbox-label">
              Понимаю, что стоимость и сроки являются предварительными
              и могут быть уточнены после согласования проекта
            </span>
          </label>
        </div>

        <!-- Error -->
        <p v-if="error" class="co-error">{{ error }}</p>

        <!-- Submit button -->
        <button
          class="co-submit"
          :disabled="submitting"
          @click="submit"
        >
          <span>{{ submitting ? 'ОТПРАВКА...' : 'ОФОРМИТЬ ПРЕДЗАКАЗ' }}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <path d="M7 3L11 7L7 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </section>

  </div>
</template>

<style scoped>
.co-page {
  font-family: Helvetica, sans-serif;
  background: #f5f0e8;
}

.co-inner {
  max-width: 1280px;
  margin: 0 auto;
}

/* ---------- Banner ---------- */
.co-banner {
  background: #ffd600;
  padding: 24px 80px;
}

.co-banner .co-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.co-banner-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1a1a1a;
  flex-shrink: 0;
}

.co-banner-text {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
}

/* ---------- Hero ---------- */
.co-hero {
  padding: 64px 80px 48px;
}

.co-hero-label {
  display: block;
  font-size: 12px;
  font-weight: 400;
  color: #ff4d00;
  margin-bottom: 16px;
}

.co-hero-title {
  margin: 0 0 16px;
  font-size: 60px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.05;
}

.co-hero-desc {
  margin: 0;
  max-width: 520px;
  font-size: 15px;
  font-weight: 400;
  color: #6b6555;
  line-height: 1.6;
}

/* ---------- Steps ---------- */
.co-steps {
  padding: 0 80px 64px;
}

.co-steps-row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.co-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 216px;
}

.co-step-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #1a1a1a;
  border: 1px solid #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.co-step-num {
  font-size: 11px;
  font-weight: 700;
  color: #f5f0e8;
}

.co-step-label {
  font-size: 11px;
  font-weight: 400;
  color: #6b6555;
  text-align: center;
}

.co-step-connector {
  width: 40px;
  height: 1px;
  background: #1a1a1a;
  margin-bottom: 25px;
  flex-shrink: 0;
}

/* ---------- Form section ---------- */
.co-form-section {
  padding: 0 80px 80px;
}

.co-form-layout {
  display: flex;
  gap: 48px;
  margin-bottom: 40px;
}

/* ---------- Contact card ---------- */
.co-form-card {
  flex: 1;
  min-width: 0;
  background: #1a1a1a;
  border-radius: 24px;
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.co-form-heading {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 700;
  color: #f5f0e8;
}

.co-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.co-label {
  font-size: 12px;
  font-weight: 400;
  color: #f5f0e8;
}

.co-input {
  height: 51px;
  padding: 17px 20px;
  border: 1px solid #f5f0e8;
  border-radius: 14px;
  background: #f5f0e8;
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  width: 100%;
}

.co-input::placeholder {
  color: #6b6555;
}

.co-input:focus {
  border-color: #ff4d00;
}

.co-textarea {
  padding: 14px 20px;
  min-height: 120px;
  border: 1px solid #f5f0e8;
  border-radius: 14px;
  background: #f5f0e8;
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  width: 100%;
  resize: vertical;
}

.co-textarea::placeholder {
  color: #6b6555;
}

.co-textarea:focus {
  border-color: #ff4d00;
}

/* ---------- Order summary ---------- */
.co-summary {
  width: 360px;
  flex-shrink: 0;
  background: #1a1a1a;
  border-radius: 24px;
  padding: 32px;
  align-self: flex-start;
}

.co-summary-title {
  margin: 0 0 24px;
  font-size: 18px;
  font-weight: 700;
  color: #f5f0e8;
}

.co-summary-card {
  background: #fff0f0;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 4px 0 #e8d0c4;
  margin-bottom: 24px;
}

.co-summary-img {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: #1a1a1a;
  flex-shrink: 0;
}

.co-summary-info {
  flex: 1;
  min-width: 0;
}

.co-summary-name {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
}

.co-summary-meta {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: #6b6555;
}

.co-summary-empty {
  margin: 0 0 24px;
  font-size: 12px;
  color: #6b6555;
}

.co-summary-divider {
  border-top: 1px solid #1a1a1a;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.co-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.co-summary-label {
  font-size: 12px;
  font-weight: 400;
  color: #6b6555;
}

.co-summary-value {
  font-size: 12px;
  font-weight: 700;
  color: #f5f0e8;
  text-align: right;
  flex-shrink: 0;
}

.co-summary-notice {
  background: #ff4d00;
  border-radius: 14px;
  padding: 16px;
}

.co-summary-notice p {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: #f5f0e8;
  line-height: 1.5;
}

/* ---------- Checkboxes ---------- */
.co-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.co-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  cursor: pointer;
  position: relative;
}

.co-checkbox-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.co-checkbox-box {
  width: 22px;
  height: 22px;
  border: 2px solid #1a1a1a;
  border-radius: 6px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, border-color 0.15s;
  margin-top: 1px;
}

.co-checkbox-input:checked + .co-checkbox-box {
  background: #1a1a1a;
  border-color: #1a1a1a;
}

.co-checkbox-input:checked + .co-checkbox-box::after {
  content: '';
  width: 12px;
  height: 6px;
  border-left: 2px solid #f5f0e8;
  border-bottom: 2px solid #f5f0e8;
  transform: rotate(-45deg) translateY(-1px);
}

.co-checkbox-label {
  font-size: 13px;
  font-weight: 400;
  color: #6b6555;
  line-height: 1.5;
}

.co-checkbox--wide .co-checkbox-label {
  max-width: 700px;
}

/* ---------- Error ---------- */
.co-error {
  margin: 0 0 16px;
  padding: 12px;
  background: #fff0f0;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  font-size: 14px;
  color: #cc0000;
}

/* ---------- Submit ---------- */
.co-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 54px;
  padding: 18px 32px;
  border: none;
  border-radius: 9999px;
  background: #ff4d00;
  color: #fff;
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.co-submit:hover:not(:disabled) {
  background: #e04400;
}

.co-submit:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
