<script setup lang="ts">
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { navItems } from '@/components/header'
import Breadcrumbs from '@/components/Breadcrumbs.vue'

defineProps<{
  errorCode: string
  title: string
  description: string
}>()
</script>

<template>
  <AppHeader logo="/favicon.svg" :items="navItems" />
  <main>
    <Breadcrumbs />
    <section class="ep-section">
      <div class="ep-bg">
        <div class="ep-bg-ring ep-bg-ring--1" />
        <div class="ep-bg-ring ep-bg-ring--2" />
        <div class="ep-bg-ring ep-bg-ring--3" />
        <div class="ep-bg-dot ep-bg-dot--o1" />
        <div class="ep-bg-dot ep-bg-dot--g1" />
        <div class="ep-bg-dot ep-bg-dot--y1" />
        <div class="ep-bg-dot ep-bg-dot--o2" />
        <div class="ep-bg-dot ep-bg-dot--g2" />
        <div class="ep-bg-dot ep-bg-dot--y2" />
        <div class="ep-bg-blur ep-bg-blur--orange" />
        <div class="ep-bg-blur ep-bg-blur--green" />
      </div>
      <div class="ep-inner">
        <div class="ep-content">
          <h1 class="ep-code">{{ errorCode }}</h1>
          <h2 class="ep-title">{{ title }}</h2>
          <p class="ep-desc">{{ description }}</p>
          <router-link to="/" class="ep-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7H11" stroke="white" stroke-width="1.5" stroke-linecap="round" />
              <path d="M7 3L3 7L7 11" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>НА ГЛАВНУЮ</span>
          </router-link>
        </div>
      </div>
    </section>
  </main>
  <AppFooter />
</template>

<style scoped>
.ep-section {
  background: #f5f0e8;
  padding: 180px 80px 80px;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;
  min-height: 705px;
}

.ep-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* --- concentric outline rings --- */
.ep-bg-ring {
  position: absolute;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ep-bg-ring--1 {
  width: 634px;
  height: 634px;
  border: 2px solid #929292;
}

.ep-bg-ring--2 {
  width: 423px;
  height: 423px;
  border: 2px solid #929292;
}

.ep-bg-ring--3 {
  width: 211px;
  height: 211px;
  border: 2px solid #ff4d00;
}

/* --- filled dots --- */
.ep-bg-dot {
  position: absolute;
  border-radius: 50%;
}

.ep-bg-dot--o1 {
  width: 85px;
  height: 85px;
  background: #ff4d00;
  top: 10%;
  right: 15%;
}

.ep-bg-dot--g1 {
  width: 56px;
  height: 56px;
  background: #58cc02;
  top: 18%;
  left: 12%;
}

.ep-bg-dot--y1 {
  width: 35px;
  height: 35px;
  background: #ffd600;
  bottom: 25%;
  right: 10%;
}

.ep-bg-dot--o2 {
  width: 28px;
  height: 28px;
  background: #ff4d00;
  bottom: 15%;
  left: 20%;
}

.ep-bg-dot--g2 {
  width: 49px;
  height: 49px;
  background: #58cc02;
  top: 8%;
  right: 35%;
}

.ep-bg-dot--y2 {
  width: 21px;
  height: 21px;
  background: #ffd600;
  bottom: 30%;
  left: 40%;
}

/* --- blur circles --- */
.ep-bg-blur {
  position: absolute;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.15;
}

.ep-bg-blur--orange {
  width: 600px;
  height: 600px;
  background: #ff4d00;
}

.ep-bg-blur--green {
  width: 300px;
  height: 300px;
  background: #58cc02;
}

/* --- content --- */
.ep-inner {
  position: relative;
  max-width: 1280px;
  width: 100%;
}

.ep-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ep-code {
  font-family: Helvetica, sans-serif;
  font-size: 280px;
  font-weight: 700;
  color: #ff4d00;
  margin: 0;
  line-height: 1;
  text-align: center;
}

.ep-title {
  font-family: Helvetica, sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 24px 0 0;
  text-align: center;
}

.ep-desc {
  font-family: Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #6b6555;
  margin: 16px 0 0;
  text-align: center;
  max-width: 480px;
  line-height: 1.6;
  padding: 0 18px;
}

.ep-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
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
  margin-top: 32px;
}

.ep-btn:hover {
  background: #e04400;
}
</style>
