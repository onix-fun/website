<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { navItems } from '@/components/header'
import Breadcrumbs from '@/components/Breadcrumbs.vue'

const route = useRoute()
type Status = 'loading' | 'success' | 'error'
const status = ref<Status>('loading')
const orderId = ref('')

onMounted(async () => {
  orderId.value = route.params.id as string
  try {
    const res = await fetch(`/api/preorders/${orderId.value}`)
    if (res.ok) {
      status.value = 'success'
    } else {
      status.value = 'error'
    }
  } catch {
    status.value = 'error'
  }
})
</script>

<template>
  <AppHeader logo="/favicon.svg" :items="navItems" />
  <main>
    <Breadcrumbs />
    <div class="cr-page">
      <div class="cr-inner">

        <!-- Loading -->
        <div v-if="status === 'loading'" class="cr-box">
          <p class="cr-loading">Проверяем статус заявки...</p>
        </div>

        <!-- Success (Figma) -->
        <div v-else-if="status === 'success'" class="cr-box cr-box--success">
          <div class="cr-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="4" y="4" width="72" height="72" rx="36" fill="#58cc02" />
              <rect x="4" y="4" width="72" height="72" rx="36" stroke="#58cc02" stroke-width="0" />
              <path d="M28 41L37 50L53 32" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="cr-icon-shadow" />

          <h1 class="cr-title">Заявка отправлена!</h1>

          <p class="cr-desc">
            Мы свяжемся с вами в течение 24 часов для согласования деталей<br>
            вашего уникального светильника.
          </p>

          <router-link to="/catalog" class="cr-btn">
            <span>СМОТРЕТЬ МОДЕЛИ</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6H9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <path d="M6 2.5L9.5 6L6 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </router-link>
        </div>

        <!-- Error -->
        <div v-else class="cr-box cr-box--error">
          <div class="cr-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="4" y="4" width="72" height="72" rx="36" fill="#ff4d00" />
              <path d="M32 32L48 48M48 32L32 48" stroke="white" stroke-width="4" stroke-linecap="round" />
            </svg>
          </div>
          <h1 class="cr-title">Заявка не найдена</h1>
          <p class="cr-desc">Проверьте номер заказа или оформите заявку заново.</p>
          <router-link to="/checkout" class="cr-btn">
            <span>ВЕРНУТЬСЯ К ОФОРМЛЕНИЮ</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6H9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <path d="M6 2.5L9.5 6L6 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </router-link>
        </div>

      </div>
    </div>
  </main>
  <AppFooter />
</template>

<style scoped>
.cr-page {
  font-family: Helvetica, sans-serif;
  background: #f5f0e8;
  padding: 120px 80px;
  display: flex;
  justify-content: center;
}

.cr-inner {
  max-width: 1280px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.cr-box {
  width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.cr-icon {
  position: relative;
  width: 80px;
  height: 80px;
}

.cr-icon svg {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 8px 0 #3e9e00);
}

.cr-box--error .cr-icon svg {
  filter: drop-shadow(0 8px 0 #c84b00);
}

.cr-title {
  font-size: 48px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin: 0;
  line-height: 1.1;
}

.cr-desc {
  font-size: 16px;
  font-weight: 400;
  color: #6b6555;
  text-align: center;
  margin: 0;
  line-height: 1.6;
  padding: 0 23px;
}

.cr-loading {
  font-size: 16px;
  color: #6b6555;
}

.cr-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border: none;
  border-radius: 9999px;
  background: #ff4d00;
  color: #fff;
  font-family: Helvetica, sans-serif;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  transition: background 0.2s;
  box-shadow: 0 4px 0 #c84b00;
}

.cr-btn:hover {
  background: #e04400;
}
</style>
