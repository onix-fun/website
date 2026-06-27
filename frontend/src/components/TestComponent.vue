<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')
const loading = ref(false)

async function handleClick() {
  loading.value = true
  try {
    const res = await fetch('/api/test')
    const data = await res.json()
    message.value = data.message
  } catch {
    message.value = 'Error connecting to server'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <button @click="handleClick" :disabled="loading">
      {{ loading ? 'Loading...' : 'Test Backend' }}
    </button>
    <p v-if="message">{{ message }}</p>
  </div>
</template>
