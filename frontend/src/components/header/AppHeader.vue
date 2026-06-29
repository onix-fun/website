<template>
  <header
    class="app-header"
    :class="{
      'is-collapsed': isCollapsed,
      'is-mobile': isMobile,
      'is-opened': menuOpen
    }"
  >
    <a href="#main-content" class="skip-to-content">Перейти к содержимому</a>
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

const isCompactHeader = ref(false)

const fullWidth = ref(0)

const collapsedWidth = ref(76)

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

function updateCollapsedWidth() {
  const el = capsuleRef.value
  if (!el) return

  const cssValue = Number.parseFloat(
    getComputedStyle(el).getPropertyValue('--collapsed-capsule-width')
  )

  collapsedWidth.value = Number.isFinite(cssValue)
    ? cssValue
    : isMobile.value
      ? 66
      : isCompactHeader.value
        ? 68
        : 76
}

function onTransitionEnd(e: TransitionEvent) {
  if (e.propertyName !== 'width') return
  if (!isCollapsed.value || menuOpen.value) {
    capsuleWidth.value = null
  }
}

function updateMobile() {
  isCompactHeader.value = window.innerWidth <= 1024
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

async function syncHeaderOnResize() {
  const wasMobile = isMobile.value

  updateMobile()
  await nextTick()
  measure()
  updateCollapsedWidth()

  if (!isMobile.value) {
    if (wasMobile) {
      menuOpen.value = false
    }
    updateScroll()
  }

  if (isCollapsed.value && !menuOpen.value) {
    capsuleWidth.value = collapsedWidth.value
  } else {
    capsuleWidth.value = null
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
  updateCollapsedWidth()
  collapseWatcherInitialized = true

  if (isCollapsed.value && !menuOpen.value) {
    capsuleWidth.value = collapsedWidth.value
  }

  window.addEventListener("resize", syncHeaderOnResize, { passive: true })
  window.addEventListener("scroll", updateScroll, { passive: true })
  window.addEventListener("keydown", onKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", syncHeaderOnResize)
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
  padding-inline: 25px;
}

.app-header__inner {
  max-width: 1280px;
  margin: 0 auto;
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
  width: 58px;
  height: 44px;
  padding: 5px 7px;
  text-decoration: none;
  pointer-events: auto;
  color: #ff4d00;
  overflow: visible;
  transition:
    transform .45s var(--transition),
    opacity .35s;
}

.app-header__logo :deep(svg) {
  width: 45px;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  display: block;
  overflow: visible;
}

.app-header__logo :deep(path) {
  vector-effect: non-scaling-stroke;
}

.is-collapsed:not(.is-mobile) .app-header__logo {
  opacity: 0;
  pointer-events: none;
}

.app-header__logo:hover {
  transform: translateY(-50%) scale(1.05);
}

.nav-capsule {
  --collapsed-capsule-width: 76px;

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

.is-collapsed:not(.is-opened) .nav-capsule {
  overflow: hidden;
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
  visibility: visible;
  transition:
    max-width .45s var(--transition),
    opacity .35s,
    visibility 0s,
    background .30s,
    transform .35s var(--transition),
    box-shadow .35s;
}

.is-collapsed:not(.is-opened) .nav-capsule__item {
  opacity: 0;
  visibility: hidden;
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
  overflow: visible;
}

.nav-capsule__item-icon :deep(svg) {
  width: 24px;
  height: 24px;
  display: block;
  overflow: visible;
}

.nav-capsule__item-label {
  position: relative;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  max-width: 0;
  opacity: 0;
  padding-left: 12px;
  font-size: var(--text-sm);
  font-weight: var(--fw-semibold);
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

.skip-to-content {
  position: absolute;
  top: -100%;
  left: 16px;
  z-index: 1001;
  background: var(--accent);
  color: var(--white);
  padding: 8px 16px;
  border-radius: 999px;
  font-family: var(--font-heading);
  font-size: var(--text-xs);
  font-weight: var(--fw-bold);
  text-decoration: none;
  transition: top 0.2s;
  pointer-events: auto;
}

.skip-to-content:focus {
  top: 8px;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}

@media (min-width: 1025px) {
  .app-header {
    padding-inline: 40px;
  }
}

@media (min-width: 1281px) {
  .app-header {
    padding-inline: 80px;
  }
}

@media (max-width: 1024px) {
  .nav-capsule {
    --collapsed-capsule-width: 68px;

    gap: 4px;
    padding: 4px;
  }

  .nav-capsule__item {
    min-width: 48px;
    max-width: 48px;
    height: 48px;
    padding-inline: 12px;
  }

  .nav-capsule__item:hover {
    max-width: 260px;
  }

  .nav-capsule__item-icon {
    width: 22px;
    height: 22px;
  }

  .nav-capsule__item-icon :deep(svg) {
    width: 22px;
    height: 22px;
  }
}

@media (max-width: 768px) {
  .app-header {
    top: 18px;
  }

  .app-header__logo {
    width: 52px;
    height: 40px;
    padding: 6px 7px;
  }

  .app-header__logo :deep(svg) {
    width: 38px;
    height: auto;
  }

  .nav-capsule {
    --collapsed-capsule-width: 66px;

    right: 0;
  }

  .is-collapsed .nav-capsule__burger,
  .is-opened .nav-capsule__burger {
    width: 48px;
    height: 48px;
    padding: 0 12px;
  }

  .nav-capsule__burger span {
    width: 18px;
    height: 2px;
  }

  .is-opened .nav-capsule__burger span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .is-opened .nav-capsule__burger span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .app-header-spacer {
    height: calc(62px + 18px);
  }

  .is-opened .nav-capsule {
    position: fixed;
    top: 18px;
    right: 16px;
    left: 16px;
    width: auto !important;
    max-width: none;
    transform: none;
    flex-direction: column;
    align-items: stretch;
    border-radius: 28px;
    padding: 8px;
  }

  .is-opened .nav-capsule__burger {
    align-self: flex-end;
  }

  .is-opened .nav-capsule__item {
    width: 100%;
    max-width: none;
    min-width: 0;
    justify-content: flex-start;
    gap: 12px;
    opacity: 1;
    pointer-events: auto;
  }

  .is-opened .nav-capsule__item-label {
    max-width: none;
    opacity: 1;
    padding-left: 0;
    white-space: normal;
  }

  .is-mobile.is-collapsed:not(.is-opened) .nav-capsule__item {
    display: none;
  }

}
</style>
