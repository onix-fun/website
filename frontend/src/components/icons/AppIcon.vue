<script setup lang="ts">
import { computed } from 'vue'

type IconName =
  | 'air'
  | 'account'
  | 'arrow-right'
  | 'brief'
  | 'chat'
  | 'check'
  | 'clock'
  | 'code'
  | 'dialog'
  | 'download'
  | 'github'
  | 'honesty'
  | 'lamp-desk'
  | 'lamp-night'
  | 'mail'
  | 'map-pin'
  | 'phone'
  | 'quality'
  | 'shield'
  | 'sparkles'
  | 'telegram'
  | 'upload'
  | 'usbc'
  | 'vk'
  | 'whatsapp'
  | 'wifi'

interface IconDef {
  viewBox: string
  body: string
}

const props = withDefaults(
  defineProps<{
    name: IconName | string
    size?: number | string
    strokeWidth?: number | string
    title?: string
  }>(),
  {
    size: 24,
    strokeWidth: 2,
  },
)

const icons: Record<string, IconDef> = {
  air: {
    viewBox: '0 0 24 24',
    body: '<path d="M4 8h10a3 3 0 1 0-2.83-4"/><path d="M3 13h15a3 3 0 1 1-2.83 4"/><path d="M5 18h5"/>',
  },
  account: {
    viewBox: '0 0 24 24',
    body: '<path d="M12 3 20 7v5c0 5-3.3 8.2-8 9-4.7-.8-8-4-8-9V7l8-4Z"/><circle cx="12" cy="10" r="2.5"/><path d="M7.8 16.2a5.2 5.2 0 0 1 8.4 0"/>',
  },
  'arrow-right': {
    viewBox: '0 0 24 24',
    body: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  },
  brief: {
    viewBox: '0 0 24 24',
    body: '<path d="M4 7h16v13H4z"/><path d="M9 7V5h6v2"/><path d="M4 12h16"/>',
  },
  chat: {
    viewBox: '0 0 24 24',
    body: '<path d="M5 5h14v10H8l-4 4V6a1 1 0 0 1 1-1Z"/><path d="M8 9h8"/><path d="M8 12h5"/>',
  },
  check: {
    viewBox: '0 0 24 24',
    body: '<path d="m5 13 4 4L19 7"/>',
  },
  clock: {
    viewBox: '0 0 24 24',
    body: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  },
  code: {
    viewBox: '0 0 24 24',
    body: '<path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 5-4 14"/>',
  },
  dialog: {
    viewBox: '0 0 24 24',
    body: '<path d="M7 8h10"/><path d="M7 12h6"/><path d="M18 16h-5l-5 4v-4H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3Z"/>',
  },
  download: {
    viewBox: '0 0 24 24',
    body: '<path d="M12 4v10"/><path d="m8 10 4 4 4-4"/><path d="M5 20h14"/>',
  },
  github: {
    viewBox: '0 0 24 24',
    body: '<path d="M15 22v-3.5a3.5 3.5 0 0 0-1-2.7c3.3-.4 6.8-1.6 6.8-7.2a5.6 5.6 0 0 0-1.5-3.9c.1-.4.6-2-.2-3.9 0 0-1.3-.4-4 1.5a13.8 13.8 0 0 0-7.2 0C5.2.5 3.9.9 3.9.9c-.8 1.9-.3 3.5-.2 3.9a5.6 5.6 0 0 0-1.5 3.9c0 5.6 3.5 6.8 6.8 7.2a3.5 3.5 0 0 0-1 2.7V22"/>',
  },
  honesty: {
    viewBox: '0 0 24 24',
    body: '<path d="M12 3 20 7v5c0 5-3.3 8.2-8 9-4.7-.8-8-4-8-9V7l8-4Z"/><path d="m8 12 3 3 5-6"/>',
  },
  'lamp-desk': {
    viewBox: '0 0 32 32',
    body: '<path d="M4 26 9 9l7-3 7 3 5 17"/><path d="M16 6V3"/><path d="M10 26h12"/><path d="M12 26l4-5 4 5"/>',
  },
  'lamp-night': {
    viewBox: '0 0 32 32',
    body: '<path d="M21 4a12 12 0 1 0 7 19A10 10 0 0 1 21 4Z"/><path d="M9 23h13"/><path d="M12 27h7"/>',
  },
  mail: {
    viewBox: '0 0 24 24',
    body: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  },
  'map-pin': {
    viewBox: '0 0 24 24',
    body: '<path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  },
  phone: {
    viewBox: '0 0 24 24',
    body: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
  },
  quality: {
    viewBox: '0 0 24 24',
    body: '<path d="M12 3 15 9l6 .9-4.5 4.4 1.1 6.2L12 17.5l-5.6 3 1.1-6.2L3 9.9 9 9l3-6Z"/>',
  },
  shield: {
    viewBox: '0 0 24 24',
    body: '<path d="M12 3 20 7v5c0 5-3.3 8.2-8 9-4.7-.8-8-4-8-9V7l8-4Z"/>',
  },
  sparkles: {
    viewBox: '0 0 24 24',
    body: '<path d="M12 3 9.8 9.8 3 12l6.8 2.2L12 21l2.2-6.8L21 12l-6.8-2.2L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/><path d="M19 17v4"/><path d="M17 19h4"/>',
  },
  telegram: {
    viewBox: '0 0 24 24',
    body: '<path d="M21 4 3 11l7 2 2 7 9-16Z"/><path d="m10 13 5-4"/>',
  },
  upload: {
    viewBox: '0 0 24 24',
    body: '<path d="M12 20V5"/><path d="m7 10 5-5 5 5"/><path d="M5 20h14"/>',
  },
  usbc: {
    viewBox: '0 0 24 24',
    body: '<rect x="5" y="8" width="14" height="8" rx="4"/><path d="M9 16v3"/><path d="m12 19 3-3"/>',
  },
  vk: {
    viewBox: '0 0 24 24',
    body: '<path d="M4 7h3l2.1 5.2c.3.8.8.8 1.1 0L12 7h3l-2 5.2 3.5-5.2H20l-4.2 5.7L20 17h-3.5l-3.1-3.1c-.7-.7-1.4-.4-1.4.7V17H9.8C6.7 17 5 14.2 4 7Z"/>',
  },
  whatsapp: {
    viewBox: '0 0 24 24',
    body: '<path d="M4.5 19.5 6 15.8A8 8 0 1 1 9 18.8l-4.5.7Z"/><path d="M9 8.8c.2 3 2.2 5 5.2 5.2l1.3-1.3-2-1-.9.9c-1-.4-1.8-1.2-2.2-2.2l.9-.9-1-2L9 8.8Z"/>',
  },
  wifi: {
    viewBox: '0 0 24 24',
    body: '<path d="M4 9a12 12 0 0 1 16 0"/><path d="M7 12.5a7.5 7.5 0 0 1 10 0"/><path d="M10 16a3 3 0 0 1 4 0"/><circle cx="12" cy="19" r="1"/>',
  },
}

const fallbackIcon = icons.sparkles
const icon = computed(() => icons[props.name] || fallbackIcon)
const sizeValue = computed(() => typeof props.size === 'number' ? `${props.size}px` : props.size)
</script>

<template>
  <svg
    class="app-icon"
    :width="sizeValue"
    :height="sizeValue"
    :viewBox="icon.viewBox"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="title ? 'img' : undefined"
    :aria-hidden="title ? undefined : 'true'"
  >
    <title v-if="title">{{ title }}</title>
    <g v-html="icon.body" />
  </svg>
</template>

<style scoped>
.app-icon {
  display: block;
  flex-shrink: 0;
  overflow: visible;
}
</style>
