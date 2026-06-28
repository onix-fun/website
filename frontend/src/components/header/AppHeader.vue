<template>
  <header
    class="app-header"
    :class="{
      'is-collapsed': isCollapsed,
      'is-mobile': isMobile,
      'is-opened': menuOpen
    }"
  >
    <div class="app-header__inner">
      <RouterLink
        class="app-header__logo"
        to="/"
        aria-label="Главная"
      >
        <LogoSvg />
      </RouterLink>

      <div
        class="nav-capsule"
        ref="capsuleRef"
        :style="capsuleStyle"
        @transitionend="onTransitionEnd"
      >
        <button
          class="nav-capsule__burger"
          :aria-expanded="menuOpen"
          aria-label="Открыть меню"
          @click="toggleMenu"
        >
          <span />
          <span />
          <span />
        </button>

        <RouterLink
          v-for="item in items"
          :key="item.id"
          :to="item.to"
          class="nav-capsule__item"
          :class="{
            active: activeId === item.id,
            disabled: item.disabled
          }"
          @mouseenter="hoveredId = item.id"
          @mouseleave="hoveredId = null"
          @click="closeMenu"
        >
          <span class="nav-capsule__item-icon">
            <component :is="item.icon" />
          </span>
          <span
            class="nav-capsule__item-label"
            :class="{ visible: hoveredId === item.id }"
          >
            {{ item.title }}
          </span>
        </RouterLink>
      </div>
    </div>
  </header>

  <div
    v-if="needsSpacer"
    class="app-header-spacer"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from "vue"

import { useRoute } from "vue-router"

import LogoSvg from "@/assets/icons/logo.svg"

import type { HeaderItem } from "./types"

interface Props {
  items: HeaderItem[]
  collapseOffset?: number
}

const props = withDefaults(
  defineProps<Props>(),
  {
    collapseOffset: 50
  }
)

const emit = defineEmits<{
  (e: "collapse", value: boolean): void
  (e: "menu", value: boolean): void
}>()

const route = useRoute()

const capsuleRef = ref<HTMLElement | null>(null)

const hoveredId = ref<string | null>(null)

const menuOpen = ref(false)

const isCollapsed = ref(false)

const isMobile = ref(false)

const fullWidth = ref(0)

const collapsedWidth = computed(() => isMobile.value ? 72 : 74)

const capsuleWidth = ref<number | null>(null)

const capsuleStyle = computed(() => {
  if (capsuleWidth.value === null) return {}
  return { width: capsuleWidth.value + 'px' }
})

const activeId = computed(() => {
  const current = props.items.find(item => item.to === route.path)
  return current?.id ?? null
})

const needsSpacer = computed(() => route.path !== '/')

let collapseWatcherInitialized = false

watch([isCollapsed, menuOpen], ([collapsed, opened]) => {
  if (!collapseWatcherInitialized) return
  const el = capsuleRef.value
  if (!el || !fullWidth.value) return

  if (collapsed && !opened) {
    capsuleWidth.value = el.offsetWidth
    requestAnimationFrame(() => {
      capsuleWidth.value = collapsedWidth.value
    })
  } else if (collapsed && opened) {
    capsuleWidth.value = collapsedWidth.value
    requestAnimationFrame(() => {
      capsuleWidth.value = fullWidth.value
    })
  } else if (!collapsed) {
    if (capsuleWidth.value !== null) {
      capsuleWidth.value = collapsedWidth.value
      requestAnimationFrame(() => {
        capsuleWidth.value = fullWidth.value
      })
    }
  }
})

function measure() {
  const el = capsuleRef.value
  if (!el) return
  el.style.width = ""
  fullWidth.value = el.offsetWidth
}

function onTransitionEnd(e: TransitionEvent) {
  if (e.propertyName !== 'width') return
  if (!isCollapsed.value || menuOpen.value) {
    capsuleWidth.value = null
  }
}

function updateMobile() {
  isMobile.value = window.innerWidth <= 768
  if (isMobile.value) {
    isCollapsed.value = true
  }
}

function updateScroll() {
  if (isMobile.value) return
  const collapsed = window.scrollY > props.collapseOffset
  if (collapsed !== isCollapsed.value) {
    isCollapsed.value = collapsed
    if (!collapsed)
      menuOpen.value = false
    emit("collapse", collapsed)
  }
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  emit("menu", menuOpen.value)
}

function closeMenu() {
  menuOpen.value = false
  emit("menu", false)
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeMenu()
  }
}

watch(
  () => route.fullPath,
  () => {
    closeMenu()
  }
)

onMounted(async () => {
  updateMobile()
  updateScroll()
  await nextTick()
  measure()
  collapseWatcherInitialized = true

  if (isCollapsed.value && !menuOpen.value) {
    capsuleWidth.value = collapsedWidth.value
  }

  window.addEventListener("resize", updateMobile, { passive: true })
  window.addEventListener("scroll", updateScroll, { passive: true })
  window.addEventListener("keydown", onKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateMobile)
  window.removeEventListener("scroll", updateScroll)
  window.removeEventListener("keydown", onKeyDown)
})
</script>

<style scoped>
.app-header {
  --header-height: 62px;
  --header-radius: 999px;
  --header-bg: rgba(245, 240, 232, 0.93);
  --header-border: rgba(212, 208, 200, 0.5);
  --header-shadow:
    0 12px 32px rgba(0,0,0,.08),
    0 4px 0 rgba(212,208,200,0.35);
  --hover-bg: rgba(245, 240, 232, 0.94);
  --active-bg: rgba(245, 240, 232, 1);
  --transition: cubic-bezier(.22,1,.36,1);

  position: fixed;
  inset-inline: 0;
  top: 25px;
  z-index: 1000;
  pointer-events: none;
}

.app-header__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 80px;
  height: var(--header-height);
  position: relative;
  pointer-events: none;
}

.app-header__logo {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 31px;
  text-decoration: none;
  pointer-events: auto;
  color: #ff4d00;
  transition:
    transform .45s var(--transition),
    opacity .35s;
}

.app-header__logo :deep(svg) {
  width: 45px;
  height: 31px;
  display: block;
}

.is-collapsed:not(.is-mobile) .app-header__logo {
  opacity: 0;
  pointer-events: none;
}

.app-header__logo:hover {
  transform: translateY(-50%) scale(1.05);
}

.nav-capsule {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 999px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  background: var(--header-bg);
  border: 1px solid var(--header-border);
  box-shadow: var(--header-shadow);
  pointer-events: auto;
  overflow: hidden;
  transition:
    width .45s var(--transition),
    padding .35s var(--transition),
    gap .35s var(--transition);
}

.nav-capsule__burger {
  flex-shrink: 0;
  width: 0;
  height: 0;
  padding: 0;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 999px;
  opacity: 0;
  transition:
    width .4s var(--transition),
    height .4s var(--transition),
    opacity .35s,
    padding .35s,
    transform .4s var(--transition);
}

.is-collapsed .nav-capsule__burger,
.is-opened .nav-capsule__burger {
  width: 58px;
  height: 58px;
  padding: 0 16px;
  opacity: 1;
}

.is-collapsed .nav-capsule__burger {
  background: var(--header-bg);
  backdrop-filter: blur(24px);
  border: 1px solid var(--header-border);
  box-shadow: var(--header-shadow);
}

.is-opened .nav-capsule__burger {
  background: none;
  border: none;
  box-shadow: none;
}

.nav-capsule__burger:hover {
  transform: scale(1.05);
}

.nav-capsule__burger span {
  width: 22px;
  height: 2px;
  border-radius: 99px;
  background: #1a1a1a;
  transition: all .35s;
}

.is-opened .nav-capsule__burger span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.is-opened .nav-capsule__burger span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.is-opened .nav-capsule__burger span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.nav-capsule__item {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0;
  flex-shrink: 0;
  width: auto;
  min-width: 56px;
  max-width: 56px;
  height: 56px;
  padding-inline: 16px;
  border-radius: 999px;
  color: #1a1a1a;
  text-decoration: none;
  opacity: 1;
  transition:
    max-width .45s var(--transition),
    opacity .35s,
    background .30s,
    transform .35s var(--transition),
    box-shadow .35s;
}

.is-collapsed:not(.is-opened) .nav-capsule__item {
  opacity: 0;
  pointer-events: none;
}

.nav-capsule__item:hover {
  max-width: 300px;
  background: var(--hover-bg);
  box-shadow:
    inset 0 1px rgba(255,255,255,.55),
    0 6px 18px rgba(0,0,0,.08);
}

.nav-capsule__item:active {
  transform: scale(.96);
}

.nav-capsule__item.active {
  background: var(--active-bg);
  color: var(--accent, #ff4d00);
  box-shadow:
    inset 0 1px rgba(255,255,255,.8),
    0 8px 20px rgba(0,0,0,.08);
}

.nav-capsule__item-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 2;
}

.nav-capsule__item-icon :deep(svg) {
  width: 24px;
  height: 24px;
  display: block;
}

.nav-capsule__item-label {
  position: relative;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  max-width: 0;
  opacity: 0;
  padding-left: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  transition:
    max-width .45s var(--transition),
    opacity .25s .18s;
}

.nav-capsule__item-label.visible {
  max-width: 200px;
  opacity: 1;
}

.nav-capsule__item:focus-visible,
.nav-capsule__burger:focus-visible,
.app-header__logo:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 4px;
}

.app-header-spacer {
  height: calc(62px + 25px);
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}

@media (max-width: 1024px) {
  .app-header__inner {
    padding: 0 40px;
  }

  .nav-capsule {
    gap: 6px;
    padding: 6px;
  }

  .nav-capsule__item {
    min-width: 56px;
    max-width: 56px;
    height: 56px;
  }

  .nav-capsule__item:hover {
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .app-header {
    top: 18px;
  }

  .app-header__inner {
    padding: 0 20px;
  }

  .app-header__logo {
    width: 38px;
    height: 26px;
  }

  .app-header__logo :deep(svg) {
    width: 38px;
    height: 26px;
  }

  .nav-capsule {
    right: 0;
  }

  .is-collapsed .nav-capsule__burger,
  .is-opened .nav-capsule__burger {
    width: 56px;
    height: 56px;
  }

  .app-header-spacer {
    height: calc(62px + 18px);
  }
}
</style>
