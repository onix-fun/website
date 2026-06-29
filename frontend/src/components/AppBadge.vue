<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'orange' | 'green' | 'purple' | 'yellow' | 'dark'
  size?: 'sm' | 'md'
}>(), {
  variant: 'orange',
  size: 'sm',
})
</script>

<template>
  <span
    class="app-badge"
    :class="[
      `app-badge--${variant}`,
      `app-badge--${size}`,
    ]"
  >
    <slot />
  </span>
</template>

<style scoped>
.app-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-family: var(--font-heading);
  font-weight: var(--fw-black);
  text-transform: uppercase;
  line-height: 1;
}

.app-badge--sm {
  padding: 4px 10px;
  font-size: var(--text-3xs);
}

.app-badge--md {
  padding: 4px 12px;
  font-size: var(--text-xs);
}

.app-badge--orange {
  background: var(--accent);
  color: var(--white);
}

.app-badge--green {
  background: var(--green);
  color: var(--white);
}

.app-badge--purple {
  background: var(--purple);
  color: var(--white);
}

.app-badge--yellow {
  background: var(--yellow);
  color: var(--text-dark);
}

.app-badge--dark {
  background: var(--bg-dark);
  color: var(--white);
}
</style>
