<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'orange' | 'green' | 'dark' | 'yellow' | 'purple'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}>(), {
  variant: 'orange',
  size: 'md',
  type: 'button',
})
</script>

<template>
  <component
    :is="to ? 'router-link' : href ? 'a' : 'button'"
    :to="to"
    :href="href"
    :type="to || href ? undefined : type"
    :disabled="disabled"
    class="app-button"
    :class="[
      `app-button--${variant}`,
      `app-button--${size}`,
    ]"
  >
    <slot />
  </component>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 999px;
  font-family: var(--font-body);
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: none;
  border: none;
  outline: none;
  line-height: 1;
  transition: transform 0.2s, box-shadow 0.2s;
}

.app-button--sm {
  padding: 10px 24px;
  font-size: var(--text-2xs);
  font-weight: var(--fw-black);
}

.app-button--md {
  padding: 15px 32px;
  font-size: var(--text-2xs);
}

.app-button--lg {
  padding: 18px 48px;
  font-size: var(--text-xs);
}

.app-button--orange {
  background: var(--accent);
  color: var(--white);
  box-shadow: 0 4px 0 var(--accent-shadow);
}

.app-button--green {
  background: var(--green);
  color: var(--white);
  box-shadow: 0 4px 0 var(--green-shadow);
}

.app-button--dark {
  background: var(--bg-dark);
  color: var(--white);
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.3);
}

.app-button--yellow {
  background: var(--yellow);
  color: var(--text-dark);
  box-shadow: 0 4px 0 var(--yellow-shadow);
}

.app-button--purple {
  background: var(--purple);
  color: var(--white);
  box-shadow: 0 4px 0 var(--purple-shadow);
}

.app-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.app-button:active:not(:disabled) {
  transform: translateY(1px);
}

.app-button:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
