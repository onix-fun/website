<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { navItems } from '@/components/header'
import Breadcrumbs from '@/components/Breadcrumbs.vue'

const route = useRoute()
const router = useRouter()

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
        <div v-if="status === 'loading'" class="cr-box">
          <p class="cr-loading">Проверяем статус заявки...</p>
        </div>

        <div v-else-if="status === 'success'" class="cr-box cr-box--success">
          <div class="cr-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="#58cc02" stroke-width="3" />
              <path d="M16 24L22 30L32 19" stroke="#58cc02" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <h1 class="cr-title">Заявка №{{ orderId }} принята!</h1>
          <p class="cr-desc">
            Мы свяжемся с вами в ближайшее время для уточнения деталей
            и подтверждения стоимости.
          </p>
          <button class="cr-btn" @click="router.push('/')">На главную</button>
        </div>

        <div v-else class="cr-box cr-box--error">
          <div class="cr-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="#ff4d00" stroke-width="3" />
              <path d="M18 18L30 30M30 18L18 30" stroke="#ff4d00" stroke-width="3" stroke-linecap="round" />
            </svg>
          </div>
          <h1 class="cr-title">Заявка не найдена</h1>
          <p class="cr-desc">
            Проверьте номер заказа или попробуйте оформить заявку заново.
          </p>
          <button class="cr-btn" @click="router.push('/checkout')">Вернуться к оформлению</button>
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
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 80px 120px;
}

.cr-inner {
  max-width: 1280px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.cr-box {
  text-align: center;
  max-width: 480px;
  width: 100%;
}

.cr-icon {
  margin-bottom: 24px;
}

.cr-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px;
}

.cr-desc {
  font-size: 16px;
  font-weight: 400;
  color: #6b6555;
  margin: 0 0 32px;
  line-height: 1.5;
}

.cr-loading {
  font-size: 16px;
  color: #6b6555;
}

.cr-btn {
  padding: 14px 40px;
  border: none;
  border-radius: 9999px;
  background: #ff4d00;
  color: #fff;
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.cr-btn:hover {
  background: #e04400;
}
</style>
