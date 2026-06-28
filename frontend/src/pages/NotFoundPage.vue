<script setup lang="ts">
import ErrorPage from '@/components/ErrorPage.vue'
</script>

<template>
  <ErrorPage
    error-code="404"
    title="Страница не найдена"
    description="Возможно, она была перемещена или удалена. Проверьте адрес или вернитесь на главную."
  />
</template>
