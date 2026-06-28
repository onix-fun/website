<script setup lang="ts">
import ErrorPage from '@/components/ErrorPage.vue'
</script>

<template>
  <ErrorPage
    error-code="500"
    title="Ошибка сервера"
    description="Что-то пошло не так. Пожалуйста, попробуйте обновить страницу или вернитесь на главную."
  />
</template>
